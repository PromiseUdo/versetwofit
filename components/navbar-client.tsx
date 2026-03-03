// 'use client';

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//   MobileNav,
//   MobileNavHeader,
//   MobileNavMenu,
//   MobileNavToggle,
//   Navbar,
//   NavbarLogo,
//   NavBody,
// } from '@/components/ui/resizable-navbar';
// import {
//   IconHeart,
//   IconLogout,
//   IconPackage,
//   IconSettings,
//   IconShieldCheck,
//   IconShoppingBag,
//   IconUser,
//   IconUserCircle,
// } from '@tabler/icons-react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { signOut } from 'next-auth/react';
// import Link from 'next/link';
// import { useState } from 'react';
// import toast from 'react-hot-toast';
// import SearchModal from './search-modal';
// // import { useCartStore } from '@/store/cartStore';
// import Image from 'next/image';

// interface NavbarClientProps {
//   user: {
//     id: string;
//     email: string;
//     name: string;
//     role: string;
//     image?: string;
//   } | null;
// }

// const categories = [
//   { id: '1', name: 'T-Shirts', slug: 't-shirts' },
//   { id: '2', name: 'Headwears', slug: 'headwears' },
//   { id: '3', name: 'Accessories', slug: 'accessories' },
//   { id: '4', name: 'Tops', slug: 'tops' },
//   { id: '5', name: 'Kicks', slug: 'kicks' },
// ];

// export function NavbarClient({ user }: NavbarClientProps) {
//   //   const totalItems = useCartStore((state) => state.getTotalItems());
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
//   const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
//   const totalItems = 4;

//   const navItems = [
//     {
//       name: 'About',
//       link: '/about',
//     },
//   ];

//   const handleSignOut = async () => {
//     try {
//       await signOut({ callbackUrl: '/' });
//       toast.success('Signed out successfully');
//     } catch (error) {
//       toast.error('Failed to sign out');
//     }
//   };

//   return (
//     <div className="fixed top-0 w-full z-50">
//       <Navbar>
//         {/* Desktop Navigation */}
//         <NavBody>
//           <NavbarLogo />
//           {/* <NavItems items={navItems} /> */}

//           <div className="absolute inset-0 hidden lg:flex flex-1 items-center justify-center pointer-events-none">
//             <div className="flex items-center space-x-2 pointer-events-auto">
//               {navItems.map((item, idx) => (
//                 <Link
//                   key={idx}
//                   href={item.link}
//                   className="relative px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
//                 >
//                   <span className="relative z-20">{item.name}</span>
//                 </Link>
//               ))}
//               {/* <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors focus:outline-none"
//                   >
//                     Categories
//                   </motion.button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   align="start"
//                   className="w-48 bg-linear-to-b from-transparent via-cyan-500 to-transparent animate-move"
//                 >
//                   {categories.map((category) => (
//                     <DropdownMenuItem key={category.id} asChild>
//                       <Link
//                         href={`/categories/${category.slug}`}
//                         className="w-full px-4 py-2  text-sm hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
//                       >
//                         {category.name}
//                       </Link>
//                     </DropdownMenuItem>
//                   ))}
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem asChild>
//                     <Link
//                       href="/categories"
//                       className="w-full cursor-pointer px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 font-medium"
//                     >
//                       View All Categories
//                     </Link>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu> */}

//               {/* <DropdownMenu
//                 open={isCategoriesOpen}
//                 onOpenChange={setIsCategoriesOpen}
//               >
//                 <div
//                   onMouseEnter={() => setIsCategoriesOpen(true)}
//                   onMouseLeave={() => setIsCategoriesOpen(false)}
//                 >
//                   <DropdownMenuTrigger asChild>
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors focus:outline-none"
//                     >
//                       Categories
//                     </motion.button>
//                   </DropdownMenuTrigger>

