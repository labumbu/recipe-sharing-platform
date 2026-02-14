import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { CommentInsert } from '@/types/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch all comments for a recipe
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('recipe_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Get user profiles for comments
    let commentsWithProfiles = [];
    if (comments && comments.length > 0) {
      const userIds = [...new Set(comments.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      commentsWithProfiles = comments.map(comment => ({
        ...comment,
        profile: profiles?.find(p => p.id === comment.user_id) || null,
      }));
    }

    return NextResponse.json({ comments: commentsWithProfiles }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST - Create a new comment
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

    const body: CommentInsert = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (content.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be 1000 characters or less' },
        { status: 400 }
      );
    }

    // Insert comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        recipe_id: id,
        user_id: user.id,
        content: content.trim(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Get profile for the comment
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return NextResponse.json(
      { 
        comment: {
          ...comment,
          profile: profile || null,
        },
        message: 'Comment added successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
