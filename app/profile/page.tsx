import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileView } from '@/components/profile/ProfileView';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default async function ProfilePage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/');
  }

  // Fetch user profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 means no rows returned, which is fine - we'll create the profile
    console.error('Error fetching profile:', error);
  }

  // If profile doesn't exist, create it
  if (!profile) {
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        user_name: user.email?.split('@')[0] || 'User',
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating profile:', createError);
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          <ProfileView 
            profile={newProfile || { id: user.id, user_name: user.email?.split('@')[0] || 'User', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }}
            userId={user.id}
            userEmail={user.email || ''}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <ProfileView 
          profile={profile}
          userId={user.id}
          userEmail={user.email || ''}
        />
      </div>
      <Footer />
    </div>
  );
}
