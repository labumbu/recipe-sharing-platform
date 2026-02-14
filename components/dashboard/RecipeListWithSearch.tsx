'use client';

import { useState, useMemo } from 'react';
import { RecipeList } from './RecipeList';
import { SearchBar } from './SearchBar';
import { RecipeFilters } from './RecipeFilters';
import type { Recipe, Profile } from '@/types/database';

interface RecipeWithProfile extends Recipe {
  profile: Profile | null;
}

interface RecipeListWithSearchProps {
  recipes: RecipeWithProfile[];
}

export function RecipeListWithSearch({ recipes }: RecipeListWithSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      filtered = filtered.filter((recipe) => {
        // Search in title
        const titleMatch = recipe.title.toLowerCase().includes(query);
        
        // Search in ingredients
        const ingredientsMatch = recipe.ingredients.toLowerCase().includes(query);
        
        // Search in instructions
        const instructionsMatch = recipe.instructions.toLowerCase().includes(query);
        
        // Search in category
        const categoryMatch = recipe.category?.toLowerCase().includes(query);
        
        // Search in author name
        const authorMatch = recipe.profile?.user_name?.toLowerCase().includes(query) ||
                           recipe.profile?.full_name?.toLowerCase().includes(query);
        
        return titleMatch || ingredientsMatch || instructionsMatch || categoryMatch || authorMatch;
      });
    }

    // Apply difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter((recipe) => recipe.difficulty === selectedDifficulty);
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((recipe) => recipe.category === selectedCategory);
    }

    return filtered;
  }, [recipes, searchQuery, selectedDifficulty, selectedCategory]);

  const hasActiveFilters = searchQuery || selectedDifficulty || selectedCategory;

  return (
    <div className="space-y-6">
      <SearchBar 
        value={searchQuery} 
        onChange={setSearchQuery}
        placeholder="Search by title, ingredients, category, or author..."
      />
      
      <RecipeFilters
        selectedDifficulty={selectedDifficulty}
        selectedCategory={selectedCategory}
        onDifficultyChange={setSelectedDifficulty}
        onCategoryChange={setSelectedCategory}
      />
      
      {hasActiveFilters && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedDifficulty && ` with difficulty "${selectedDifficulty}"`}
          {selectedCategory && ` in category "${selectedCategory}"`}
        </div>
      )}
      
      <RecipeList recipes={filteredRecipes} />
    </div>
  );
}