//                   <DropdownMenuContent
//                     align="start"
//                     className="w-48 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-move"
//                   >
//                     {categories.map((category) => (
//                       <DropdownMenuItem key={category.id} asChild>
//                         <Link
//                           href={`/categories/${category.slug}`}
//                           className="w-full px-4 py-2 text-sm hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
//                         >
//                           {category.name}
//                         </Link>
//                       </DropdownMenuItem>
//                     ))}

//                     <DropdownMenuSeparator />

//                     <DropdownMenuItem asChild>
//                       <Link
//                         href="/categories"
//                         className="w-full cursor-pointer px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 font-medium"
//                       >
//                         View All Categories
//                       </Link>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </div>
//               </DropdownMenu> */}

//               <DropdownMenu
//                 open={isCollectionsOpen}
//                 onOpenChange={setIsCollectionsOpen}
//               >
//                 <DropdownMenuTrigger asChild>
//                   <motion.button
//                     onMouseEnter={() => setIsCollectionsOpen(true)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors focus:outline-none"
//                   >
//                     Collections
//                   </motion.button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent
//                   align="start"
//                   sideOffset={8} /* adds a small gap tolerance */
//                   className="w-48 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-move"
//                   onMouseEnter={() => setIsCollectionsOpen(true)}
//                   onMouseLeave={() => setIsCollectionsOpen(false)}
//                 >
//                   {categories.map((category) => (
//                     <DropdownMenuItem key={category.id} asChild>
//                       <Link
//                         href={`/categories/${category.slug}`}
//                         className="w-full px-4 py-2 text-sm hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
//                       >
//                         {category.name}
//                       </Link>
//                     </DropdownMenuItem>
//                   ))}

//                   {/* <DropdownMenuSeparator /> */}

//                   {/* <DropdownMenuItem asChild>
//                     <Link
//                       href="/categories"
//                       className="w-full cursor-pointer px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 font-medium"
//                     >
//                       View All Categories
//                     </Link>
//                   </DropdownMenuItem> */}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//               <DropdownMenu
//                 open={isCategoriesOpen}
//                 onOpenChange={setIsCategoriesOpen}
//               >
//                 <DropdownMenuTrigger asChild>
//                   <motion.button
//                     onMouseEnter={() => setIsCategoriesOpen(true)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors focus:outline-none"
//                   >
//                     Categories
//                   </motion.button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent
//                   align="start"
//                   sideOffset={8} /* adds a small gap tolerance */
//                   className="w-48 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-move"
//                   onMouseEnter={() => setIsCategoriesOpen(true)}
//                   onMouseLeave={() => setIsCategoriesOpen(false)}
//                 >
//                   {categories.map((category) => (
//                     <DropdownMenuItem key={category.id} asChild>
//                       <Link
//                         href={`/categories/${category.slug}`}
//                         className="w-full px-4 py-2 text-sm hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
//                       >
//                         {category.name}
//                       </Link>
//                     </DropdownMenuItem>
//                   ))}

//                   {/* <DropdownMenuSeparator /> */}

//                   {/* <DropdownMenuItem asChild>
//                     <Link
//                       href="/categories"
//                       className="w-full cursor-pointer px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 font-medium"
//                     >
//                       View All Categories
//                     </Link>
//                   </DropdownMenuItem> */}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {/* Search */}
//             <SearchModal />

//             {/* Wishlist */}
//             <Link href="/wishlist">
//               <motion.div
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 <IconHeart
//                   size={22}
//                   strokeWidth={1.5}
//                   className="text-gray-700 dark:text-gray-300"
//                 />
//               </motion.div>
//             </Link>

