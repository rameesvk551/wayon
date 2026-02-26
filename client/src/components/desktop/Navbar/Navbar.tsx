import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

interface NavbarProps {
  onMenuClick: () => void;
}

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Visa Explorer', href: '/visa-explorer' },
  { label: 'Trip Planner', href: '/trip-planner' },
  { label: 'Blog', href: '/blog' },
  { label: 'Volunteering', href: '/volunteering' },
];

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const activePath = useMemo(() => {
    const active = navItems.find((item) => location.pathname.startsWith(item.href));
    return active?.href ?? '';
  }, [location.pathname]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (search.trim()) {
      navigate(`/blog?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">RAIH</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-200 dark:focus:bg-gray-700 transition-colors ${activePath === item.href ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-700 dark:text-gray-200'
                }`}
            >
              {item.label}
            </Link>
          ))}

          <form
            onSubmit={handleSearch}
            className="ml-4 flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1 focus-within:ring-2 focus-within:ring-blue-500 transition w-64"
            role="search"
            aria-label="Site search"
          >
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="bg-transparent outline-none px-2 py-1 w-full text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Search..."
              aria-label="Search"
            />
            <button
              type="submit"
              className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700"
              aria-label="Submit search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          <ThemeSwitcher />

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow"
            >
              Sign up
            </Link>
          </div>
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1 focus-within:ring-2 focus-within:ring-blue-500 transition w-32"
            role="search"
            aria-label="Site search"
          >
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="bg-transparent outline-none px-2 py-1 w-full text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Search..."
              aria-label="Search"
            />
            <button
              type="submit"
              className="p-2 text-blue-600 dark:text-blue-400"
              aria-label="Submit search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          <ThemeSwitcher />

          <Link
            to="/login"
            className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-full"
          >
            Sign in
          </Link>

          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
