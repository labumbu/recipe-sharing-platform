import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NewRecipeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex gap-3">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
