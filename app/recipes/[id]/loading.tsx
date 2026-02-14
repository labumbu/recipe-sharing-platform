import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function RecipeDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-700 dark:to-orange-600 px-6 py-8">
              <div className="h-10 bg-white/20 rounded w-3/4 mb-4" />
              <div className="flex gap-2">
                <div className="h-6 bg-white/20 rounded-full w-24" />
                <div className="h-6 bg-white/20 rounded-full w-20" />
                <div className="h-6 bg-white/20 rounded-full w-32" />
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="px-6 py-8 space-y-8">
              {/* Author Info Skeleton */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              </div>

              {/* Ingredients Skeleton */}
              <div>
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                </div>
              </div>

              {/* Instructions Skeleton */}
              <div>
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
