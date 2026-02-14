import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
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

    const { user_name, full_name, email, bio } = await request.json();

    if (!user_name || user_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Username must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Update profile
    const updateData: {
      user_name: string;
      full_name?: string | null;
      email?: string | null;
      bio?: string | null;
      updated_at: string;
    } = {
      user_name: user_name.trim(),
      updated_at: new Date().toISOString(),
    };

    if (full_name !== undefined) {
      updateData.full_name = full_name?.trim() || null;
    }
    if (email !== undefined) {
      updateData.email = email?.trim() || null;
    }
    if (bio !== undefined) {
      updateData.bio = bio?.trim() || null;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { profile },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
