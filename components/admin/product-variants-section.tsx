'use client';

import { Fragment, useState, useEffect } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
  Plus,
  X,
  Trash2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductFormData } from '@/schemas/product.schema';

type LocalOption = {
  name: string;
  values: string[];
  draft: string;
};

type Props = {
  form: UseFormReturn<ProductFormData>;
  initialOptions?: { name: string; values: string[] }[];
};

function cartesian(arrays: string[][]): string[][] {
  return arrays.reduce<string[][]>(
    (acc, arr) => acc.flatMap((combo) => arr.map((val) => [...combo, val])),
    [[]],
  );
}

function makeSKU(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SKU-${ts}-${rnd}`;
}

export function ProductVariantsSection({ form, initialOptions }: Props) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const [localOptions, setLocalOptions] = useState<LocalOption[]>([
    { name: '', values: [], draft: '' },
  ]);
  const [expandedDims, setExpandedDims] = useState<Set<number>>(new Set());

  const {
    fields: variantFields,
    replace: replaceVariants,
    remove: removeVariant,
  } = useFieldArray({ control, name: 'variants' });

  useEffect(() => {
    if (initialOptions && initialOptions.length > 0) {
      setLocalOptions(
        initialOptions.map((o) => ({
          name: o.name,
          values: o.values,
          draft: '',
        })),
      );
    }
  }, [initialOptions]);

  // ── option builder helpers ──────────────────────────────────────────────
  const addOption = () =>
    setLocalOptions((prev) => [...prev, { name: '', values: [], draft: '' }]);

  const removeOption = (i: number) =>
    setLocalOptions((prev) => prev.filter((_, idx) => idx !== i));

  const setOptionName = (i: number, name: string) =>
    setLocalOptions((prev) =>
      prev.map((o, idx) => (idx === i ? { ...o, name } : o)),
    );

  const setOptionDraft = (i: number, draft: string) =>
    setLocalOptions((prev) =>
      prev.map((o, idx) => (idx === i ? { ...o, draft } : o)),
    );

  const commitOptionValue = (i: number) => {
    const val = localOptions[i].draft.trim();
    if (!val || localOptions[i].values.includes(val)) {
      setLocalOptions((prev) =>
        prev.map((o, idx) => (idx === i ? { ...o, draft: '' } : o)),
      );
      return;
    }
    setLocalOptions((prev) =>
      prev.map((o, idx) =>
        idx === i ? { ...o, values: [...o.values, val], draft: '' } : o,
      ),
    );
  };

  const removeOptionValue = (optIdx: number, valIdx: number) =>
    setLocalOptions((prev) =>
      prev.map((o, i) =>
        i === optIdx
          ? { ...o, values: o.values.filter((_, vi) => vi !== valIdx) }
          : o,
      ),
    );

  // ── generate variants ───────────────────────────────────────────────────
  const generateVariants = () => {
    const valid = localOptions.filter(
      (o) => o.name.trim() && o.values.length > 0,
    );
    if (valid.length === 0) return;

    const combinations = cartesian(valid.map((o) => o.values));
    const current = (watch('variants') ?? []) as any[];

    // Preserve existing variant data when options match
    const existingMap = new Map<string, (typeof current)[0]>();
    for (const v of current) {
      const opts: { name: string; value: string }[] = v.options ?? [];
      if (opts.length > 0) {
        const key = opts.map((o) => `${o.name}:${o.value}`).join('|');
        existingMap.set(key, v);
      }
    }

    const newVariants = combinations.map((combo) => {
      const variantOptions = combo.map((val, i) => ({
        name: valid[i].name,
        value: val,
      }));
      const key = variantOptions.map((o) => `${o.name}:${o.value}`).join('|');
      const existing = existingMap.get(key);
      return (
        existing ?? {
          options: variantOptions,
          sku: makeSKU(),
          stock: '0',
          price: '',
          length: '',
          width: '',
          height: '',
          weight: '',
        }
      );
    });

    setValue(
      'options',
      valid.map((o) => ({ name: o.name, values: o.values })),
    );
    replaceVariants(newVariants);
    setExpandedDims(new Set());
  };

  const toggleDims = (i: number) =>
    setExpandedDims((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  // ── render ──────────────────────────────────────────────────────────────
  return (
    <div className="bg-neutral-800 rounded-xl shadow-md p-6 space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Product Variants</h2>
        <p className="text-sm text-gray-400 mt-1">
          Define your product options (Color, Size, etc.) then generate all
          combinations automatically.
        </p>
      </div>

      {/* ── Step 1: Options Builder ─────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Step 1 — Define Options
        </p>

        {localOptions.map((opt, i) => (
          <div key={i} className="p-4 bg-neutral-900 rounded-xl">
            <div className="flex items-start gap-3">
              {/* Option name */}
              <Input
                value={opt.name}
                onChange={(e) => setOptionName(i, e.target.value)}
                placeholder="Option name (e.g. Color)"
                className="w-44 shrink-0 bg-neutral-800 border-neutral-700 text-white text-sm"
              />

              {/* Values + draft input */}
              <div className="flex-1 flex flex-wrap gap-2 items-center min-h-[36px]">
                {opt.values.map((val, vi) => (
                  <span
                    key={vi}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-700 text-white text-sm rounded-full"
                  >
                    {val}
                    <button
                      type="button"
                      onClick={() => removeOptionValue(i, vi)}
                      className="text-gray-400 hover:text-red-400 transition ml-0.5"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-1">
                  <Input
                    value={opt.draft}
                    onChange={(e) => setOptionDraft(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        commitOptionValue(i);
                      }
                    }}
                    placeholder="Add value…"
                    className="w-28 h-8 text-sm bg-neutral-800 border-neutral-700 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => commitOptionValue(i)}
                    className="h-8 w-8 flex items-center justify-center bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white transition"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Remove option */}
              {localOptions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="text-gray-500 hover:text-red-400 transition mt-1 shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={addOption}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg px-3 py-2 transition"
          >
            <Plus size={14} />
            Add Option
          </button>
          <button
            type="button"
            onClick={generateVariants}
            className="inline-flex items-center gap-1.5 text-sm font-semibold bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg px-4 py-2 transition"
          >
            {/* <Zap size={14} /> */}
            Generate Variants
          </button>
        </div>
      </div>

      {/* ── Step 2: Variants Table ──────────────────────────────────────── */}
      {variantFields.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Step 2 — Configure Variants
            <span className="ml-2 font-normal text-gray-500 normal-case">
              ({variantFields.length}{' '}
              {variantFields.length === 1 ? 'variant' : 'variants'})
            </span>
          </p>

          <div className="overflow-x-auto rounded-xl border border-neutral-700">
            <table className="w-full text-sm min-w-[680px]">
              <thead className="bg-neutral-900 border-b border-neutral-700">
                <tr className="text-left text-gray-400 text-xs">
                  <th className="px-4 py-3 font-medium">Variant</th>
                  <th className="px-4 py-3 font-medium">SKU *</th>
                  <th className="px-4 py-3 font-medium w-28">Stock *</th>
                  <th className="px-4 py-3 font-medium w-32">Price ($)</th>
                  <th className="px-4 py-3 font-medium w-16 text-center">
                    Dims
                  </th>
                  <th className="px-4 py-3 w-8" />
                </tr>
              </thead>
              <tbody>
                {variantFields.map((field, i) => {
                  const opts = (field as any).options as
                    | { name: string; value: string }[]
                    | undefined;
                  const label =
                    opts && opts.length > 0
                      ? opts.map((o) => o.value).join(' / ')
                      : `Variant ${i + 1}`;
                  const dimOpen = expandedDims.has(i);

                  return (
                    <Fragment key={field.id}>
                      <tr
                        className="border-t border-neutral-700 group hover:bg-neutral-900/40 transition"
                      >
                        <td className="px-4 py-3">
                          <span className="font-medium text-white">
                            {label}
                          </span>
                          {opts?.map((o, oi) => (
                            <span key={oi} className="hidden">
                              {/* options are held in form state via replaceVariants – no DOM input needed */}
                            </span>
                          ))}
                        </td>

                        {/* SKU */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Input
                              {...register(`variants.${i}.sku`)}
                              placeholder="SKU-XXXXX"
                              className="bg-neutral-900 border-neutral-700 text-white text-xs h-8"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setValue(`variants.${i}.sku`, makeSKU())
                              }
                              className="shrink-0 h-8 px-2 bg-neutral-700 hover:bg-neutral-600 text-gray-300 text-xs rounded-md transition"
                            >
                              Gen
                            </button>
                          </div>
                          {errors.variants?.[i]?.sku && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.variants[i]?.sku?.message}
                            </p>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            min="0"
                            {...register(`variants.${i}.stock`)}
                            placeholder="0"
                            className="bg-neutral-900 border-neutral-700 text-white text-xs h-8"
                          />
                          {errors.variants?.[i]?.stock && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.variants[i]?.stock?.message}
                            </p>
                          )}
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...register(`variants.${i}.price`)}
                            placeholder="Base price"
                            className="bg-neutral-900 border-neutral-700 text-white text-xs h-8"
                          />
                          {/* <p className="text-xs text-gray-600 mt-0.5">
                            Empty = base price
                          </p> */}
                        </td>

                        {/* Dims toggle */}
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleDims(i)}
                            title="Shipping dimensions"
                            className="text-gray-400 hover:text-white transition"
                          >
                            {dimOpen ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        </td>

                        {/* Remove */}
                        <td className="px-4 py-3 text-right">
                          {variantFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVariant(i)}
                              className="text-gray-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                            >
                              <X size={15} />
                            </button>
                          )}
                        </td>
                      </tr>

                      {/* Shipping Dimensions (expandable) */}
                      {dimOpen && (
                        <tr
                          className="border-t border-neutral-700/50 bg-neutral-900/30"
                        >
                          <td colSpan={6} className="px-4 py-3">
                            <p className="text-xs text-gray-400 mb-2 font-medium">
                              Shipping dimensions (used for shipping rate
                              calculation)
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {(
                                ['length', 'width', 'height', 'weight'] as const
                              ).map((dim) => (
                                <div key={dim}>
                                  <label className="block text-xs text-gray-500 mb-1 capitalize">
                                    {dim} ({dim === 'weight' ? 'kg' : 'cm'})
                                  </label>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    {...register(`variants.${i}.${dim}`)}
                                    placeholder="0"
                                    className="bg-neutral-900 border-neutral-700 text-white text-xs h-8"
                                  />
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {errors.variants && !Array.isArray(errors.variants) && (
        <p className="text-sm text-red-500 flex items-center gap-1.5">
          <AlertCircle size={14} />
          {errors.variants.message}
        </p>
      )}
    </div>
  );
}
