'use client';

import { useState, useEffect } from 'react';
import type { ReactionType } from '@/types/database';

interface ReactionsProps {
  recipeId: string;
  currentUserId: string | null;
}

interface ReactionCounts {
  like: number;
  heart: number;
  thumbs_up: number;
  fire: number;
  clap: number;
}

const reactionEmojis: Record<string, string> = {
  like: '👍',
  heart: '❤️',
  thumbs_up: '👍',
  fire: '🔥',
  clap: '👏',
};

const reactionLabels: Record<string, string> = {
  like: 'Like',
  heart: 'Love',
  thumbs_up: 'Thumbs Up',
  fire: 'Fire',
  clap: 'Clap',
};

export function Reactions({ recipeId, currentUserId }: ReactionsProps) {
  const [reactionCounts, setReactionCounts] = useState<ReactionCounts>({
    like: 0,
    heart: 0,
    thumbs_up: 0,
    fire: 0,
    clap: 0,
  });
  const [userReactions, setUserReactions] = useState<ReactionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReactions();
  }, [recipeId]);

  const fetchReactions = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}/reactions`);
      const data = await response.json();
      
      if (response.ok) {
        setReactionCounts(data.counts);
        setUserReactions(data.userReactions || []);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (reactionType: ReactionType) => {
    if (!currentUserId) {
      alert('Please sign in to react to recipes');
      return;
    }

    try {
      const response = await fetch(`/api/recipes/${recipeId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reaction_type: reactionType }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh reactions
        await fetchReactions();
      } else {
        alert(data.error || 'Failed to add reaction');
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      alert('An unexpected error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {(['like', 'heart', 'thumbs_up', 'fire', 'clap'] as ReactionType[]).map((type) => {
        const isActive = userReactions.includes(type);
        const count = reactionCounts[type];
        
        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
            }`}
            title={reactionLabels[type]}
          >
            <span className="text-lg">{reactionEmojis[type]}</span>
            {count > 0 && (
              <span className="text-sm font-medium">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
