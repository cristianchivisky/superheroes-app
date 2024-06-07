'use client'
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link className="text-gray-600 hover:underline mr-6" href={href}>
    {children}
  </Link>
);

export default function Navbar() {
  return (
    <nav className="mt-0 flex flex-shrink-0 flex-col items-center justify-evenly whitespace-nowrap px-8 text-center tracking-tight md:flex-row md:gap-4 xl:px-5 xl:text-lg bg-neutral-400 min-h-16">
      <Link href="/" className="text-xl hover:underline font-bold mr-6">
        Superheroes App
      </Link>
      <div className="order-1 flex flex-shrink-0 items-center gap-4 xl:gap-8">
        <NavLink href="/house/marvel">Marvel</NavLink>
        <NavLink href="/house/dc">DC</NavLink>
        <NavLink href="/add-superhero">Add Superhero</NavLink>
      </div>
      {/* Barra de búsqueda */}
      <SearchBar />
    </nav>
  );
}

