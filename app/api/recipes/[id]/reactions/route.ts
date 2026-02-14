import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { ReactionType } from '@/types/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch all reactions for a recipe
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data: reactions, error } = await supabase
      .from('reactions')
      .select('*')
      .eq('recipe_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Get user profiles for reactions
    let reactionsWithProfiles = [];
    if (reactions && reactions.length > 0) {
      const userIds = [...new Set(reactions.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      reactionsWithProfiles = reactions.map(reaction => ({
        ...reaction,
        profile: profiles?.find(p => p.id === reaction.user_id) || null,
      }));
    }

    // Count reactions by type
    const reactionCounts: Record<ReactionType, number> = {
      like: 0,
      heart: 0,
      thumbs_up: 0,
      fire: 0,
      clap: 0,
    };

    reactions?.forEach(reaction => {
      reactionCounts[reaction.reaction_type as ReactionType]++;
    });

    // Get current user's reactions
    const { data: { user } } = await supabase.auth.getUser();
    const userReactions: ReactionType[] = [];
    
    if (user) {
      const { data: userReactionsData } = await supabase
        .from('reactions')
        .select('reaction_type')
        .eq('recipe_id', id)
        .eq('user_id', user.id);
      
      userReactionsData?.forEach(r => {
        userReactions.push(r.reaction_type as ReactionType);
      });
    }

    return NextResponse.json({
      reactions: reactionsWithProfiles,
      counts: reactionCounts,
      userReactions,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST - Add a reaction
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

    const body = await request.json();
    const { reaction_type }: { reaction_type: ReactionType } = body;

    if (!reaction_type || !['like', 'heart', 'thumbs_up', 'fire', 'clap'].includes(reaction_type)) {
      return NextResponse.json(
        { error: 'Invalid reaction type' },
        { status: 400 }
      );
    }

    // Check if user already has this reaction
    const { data: existing } = await supabase
      .from('reactions')
      .select('id')
      .eq('recipe_id', id)
      .eq('user_id', user.id)
      .eq('reaction_type', reaction_type)
      .single();

    if (existing) {
      // Remove reaction if it already exists (toggle)
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('id', existing.id);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: 'Reaction removed', removed: true },
        { status: 200 }
      );
    }

    // Remove any existing reaction of different type from this user
    await supabase
      .from('reactions')
      .delete()
      .eq('recipe_id', id)
      .eq('user_id', user.id);

    // Add new reaction
    const { data: reaction, error } = await supabase
      .from('reactions')
      .insert({
        recipe_id: id,
        user_id: user.id,
        reaction_type,
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
      { reaction, message: 'Reaction added' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
