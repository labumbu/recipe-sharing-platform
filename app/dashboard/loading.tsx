import { RecipeListSkeleton } from '@/components/ui/RecipeListSkeleton';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
          </div>

          {/* Search Bar Skeleton */}
          <div className="mb-6">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>

          {/* Filters Skeleton */}
          <div className="mb-6 space-y-4">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>

          {/* Recipe List Skeleton */}
          <RecipeListSkeleton count={6} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