//             {/* Shopping Cart */}
//             <Link href="/cart">
//               <motion.div
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 "
//               >
//                 <IconShoppingBag
//                   size={22}
//                   strokeWidth={1.5}
//                   className="text-gray-700 dark:text-gray-300"
//                 />
//                 <AnimatePresence>
//                   {totalItems > 0 && (
//                     <motion.span
//                       key={totalItems}
//                       initial={{ scale: 0, opacity: 0 }}
//                       animate={{ scale: 1, opacity: 1 }}
//                       exit={{ scale: 0, opacity: 0 }}
//                       transition={{
//                         type: 'spring',
//                         stiffness: 500,
//                         damping: 25,
//                       }}
//                       className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900"
//                     >
//                       {totalItems > 99 ? '99+' : totalItems}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             </Link>

//             {/* User Menu */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="relative p-2 "
//                   aria-label="Account menu"
//                 >
//                   {user?.image ? (
//                     <Image
//                       src={user.image}
//                       alt={user.name}
//                       width={24}
//                       height={24}
//                       className="rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
//                     />
//                   ) : (
//                     <IconUser
//                       size={22}
//                       strokeWidth={1.5}
//                       className="text-gray-700 dark:text-gray-300"
//                     />
//                   )}
//                 </motion.button>
//               </DropdownMenuTrigger>

//               <DropdownMenuContent
//                 align="end"
//                 className="w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-xl overflow-hidden"
//                 sideOffset={8}
//               >
//                 {user ? (
//                   <>
//                     {/* User Info */}
//                     <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
//                       <div className="flex items-center gap-3">
//                         {user.image ? (
//                           <Image
//                             src={user.image}
//                             alt={user.name}
//                             width={40}
//                             height={40}
//                             className="rounded-full ring-2 ring-white dark:ring-gray-800"
//                           />
//                         ) : (
//                           <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
//                             <IconUserCircle
//                               size={24}
//                               className="text-indigo-600 dark:text-indigo-400"
//                             />
//                           </div>
//                         )}
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//                             {user.name}
//                           </p>
//                           <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
//                             {user.email}
//                           </p>
//                         </div>
//                       </div>
//                       {user.role === 'ADMIN' && (
//                         <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900 rounded-full">
//                           <IconShieldCheck
//                             size={12}
//                             className="text-indigo-600 dark:text-indigo-400"
//                           />
//                           <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
//                             Admin
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     <DropdownMenuSeparator />

//                     {/* Admin Dashboard */}
//                     {user.role === 'ADMIN' && (
//                       <>
//                         <DropdownMenuItem asChild>
//                           <Link
//                             href="/admin"
//                             className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-4 py-3 text-gray-800 dark:text-gray-200 font-medium"
//                           >
//                             <IconShieldCheck
//                               size={18}
//                               className="text-indigo-600 dark:text-indigo-400"
//                             />
//                             <span>Admin Dashboard</span>
//                           </Link>
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                       </>
//                     )}

//                     {/* My Orders */}
//                     <DropdownMenuItem asChild>
//                       <Link
//                         href="/orders"
//                         className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-4 py-3 text-gray-800 dark:text-gray-200 font-medium"
//                       >
//                         <IconPackage
//                           size={18}
//                           className="text-gray-600 dark:text-gray-400"
//                         />
//                         <span>My Orders</span>
//                       </Link>
//                     </DropdownMenuItem>

//                     {/* Wishlist */}
//                     <DropdownMenuItem asChild>
//                       <Link
//                         href="/wishlist"
//                         className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-4 py-3 text-gray-800 dark:text-gray-200 font-medium"
//                       >
//                         <IconHeart
//                           size={18}
//                           className="text-gray-600 dark:text-gray-400"
//                         />
//                         <span>Wishlist</span>
//                       </Link>
//                     </DropdownMenuItem>

//                     {/* Account Settings */}
//                     <DropdownMenuItem asChild>
//                       <Link
//                         href="/account"
//                         className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-4 py-3 text-gray-800 dark:text-gray-200 font-medium"
//                       >
//                         <IconSettings
//                           size={18}
//                           className="text-gray-600 dark:text-gray-400"
//                         />
//                         <span>Account Settings</span>
//                       </Link>
//                     </DropdownMenuItem>

