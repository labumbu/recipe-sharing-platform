import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, user_name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Sign up the user
    // Disable email confirmation by not sending confirmation email
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Don't send confirmation email
        data: {
          user_name: user_name || email.split('@')[0],
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create profile if user was created
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          user_name: user_name || email.split('@')[0],
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't fail the sign-up if profile creation fails
        // The trigger should handle it, but we try anyway
      }
    }

    return NextResponse.json(
      { 
        message: 'Sign up successful! You are now signed in.',
        user: authData.user 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
