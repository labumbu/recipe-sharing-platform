import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Get user's favorite recipes
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's favorites with recipes
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select(`
        *,
        recipe:recipes(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Get profiles for recipe authors
    let favoritesWithProfiles = [];
    if (favorites && favorites.length > 0) {
      const recipeIds = favorites.map(f => f.recipe?.user_id).filter(Boolean);
      const userIds = [...new Set(recipeIds)];
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      favoritesWithProfiles = favorites.map(favorite => ({
        ...favorite,
        recipe: favorite.recipe,
        profile: profiles?.find(p => p.id === favorite.recipe?.user_id) || null,
      }));
    }

    return NextResponse.json(
      { favorites: favoritesWithProfiles },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
