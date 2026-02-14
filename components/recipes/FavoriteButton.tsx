'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface FavoriteButtonProps {
  recipeId: string;
  currentUserId: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ recipeId, currentUserId, size = 'md' }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (currentUserId) {
      checkFavoriteStatus();
    } else {
      setLoading(false);
    }
  }, [recipeId, currentUserId]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}/favorite`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited || false);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!currentUserId) {
      alert('Please sign in to add recipes to favorites');
      return;
    }

    setToggling(true);

    try {
      const method = isFavorited ? 'DELETE' : 'POST';
      const response = await fetch(`/api/recipes/${recipeId}/favorite`, {
        method,
      });

      const data = await response.json();

      if (response.ok) {
        setIsFavorited(!isFavorited);
      } else {
        alert(data.error || 'Failed to update favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('An unexpected error occurred');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="w-8 h-8 flex items-center justify-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <button
      onClick={handleToggle}
      disabled={toggling || !currentUserId}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-colors ${
        isFavorited
          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {toggling ? (
        <LoadingSpinner size="sm" />
      ) : (
        <svg
          className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}`}
          fill={isFavorited ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}