//                     <DropdownMenuSeparator />

//                     {/* Logout */}
//                     <DropdownMenuItem
//                       onClick={handleSignOut}
//                       className="flex items-center gap-3 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950 transition-colors px-4 py-3 text-red-600 dark:text-red-400 font-medium focus:bg-red-50 dark:focus:bg-red-950"
//                     >
//                       <IconLogout size={18} />
//                       <span>Logout</span>
//                     </DropdownMenuItem>
//                   </>
//                 ) : (
//                   <>
//                     {/* Guest User */}
//                     <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800">
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         Sign in to access your account
//                       </p>
//                     </div>

//                     <DropdownMenuSeparator />

//                     {/* Login */}
//                     <DropdownMenuItem asChild>
//                       <Link
//                         href="/login"
//                         className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-4 py-3 text-gray-800 dark:text-gray-200 font-medium"
//                       >
//                         <IconUser
//                           size={18}
//                           className="text-gray-600 dark:text-gray-400"
//                         />
//                         <span>Login</span>
//                       </Link>
//                     </DropdownMenuItem>

//                     {/* Register */}
//                     <DropdownMenuItem asChild>
//                       <Link
//                         href="/register"
//                         className="flex items-center gap-3 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors px-4 py-3 text-indigo-600 dark:text-indigo-400 font-semibold"
//                       >
//                         <IconUserCircle size={18} />
//                         <span>Create Account</span>
//                       </Link>
//                     </DropdownMenuItem>
//                   </>
//                 )}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </NavBody>

//         {/* Mobile Navigation */}
//         <MobileNav>
//           <MobileNavHeader>
//             <NavbarLogo />
//             <div className="flex items-center gap-3">
//               {/* Mobile Cart Badge */}
//               <Link href="/cart" className="relative">
//                 <motion.div
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="relative"
//                 >
//                   <IconShoppingBag
//                     size={22}
//                     strokeWidth={1.5}
//                     className="text-gray-700 dark:text-gray-300"
//                   />
//                   <AnimatePresence>
//                     {totalItems > 0 && (
//                       <motion.span
//                         key={totalItems}
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         exit={{ scale: 0 }}
//                         className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
//                       >
//                         {totalItems > 9 ? '9+' : totalItems}
//                       </motion.span>
//                     )}
//                   </AnimatePresence>
//                 </motion.div>
//               </Link>

//               <MobileNavToggle
//                 isOpen={isMobileMenuOpen}
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               />
//             </div>
//           </MobileNavHeader>

//           <MobileNavMenu
//             isOpen={isMobileMenuOpen}
//             onClose={() => setIsMobileMenuOpen(false)}
//           >
//             {/* User Profile Section - Mobile */}
//             {user ? (
//               <div className="px-4 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl mb-4">
//                 <div className="flex items-center gap-3">
//                   {user.image ? (
//                     <Image
//                       src={user.image}
//                       alt={user.name}
//                       width={48}
//                       height={48}
//                       className="rounded-full ring-2 ring-white dark:ring-gray-800"
//                     />
//                   ) : (
//                     <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
//                       <IconUserCircle
//                         size={28}
//                         className="text-indigo-600 dark:text-indigo-400"
//                       />
//                     </div>
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//                       {user.name}
//                     </p>
//                     <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
//                       {user.email}
//                     </p>
//                     {user.role === 'ADMIN' && (
//                       <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full font-medium">
//                         Admin
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
//                   Sign in to access your account
//                 </p>
//                 <div className="flex gap-2">
//                   <Link
//                     href="/login"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-center text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     href="/register"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-center text-sm font-medium hover:bg-indigo-700 transition-colors"
//                   >
//                     Sign Up
//                   </Link>
//                 </div>
//               </div>
//             )}

//             {/* Navigation Links */}
//             <div className="space-y-1 mb-4">
//               {navItems.map((item, idx) => (
//                 <Link
//                   key={`mobile-link-${idx}`}
//                   href={item.link}
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
//                 >
//                   <span>{item.name}</span>
//                 </Link>
//               ))}
//             </div>

