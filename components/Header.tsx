import Link from 'next/link';
import { UserMenu } from './auth/UserMenu';

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
            RecipeShare
          </Link>
          <nav className="flex items-center gap-4">
            <UserMenu />
          </nav>
        </div>
      </div>
    </header>
  );
}
