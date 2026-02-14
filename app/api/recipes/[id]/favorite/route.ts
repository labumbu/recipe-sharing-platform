import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Check if recipe is favorited by current user
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { isFavorited: false },
        { status: 200 }
      );
    }

    // Check if favorited
    const { data: favorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('recipe_id', id)
      .eq('user_id', user.id)
      .single();

    return NextResponse.json(
      { isFavorited: !!favorite },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { isFavorited: false },
      { status: 200 }
    );
  }
}

// POST - Add recipe to favorites
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if recipe exists
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('id')
      .eq('id', id)
      .single();

    if (recipeError || !recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('recipe_id', id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Recipe already in favorites' },
        { status: 400 }
      );
    }

    // Add to favorites
    const { data: favorite, error } = await supabase
      .from('favorites')
      .insert({
        recipe_id: id,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { favorite, message: 'Recipe added to favorites' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE - Remove recipe from favorites
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Remove from favorites
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('recipe_id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Recipe removed from favorites' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