//             {/* Quick Actions */}
//             <div className="space-y-1 border-t border-gray-200 dark:border-gray-800 pt-4">
//               <Link
//                 href="/wishlist"
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//               >
//                 <IconHeart
//                   size={20}
//                   className="text-gray-500 dark:text-gray-400"
//                 />
//                 <span className="font-medium">Wishlist</span>
//               </Link>

//               <Link
//                 href="/cart"
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//               >
//                 <IconShoppingBag
//                   size={20}
//                   className="text-gray-500 dark:text-gray-400"
//                 />
//                 <span className="font-medium">Shopping Cart</span>
//                 {totalItems > 0 && (
//                   <span className="ml-auto bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
//                     {totalItems}
//                   </span>
//                 )}
//               </Link>

//               {user && (
//                 <>
//                   <Link
//                     href="/orders"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                   >
//                     <IconPackage
//                       size={20}
//                       className="text-gray-500 dark:text-gray-400"
//                     />
//                     <span className="font-medium">My Orders</span>
//                   </Link>

//                   {user.role === 'ADMIN' && (
//                     <Link
//                       href="/admin"
//                       onClick={() => setIsMobileMenuOpen(false)}
//                       className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
//                     >
//                       <IconShieldCheck size={20} />
//                       <span className="font-semibold">Admin Dashboard</span>
//                     </Link>
//                   )}

//                   <Link
//                     href="/account"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                   >
//                     <IconSettings
//                       size={20}
//                       className="text-gray-500 dark:text-gray-400"
//                     />
//                     <span className="font-medium">Account Settings</span>
//                   </Link>

//                   <button
//                     onClick={() => {
//                       handleSignOut();
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
//                   >
//                     <IconLogout size={20} />
//                     <span className="font-medium">Logout</span>
//                   </button>
//                 </>
//               )}
//             </div>
//           </MobileNavMenu>
//         </MobileNav>
//       </Navbar>
//     </div>
//   );
// }

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarLogo,
  NavBody,
} from "@/components/ui/resizable-navbar";
import {
  IconHeart,
  IconLogout,
  IconPackage,
  IconSettings,
  IconShieldCheck,
  IconShoppingBag,
  IconUser,
  IconUserCircle,
  IconShirt,
  IconCrown,
  IconDiamond,
  IconHanger,
  IconShoe,
  IconSunglasses,
  IconDeviceWatch,
  IconJacket,
  IconCategory,
  IconArrowRight,
  IconChevronDown,
  IconBackpack,
  IconBallBasketball,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import SearchModal from "./search-modal";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import type { ComponentType } from "react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface NavbarClientProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string;
  } | null;
  categories: CategoryItem[];
}

// Map category slugs to relevant Tabler icons
const categoryIconMap: Record<
  string,
  ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
> = {
  "t-shirts": IconShirt,
  headwears: IconCrown,
  headwear: IconCrown,
  accessories: IconDiamond,
  tops: IconHanger,
  kicks: IconShoe,
  sunglasses: IconSunglasses,
  watches: IconDeviceWatch,
  jackets: IconJacket,
  bags: IconBackpack,
  jerseys: IconBallBasketball,
  sweatshirt: IconJacket,
  sweatshirts: IconJacket,
};

function getCategoryIcon(slug: string) {
  return categoryIconMap[slug] || IconCategory;
}

