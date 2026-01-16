// app/components/navbar.tsx
import { NavbarClient } from './navbar-client';
// import prisma from '@/lib/prismadb';

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
  return <NavbarClient user={user} />;
}
