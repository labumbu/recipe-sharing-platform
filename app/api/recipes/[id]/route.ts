import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { RecipeInsert } from '@/types/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch single recipe
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ recipe }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// PATCH - Update recipe
export async function PATCH(request: Request, { params }: RouteParams) {
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

    // Fetch recipe to check ownership
    const { data: existingRecipe, error: fetchError } = await supabase
      .from('recipes')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingRecipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    if (existingRecipe.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own recipes' },
        { status: 403 }
      );
    }

    const body: RecipeInsert = await request.json();
    const { title, ingredients, instructions, cooking, difficulty, category } = body;

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!ingredients || !ingredients.trim()) {
      return NextResponse.json(
        { error: 'Ingredients are required' },
        { status: 400 }
      );
    }

    if (!instructions || !instructions.trim()) {
      return NextResponse.json(
        { error: 'Instructions are required' },
        { status: 400 }
      );
    }

    // Update recipe
    const { data: recipe, error } = await supabase
      .from('recipes')
      .update({
        title: title.trim(),
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
        cooking: cooking?.trim() || null,
        difficulty: difficulty?.trim() || null,
        category: category?.trim() || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { recipe, message: 'Recipe updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE - Delete recipe
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

    // Fetch recipe to check ownership
    const { data: existingRecipe, error: fetchError } = await supabase
      .from('recipes')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingRecipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    if (existingRecipe.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own recipes' },
        { status: 403 }
      );
    }

    // Delete recipe
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Recipe deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
