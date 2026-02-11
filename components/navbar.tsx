// app/components/navbar.tsx
import { NavbarClient } from './navbar-client';
import { prisma } from '@/lib/prisma';

interface NavbarProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string;
  } | null;
}

export default async function Navbar({ user }: NavbarProps) {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: 'asc' },
  });

  return <NavbarClient user={user} categories={categories} />;
}
