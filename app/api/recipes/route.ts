import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { RecipeInsert } from '@/types/database';

export async function POST(request: Request) {
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

    // Insert recipe
    const { data: recipe, error } = await supabase
      .from('recipes')
      .insert({
        user_id: user.id,
        title: title.trim(),
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
        cooking: cooking?.trim() || null,
        difficulty: difficulty?.trim() || null,
        category: category?.trim() || null,
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
      { recipe, message: 'Recipe created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
