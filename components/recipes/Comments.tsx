'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { CommentWithProfile } from '@/types/database';

interface CommentsProps {
  recipeId: string;
  currentUserId: string | null;
}

export function Comments({ recipeId, currentUserId }: CommentsProps) {
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}/comments`);
      const data = await response.json();
      
      if (response.ok) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUserId) {
      alert('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/recipes/${recipeId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewComment('');
        await fetchComments();
      } else {
        alert(data.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editContent }),
      });

      const data = await response.json();

      if (response.ok) {
        setEditingId(null);
        setEditContent('');
        await fetchComments();
      } else {
        alert(data.error || 'Failed to update comment');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('An unexpected error occurred');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchComments();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('An unexpected error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            maxLength={1000}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 resize-none"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {newComment.length}/1000 characters
            </p>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {submitting && <LoadingSpinner size="sm" />}
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => {
            const isOwner = currentUserId === comment.user_id;
            const isEditing = editingId === comment.id;

            return (
              <div
                key={comment.id}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {comment.profile?.user_name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {comment.profile?.full_name || comment.profile?.user_name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {comment.updated_at !== comment.created_at && ' (edited)'}
                        </p>
                      </div>
                      {isOwner && !isEditing && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(comment.id);
                              setEditContent(comment.content);
                            }}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          maxLength={1000}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(comment.id)}
                            className="px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditContent('');
                            }}
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
