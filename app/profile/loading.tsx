import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-700 dark:to-orange-600 h-32"></div>
          
          <div className="px-6 pt-20 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
