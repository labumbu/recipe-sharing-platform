/**
 * Script to add 8 sample recipes to the database
 * Run this with: node scripts/add-sample-recipes.js
 * 
 * Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * in your environment or .env.local file
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  console.error('You need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const sampleRecipes = [
  {
    title: 'Classic Margherita Pizza',
    ingredients: '2 cups all-purpose flour, 1 tsp active dry yeast, 1 tsp salt, 1 cup warm water, 2 tbsp olive oil, 1 cup tomato sauce, 8 oz fresh mozzarella, Fresh basil leaves, Salt and pepper to taste',
    instructions: '1. Mix flour, yeast, and salt in a bowl. Add warm water and olive oil, knead until smooth. 2. Let dough rise for 1 hour. 3. Preheat oven to 475°F. 4. Roll out dough on a floured surface. 5. Spread tomato sauce on dough. 6. Add mozzarella slices. 7. Bake for 12-15 minutes until crust is golden. 8. Top with fresh basil before serving.',
    cooking: '1 hour 30 minutes',
    difficulty: 'Medium',
    category: 'Main Courses'
  },
  {
    title: 'Chocolate Chip Cookies',
    ingredients: '2 1/4 cups all-purpose flour, 1 tsp baking soda, 1 tsp salt, 1 cup butter softened, 3/4 cup granulated sugar, 3/4 cup brown sugar, 2 large eggs, 2 tsp vanilla extract, 2 cups chocolate chips',
    instructions: '1. Preheat oven to 375°F. 2. Mix flour, baking soda, and salt in a bowl. 3. Beat butter and both sugars until creamy. 4. Add eggs and vanilla, mix well. 5. Gradually blend in flour mixture. 6. Stir in chocolate chips. 7. Drop rounded tablespoons onto ungreased baking sheets. 8. Bake 9-11 minutes until golden brown. Cool on baking sheet for 2 minutes.',
    cooking: '25 minutes',
    difficulty: 'Easy',
    category: 'Desserts'
  },
  {
    title: 'Caesar Salad',
    ingredients: '1 head romaine lettuce, 1/2 cup parmesan cheese, 1/2 cup croutons, 1/4 cup Caesar dressing, 2 anchovy fillets (optional), Black pepper',
    instructions: '1. Wash and chop romaine lettuce into bite-sized pieces. 2. Dry lettuce thoroughly. 3. Place lettuce in a large bowl. 4. Add parmesan cheese and croutons. 5. Drizzle with Caesar dressing. 6. Toss gently to coat. 7. Add anchovies if desired. 8. Season with black pepper and serve immediately.',
    cooking: '15 minutes',
    difficulty: 'Easy',
    category: 'Salads'
  },
  {
    title: 'Beef Stir Fry',
    ingredients: '1 lb beef sirloin, 2 bell peppers, 1 onion, 2 cloves garlic, 1 tbsp ginger, 3 tbsp soy sauce, 2 tbsp vegetable oil, 1 tsp cornstarch, Salt and pepper',
    instructions: '1. Slice beef into thin strips. 2. Marinate beef with soy sauce and cornstarch for 15 minutes. 3. Heat oil in a large wok or pan. 4. Stir-fry beef for 2-3 minutes, remove. 5. Add vegetables and stir-fry for 3-4 minutes. 6. Add garlic and ginger, cook 1 minute. 7. Return beef to pan, stir-fry 1 more minute. 8. Season and serve over rice.',
    cooking: '30 minutes',
    difficulty: 'Medium',
    category: 'Main Courses'
  },
  {
    title: 'Blueberry Pancakes',
    ingredients: '1 1/2 cups all-purpose flour, 3 1/2 tsp baking powder, 1 tsp salt, 1 tbsp white sugar, 1 1/4 cups milk, 1 egg, 3 tbsp butter melted, 1 cup fresh blueberries, Maple syrup for serving',
    instructions: '1. Mix flour, baking powder, salt, and sugar in a bowl. 2. Make a well in the center. 3. Beat egg with milk and melted butter. 4. Pour wet ingredients into well, mix until smooth. 5. Gently fold in blueberries. 6. Heat a lightly oiled griddle over medium-high heat. 7. Pour batter onto griddle, cook until bubbles form. 8. Flip and cook until golden brown. Serve with maple syrup.',
    cooking: '20 minutes',
    difficulty: 'Easy',
    category: 'Breakfast'
  },
  {
    title: 'Chicken Tacos',
    ingredients: '1 lb chicken breast, 8 corn tortillas, 1 onion, 2 tomatoes, 1 cup lettuce, 1/2 cup cheese, 1 lime, 2 tbsp taco seasoning, Sour cream, Salsa',
    instructions: '1. Season chicken with taco seasoning. 2. Cook chicken in a pan until done, shred. 3. Warm tortillas in a dry pan. 4. Dice onion and tomatoes. 5. Shred lettuce. 6. Assemble tacos: tortilla, chicken, vegetables, cheese. 7. Top with sour cream and salsa. 8. Squeeze lime juice over top and serve.',
    cooking: '25 minutes',
    difficulty: 'Easy',
    category: 'Main Courses'
  },
  {
    title: 'Fresh Lemonade',
    ingredients: '1 cup fresh lemon juice, 1 cup sugar, 4 cups cold water, Ice cubes, Lemon slices for garnish, Mint leaves (optional)',
    instructions: '1. Squeeze lemons to get 1 cup of juice. 2. In a pitcher, combine lemon juice and sugar. 3. Stir until sugar dissolves. 4. Add cold water and mix well. 5. Add ice cubes. 6. Garnish with lemon slices. 7. Add mint leaves if desired. 8. Serve chilled and enjoy!',
    cooking: '10 minutes',
    difficulty: 'Easy',
    category: 'Beverages'
  },
  {
    title: 'Homemade Guacamole',
    ingredients: '3 ripe avocados, 1/2 onion diced, 1 tomato diced, 1 jalapeño minced, 2 tbsp cilantro, 1 lime juiced, 1/2 tsp salt, Tortilla chips for serving',
    instructions: '1. Cut avocados in half, remove pit. 2. Scoop avocado flesh into a bowl. 3. Mash avocados with a fork to desired consistency. 4. Add diced onion, tomato, and jalapeño. 5. Mix in cilantro. 6. Squeeze lime juice over mixture. 7. Add salt and mix well. 8. Serve immediately with tortilla chips.',
    cooking: '15 minutes',
    difficulty: 'Easy',
    category: 'Snacks'
  }
];

async function addSampleRecipes() {
  try {
    // Get the first user_id from existing recipes
    const { data: existingRecipes, error: fetchError } = await supabase
      .from('recipes')
      .select('user_id')
      .limit(1);

    if (fetchError) {
      console.error('Error fetching existing recipes:', fetchError);
      process.exit(1);
    }

    if (!existingRecipes || existingRecipes.length === 0) {
      console.error('No existing recipes found. Please create at least one recipe first.');
      process.exit(1);
    }

    const userId = existingRecipes[0].user_id;
    console.log(`Adding recipes for user: ${userId}`);

    // Insert all recipes
    const recipesToInsert = sampleRecipes.map(recipe => ({
      ...recipe,
      user_id: userId
    }));

    const { data, error } = await supabase
      .from('recipes')
      .insert(recipesToInsert)
      .select();

    if (error) {
      console.error('Error inserting recipes:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully added ${data.length} recipes!`);
    console.log('\nAdded recipes:');
    data.forEach((recipe, index) => {
      console.log(`${index + 1}. ${recipe.title}`);
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

addSampleRecipes();
