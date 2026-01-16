import React from 'react';
import Navbar from '@/components/navbar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Announcement } from '@/components/announcement';
import { Footer } from '@/components/footer';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user || null;
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
