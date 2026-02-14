export function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-700 dark:to-orange-600 rounded-2xl p-8 sm:p-12 text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Ready to Share Your Recipes?
        </h3>
        <p className="text-orange-50 mb-6 max-w-xl mx-auto">
          Join our community and start sharing your favorite recipes with food lovers around the world.
        </p>
        <button className="px-8 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
          Get Started
        </button>
      </div>
    </section>
  );
}
