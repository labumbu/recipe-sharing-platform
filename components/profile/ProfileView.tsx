'use client';

import { useState } from 'react';
import type { Profile } from '@/types/database';
import { ProfileEditForm } from './ProfileEditForm';

interface ProfileViewProps {
  profile: Profile;
  userId: string;
  userEmail: string;
}

export function ProfileView({ profile, userId, userEmail }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(profile);

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setCurrentProfile(updatedProfile);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-700 dark:to-orange-600 h-32 relative">
        <div className="absolute bottom-0 left-6 transform translate-y-1/2 flex items-end gap-4">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {currentProfile.user_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {currentProfile.full_name || currentProfile.user_name}
          </h1>
        </div>
      </div>
      
      <div className="px-6 pt-20 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-gray-600 dark:text-gray-400">
              @{currentProfile.user_name}
            </p>
            {(currentProfile.email || userEmail) && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {currentProfile.email || userEmail}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium whitespace-nowrap self-start sm:self-start"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <ProfileEditForm 
            profile={currentProfile}
            onUpdate={handleProfileUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-6">
            {currentProfile.bio && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Bio</p>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {currentProfile.bio}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Member since</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(currentProfile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last updated</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(currentProfile.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
