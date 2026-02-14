export interface Profile {
  id: string;
  user_name: string;
  full_name: string | null;
  email: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  ingredients: string;
  instructions: string;
  cooking: string | null;
  difficulty: string | null;
  category: string | null;
}

export interface RecipeWithProfile extends Recipe {
  profile: Profile | null;
}

export interface RecipeInsert {
  title: string;
  ingredients: string;
  instructions: string;
  cooking?: string | null;
  difficulty?: string | null;
  category?: string | null;
}

export interface ProfileUpdate {
  user_name?: string;
  full_name?: string | null;
  email?: string | null;
  bio?: string | null;
}

export type ReactionType = 'like' | 'heart' | 'thumbs_up' | 'fire' | 'clap';

export interface Reaction {
  id: string;
  recipe_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

export interface ReactionWithProfile extends Reaction {
  profile: Profile | null;
}

export interface Comment {
  id: string;
  recipe_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommentWithProfile extends Comment {
  profile: Profile | null;
}

export interface CommentInsert {
  content: string;
}

export interface CommentUpdate {
  content: string;
}

export interface Favorite {
  id: string;
  recipe_id: string;
  user_id: string;
  created_at: string;
}

export interface FavoriteWithRecipe extends Favorite {
  recipe: Recipe;
  profile: Profile | null;
}
