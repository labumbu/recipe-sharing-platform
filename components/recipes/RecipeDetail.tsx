'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Reactions } from './Reactions';
import { Comments } from './Comments';
import { FavoriteButton } from './FavoriteButton';
import type { Recipe, Profile } from '@/types/database';

interface RecipeDetailProps {
  recipe: Recipe;
  profile: Profile | null;
  isOwner: boolean;
  currentUserId: string | null;
}

export function RecipeDetail({ recipe, profile, isOwner, currentUserId }: RecipeDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete recipe');
        setIsDeleting(false);
      }
    } catch (error) {
      alert('An unexpected error occurred');
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-700 dark:to-orange-600 px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {recipe.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              {recipe.category && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {recipe.category}
                </span>
              )}
              {recipe.difficulty && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {recipe.difficulty}
                </span>
              )}
              {recipe.cooking && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  ⏱ {recipe.cooking}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton recipeId={recipe.id} currentUserId={currentUserId} size="md" />
            {isOwner && (
              <>
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                >
                  {isDeleting && <LoadingSpinner size="sm" />}
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-8 space-y-8">
        {/* Author Info */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {profile?.user_name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {profile?.full_name || profile?.user_name || 'Unknown User'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{profile?.user_name || 'unknown'}
            </p>
          </div>
          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {new Date(recipe.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Ingredients Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ingredients
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <div className="whitespace-pre-wrap text-gray-900 dark:text-white">
              {recipe.ingredients}
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Instructions
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <div className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed">
              {recipe.instructions}
            </div>
          </div>
        </div>

        {/* Reactions Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Reactions
          </h3>
          <Reactions recipeId={recipe.id} currentUserId={currentUserId} />
        </div>

        {/* Comments Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Comments
          </h3>
          <Comments recipeId={recipe.id} currentUserId={currentUserId} />
        </div>

        {/* Back Button */}
        <div className="pt-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
