"use client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBox,
  IconBrandTabler,
  IconPhoto,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
}

interface AdminSidebarProps {
  user: AdminUser | null;
  children: React.ReactNode;
}

export function AdminSidebar({ user, children }: AdminSidebarProps) {
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const links = [
    {
      label: "Overview",
      href: "/admin",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },

    {
      label: "Categories",
      href: "/admin/categories",
      icon: (
        <IconBox className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: (
        <IconBox className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    // {
    //   label: 'Users',
    //   href: '/admin/users',
    //   icon: (
    //     <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    //   ),
    // },
    {
      label: "Hero Slides",
      href: "/admin/hero-slides",
      icon: (
        <IconPhoto className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex w-full flex-1 overflow-hidden  border bg-gray-100 dark:bg-neutral-800",
        "h-screen",
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-red-600 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            >
              <IconArrowLeft className="h-5 w-5 shrink-0" />
              Logout
            </button>
          </div>

          <div>
            <SidebarLink
              link={{
                label: user?.name || "",
                href: "/admin/settings",
                icon: (
                  <img
                    src={
                      user?.image ||
                      `https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=random`
                    }
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                    width={50}
                    height={50}
                    alt={user?.name || "Avatar"}
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="/admin"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      <Image
        src="/logo.png"
        alt="Vrse Two"
        width={38}
        height={38}
        className="shrink-0 brightness-0 invert"
        priority
      />
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="/admin"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="/logo.png"
        alt="Vrse Two"
        width={38}
        height={38}
        className="shrink-0 brightness-0 invert"
        priority
      />{" "}
    </a>
  );
};
