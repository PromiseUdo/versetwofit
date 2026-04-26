import { z } from 'zod';

const specificationSchema = z.object({
  key: z.string().min(1, 'Specification key is required'),
  value: z.string().min(1, 'Specification value is required'),
});

const aboutItemSchema = z.object({
  value: z.string().min(1, 'Item text is required'),
});

const variantOptionSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

const productOptionSchema = z.object({
  name: z.string().min(1, 'Option name is required'),
  values: z.array(z.string().min(1)).min(1, 'At least one value is required'),
});

export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().min(1, 'Price is required'),
  comparePrice: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  featured: z.boolean(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  aboutItems: z.array(aboutItemSchema).optional(),
  specifications: z.array(specificationSchema).optional(),
  options: z.array(productOptionSchema),
  variants: z
    .array(
      z.object({
        options: z.array(variantOptionSchema),
        sku: z.string().min(1, 'SKU is required'),
        stock: z.string().min(1, 'Stock is required'),
        price: z.string().optional(),
        length: z.string().optional(),
        width: z.string().optional(),
        height: z.string().optional(),
        weight: z.string().optional(),
      })
    )
    .min(1, 'At least one variant is required'),
});

export type ProductFormData = z.infer<typeof productSchema>;