export function NavbarClient({ user, categories }: NavbarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ref for close delay timeout
  const categoriesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openCategories = useCallback(() => {
    if (categoriesTimeoutRef.current)
      clearTimeout(categoriesTimeoutRef.current);
    setIsCategoriesOpen(true);
  }, []);

  const closeCategories = useCallback(() => {
    categoriesTimeoutRef.current = setTimeout(() => {
      setIsCategoriesOpen(false);
    }, 150);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (categoriesTimeoutRef.current)
        clearTimeout(categoriesTimeoutRef.current);
    };
  }, []);

  // Get cart total from Zustand store
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [totalItems, setTotalItems] = useState(0);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setTotalItems(getTotalItems());
    }
  }, [mounted, getTotalItems]);

  // Subscribe to cart changes
  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = useCartStore.subscribe((state) => {
      setTotalItems(state.getTotalItems());
    });

    return () => unsubscribe();
  }, [mounted]);

  const navItems = [
    {
      name: "About",
      link: "/about",
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="fixed top-0 w-full z-50">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />

          <div className="absolute inset-0 hidden lg:flex flex-1 items-center justify-center pointer-events-none">
            <div className="flex items-center space-x-2 pointer-events-auto">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  className="relative px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  <span className="relative z-20">{item.name}</span>
                </Link>
              ))}

              {/* Categories Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={openCategories}
                onMouseLeave={closeCategories}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors focus:outline-none"
                >
                  Categories
                  <motion.span
                    animate={{ rotate: isCategoriesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconChevronDown size={14} strokeWidth={2} />
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl rounded-xl overflow-hidden z-20"
                    >
                      <div className="p-3 grid grid-cols-2 gap-1">
                        {categories.map((category) => {
                          const Icon = getCategoryIcon(category.slug);
                          return (
                            <Link
                              key={category.id}
                              href={`/category/${category.slug}`}
                              className="group flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-all duration-200"
                            >
                              <div className="flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors">
                                <Icon size={20} strokeWidth={1.5} />
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                                {category.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>

                      {/* <div className="p-2 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                        <Link
                          href="/categories"
                          className="flex items-center justify-center gap-2 w-full p-2 text-sm font-medium text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                        >
                          <span>Browse Full Collection</span>
                          <IconArrowRight size={16} strokeWidth={1.5} />
                        </Link>
                      </div> */}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <SearchModal />

            {/* Wishlist */}
            <Link href="/wishlist">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <IconHeart
                  size={22}
                  strokeWidth={1.5}
                  className="text-gray-700 dark:text-gray-300"
                />
              </motion.div>
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <IconShoppingBag
                  size={22}
                  strokeWidth={1.5}
                  className="text-gray-700 dark:text-gray-300"
                />
                <AnimatePresence>
                  {mounted && totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      }}
                      className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Account menu"
                >
                  {user ? (
                    <img
                      src={
                        user.image ||
                        `https://ui-avatars.com/api/?name=${user.name || "User"}&background=random`
                      }
                      alt={user.name || "User"}
                      width={22}
                      height={22}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <IconUser
                      size={22}
                      strokeWidth={1.5}
                      className="text-gray-700 dark:text-gray-300"
                    />
                  )}
                </motion.button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-xl overflow-hidden"
                sideOffset={8}
              >
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-gray-800 dark:to-gray-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.image ||
                            `https://ui-avatars.com/api/?name=${user.name || "User"}&background=random`
                          }
                          alt={user.name || "User"}
                          width={40}
                          height={40}
                          className="rounded-full ring-2 ring-white dark:ring-gray-800 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      {user.role === "ADMIN" && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-primary/10 dark:bg-primary/20 rounded-full">
                          <IconShieldCheck
                            size={12}
                            className="text-primary dark:text-primary-foreground"
                          />
                          <span className="text-xs font-medium text-primary dark:text-primary-foreground">
                            Admin
                          </span>
                        </div>
                      )}
                    </div>

                    <DropdownMenuSeparator />

                    {/* Admin Dashboard */}
                    {user.role === "ADMIN" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-4 py-3 text-gray-800 dark:text-gray-200 font-medium group"
                          >
                            <IconShieldCheck
                              size={18}
                              className="text-primary dark:text-primary-foreground group-hover:text-primary/80"
                            />
                            <span>Admin Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    {/* My Orders */}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-4 py-3 text-gray-800 dark:text-gray-200 font-medium"
                      >
                        <IconPackage
                          size={18}
                          className="text-gray-600 dark:text-gray-400"
                        />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Wishlist */}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-4 py-3 text-gray-800 dark:text-gray-200 font-medium"
                      >
                        <IconHeart
                          size={18}
                          className="text-gray-600 dark:text-gray-400"
                        />
                        <span>Wishlist</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Account Settings */}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/account"
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-4 py-3 text-gray-800 dark:text-gray-200 font-medium"
                      >
                        <IconSettings
                          size={18}
                          className="text-gray-600 dark:text-gray-400"
                        />
                        <span>Account Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Logout */}
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center gap-3 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950 transition-colors px-4 py-3 text-red-600 dark:text-red-400 font-medium focus:bg-red-50 dark:focus:bg-red-950"
                    >
                      <IconLogout size={18} />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    {/* Guest User */}
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sign in to access your account
                      </p>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Login */}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/login"
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-4 py-3 text-gray-800 dark:text-gray-200 font-medium"
                      >
                        <IconUser
                          size={18}
                          className="text-gray-600 dark:text-gray-400"
                        />
                        <span>Login</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Register */}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/register"
                        className="flex items-center gap-3 cursor-pointer hover:bg-primary/10 transition-colors px-4 py-3 text-primary font-semibold"
                      >
                        <IconUserCircle size={18} />
                        <span>Create Account</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-3">
              {/* Mobile Cart Badge */}
              <Link href="/cart" className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <IconShoppingBag
                    size={22}
                    strokeWidth={1.5}
                    className="text-gray-700 dark:text-gray-300"
                  />
                  <AnimatePresence>
                    {mounted && totalItems > 0 && (
                      <motion.span
                        key={totalItems}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
                      >
                        {totalItems > 9 ? "9+" : totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>

              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {/* User Profile Section - Mobile */}
            {user ? (
              <div className="px-4 py-4 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-gray-800 dark:to-gray-900 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user.image ||
                      `https://ui-avatars.com/api/?name=${user.name || "User"}&background=random`
                    }
                    alt={user.name || "User"}
                    width={48}
                    height={48}
                    className="rounded-full ring-2 ring-white dark:ring-gray-800 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    {user.role === "ADMIN" && (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground rounded-full font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Sign in to access your account
                </p>
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-center text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-center text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1 mb-4">
              {navItems.map((item, idx) => (
                <Link
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Categories Grid */}
            {categories.length > 0 && (
              <div className="mb-4 border-t border-gray-200 dark:border-gray-800 pt-4">
                <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Categories
                </p>
                <div className="px-3 grid grid-cols-3 gap-2">
                  {categories.map((category) => {
                    const Icon = getCategoryIcon(category.slug);
                    return (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary/5 dark:hover:bg-primary/10 transition-all"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800">
                          <Icon
                            size={20}
                            strokeWidth={1.5}
                            className="text-gray-600 dark:text-gray-400"
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                          {category.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href="/categories"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1 mx-4 mt-3 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <span>Browse All</span>
                  <IconArrowRight size={14} strokeWidth={2} />
                </Link>
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-1 border-t border-gray-200 dark:border-gray-800 pt-4">
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <IconHeart
                  size={20}
                  className="text-gray-500 dark:text-gray-400"
                />
                <span className="font-medium">Wishlist</span>
              </Link>

              <Link
                href="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <IconShoppingBag
                  size={20}
                  className="text-gray-500 dark:text-gray-400"
                />
                <span className="font-medium">Shopping Cart</span>
                {mounted && totalItems > 0 && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user && (
                <>
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <IconPackage
                      size={20}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <span className="font-medium">My Orders</span>
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                    >
                      <IconShieldCheck size={20} />
                      <span className="font-semibold">Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <IconSettings
                      size={20}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <span className="font-medium">Account Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    <IconLogout size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
