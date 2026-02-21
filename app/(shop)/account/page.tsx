"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  ShoppingBag,
  Heart,
  Calendar,
  Loader2,
  Save,
  Eye,
  EyeOff,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Box,
  ArrowRight,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  hasPassword: boolean;
  createdAt: string;
  orderCount: number;
  wishlistCount: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: {
    id: string;
    name: string;
    image: string | null;
    quantity: number;
    price: number;
  }[];
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof Clock }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Box,
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileDirty, setProfileDirty] = useState(false);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account");
    }
  }, [status, router]);

  // Fetch profile data
  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/api/account");
      setProfile(data.user);
      setRecentOrders(data.recentOrders);
      setProfileForm({
        name: data.user.name || "",
        phone: data.user.phone || "",
      });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    setProfileDirty(true);
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const { data } = await axios.patch("/api/account", profileForm);
      setProfile((prev) => (prev ? { ...prev, ...data.user } : prev));
      setProfileDirty(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSavingPassword(true);
    try {
      await axios.patch("/api/account/password", passwordForm);
      toast.success("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Update hasPassword state
      setProfile((prev) => (prev ? { ...prev, hasPassword: true } : prev));
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = [
    "bg-gray-200",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-emerald-500",
  ];

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 h-48 bg-linear-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
            <p className="text-sm text-gray-500">Loading your account...</p>
          </div>
        </div>
      </>
    );
  }

  if (!session || !profile) return null;

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-48 bg-linear-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="min-h-screen my-24">
        <MaxWidthWrapper>
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  {profile.image ? (
                    <Image
                      src={profile.image}
                      alt={profile.name || "User"}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary/10"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center ring-4 ring-primary/5">
                      <span className="text-2xl font-bold text-primary">
                        {getInitials(profile.name)}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white" />
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.name || "User"}
                  </h1>
                  <p className="text-gray-500 mt-0.5">{profile.email}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2 text-xs text-gray-400">
                    <Calendar size={12} />
                    <span>Member since {formatDate(profile.createdAt)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 sm:gap-8">
                  <Link
                    href="/orders"
                    className="text-center group cursor-pointer"
                  >
                    <p className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {profile.orderCount}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Orders</p>
                  </Link>
                  <Link
                    href="/wishlist"
                    className="text-center group cursor-pointer"
                  >
                    <p className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {profile.wishlistCount}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Wishlist</p>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column — Profile & Password */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Personal Information
                    </h2>
                    <p className="text-sm text-gray-500">
                      Update your name and contact details
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400"
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        handleProfileChange("name", e.target.value)
                      }
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Input
                        className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400 pr-10 opacity-60 cursor-not-allowed"
                        type="email"
                        value={profile.email}
                        disabled
                        readOnly
                      />
                      <Mail
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Email cannot be changed for security reasons
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      placeholder="(555) 123-4567"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">
                      Used for order updates and delivery notifications
                    </p>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={!profileDirty || isSavingProfile}
                      className={cn(
                        "px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2",
                        profileDirty
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed",
                      )}
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Security — Change Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                    <Shield size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Security
                    </h2>
                    <p className="text-sm text-gray-500">
                      {profile.hasPassword
                        ? "Change your password"
                        : "Set a password for your account"}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-5">
                  {/* Current Password — only show if user has one */}
                  {profile.hasPassword && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400 pr-10"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {!profile.hasPassword && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                      <Lock
                        size={18}
                        className="text-blue-500 mt-0.5 shrink-0"
                      />
                      <p className="text-sm text-blue-700">
                        You signed up with Google. Setting a password lets you
                        also sign in with your email and password.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400 pr-10"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {passwordForm.newPassword && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                                i < passwordStrength
                                  ? strengthColors[passwordStrength]
                                  : "bg-gray-200",
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          {strengthLabels[passwordStrength]}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input
                        className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400 pr-10"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>

                    {passwordForm.confirmPassword &&
                      passwordForm.newPassword !==
                        passwordForm.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1.5">
                          Passwords do not match
                        </p>
                      )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={
                        isSavingPassword ||
                        !passwordForm.newPassword ||
                        !passwordForm.confirmPassword ||
                        passwordForm.newPassword !==
                          passwordForm.confirmPassword
                      }
                      className={cn(
                        "px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2",
                        passwordForm.newPassword &&
                          passwordForm.confirmPassword &&
                          passwordForm.newPassword ===
                            passwordForm.confirmPassword
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed",
                      )}
                    >
                      {isSavingPassword ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Shield size={16} />
                          {profile.hasPassword
                            ? "Update Password"
                            : "Set Password"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Right Column — Recent Orders & Quick Links */}
            <div className="space-y-6">
              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                      <ShoppingBag size={20} className="text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Recent Orders
                    </h2>
                  </div>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500 mb-3">No orders yet</p>
                    <Link
                      href="/products"
                      className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
                    >
                      Start Shopping <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => {
                      const statusConfig =
                        STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                      const StatusIcon = statusConfig.icon;

                      return (
                        <Link
                          key={order.id}
                          href={`/orders/${order.id}`}
                          className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-gray-50/50 transition-all duration-200"
                        >
                          {/* Order thumbnail */}
                          <div className="relative w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                            {order.items[0]?.image ? (
                              <Image
                                src={order.items[0].image}
                                alt={order.items[0].name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={18} className="text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Order info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900 font-mono">
                                #{order.orderNumber}
                              </span>
                              <span
                                className={cn(
                                  "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border",
                                  statusConfig.color,
                                )}
                              >
                                <StatusIcon size={10} />
                                {statusConfig.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatShortDate(order.createdAt)} · $
                              {order.totalAmount.toFixed(2)}
                            </p>
                          </div>

                          {/* Arrow */}
                          <ChevronRight
                            size={16}
                            className="text-gray-300 group-hover:text-primary transition-colors shrink-0"
                          />
                        </Link>
                      );
                    })}

                    <Link
                      href="/orders"
                      className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      View All Orders
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Quick Links
                </h3>
                <div className="space-y-1">
                  {[
                    {
                      href: "/orders",
                      icon: ShoppingBag,
                      label: "My Orders",
                      desc: "Track and manage orders",
                    },
                    {
                      href: "/wishlist",
                      icon: Heart,
                      label: "Wishlist",
                      desc: "Your saved items",
                    },
                    {
                      href: "/products",
                      icon: Package,
                      label: "Shop",
                      desc: "Browse products",
                    },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gray-50 group-hover:bg-primary/5 flex items-center justify-center transition-colors">
                        <link.icon
                          size={18}
                          className="text-gray-400 group-hover:text-primary transition-colors"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {link.label}
                        </p>
                        <p className="text-xs text-gray-400">{link.desc}</p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-300 group-hover:text-primary transition-colors"
                      />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
