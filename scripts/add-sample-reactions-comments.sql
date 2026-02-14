-- SQL script to add random reactions and comments to all recipes
-- Minimum 50 reactions and 30 comments per recipe
-- Run this in Supabase SQL Editor

-- First, let's create a function to generate random reactions
DO $$
DECLARE
  recipe_record RECORD;
  user_id_val UUID;
  reaction_types TEXT[] := ARRAY['like', 'heart', 'thumbs_up', 'fire', 'clap'];
  reaction_type_val TEXT;
  user_count INT;
  reactions_to_add INT;
  comments_to_add INT;
  comment_text TEXT;
  sample_comments TEXT[] := ARRAY[
    'This looks amazing! Can''t wait to try it.',
    'I made this last week and it was delicious!',
    'Great recipe! My family loved it.',
    'Perfect for a weekend dinner.',
    'I added some extra spices and it turned out great!',
    'This is now my go-to recipe. Thanks for sharing!',
    'The instructions were clear and easy to follow.',
    'I''ve made this three times already. So good!',
    'My kids absolutely loved this dish!',
    'This recipe is a keeper! Will definitely make again.',
    'I substituted a few ingredients and it still worked perfectly.',
    'The cooking time was spot on. Great recipe!',
    'I''m not usually a fan of this type of dish, but this changed my mind!',
    'Easy to make and tastes restaurant-quality.',
    'I shared this with my friends and they all asked for the recipe.',
    'Perfect balance of flavors. Well done!',
    'I made this for a dinner party and got so many compliments.',
    'This recipe exceeded my expectations!',
    'I love how simple yet flavorful this is.',
    'The ingredients are easy to find and the result is fantastic.',
    'I''ve been looking for a recipe like this. Thank you!',
    'This is definitely going into my regular rotation.',
    'I made a few modifications but the base recipe is excellent.',
    'The presentation looks beautiful and it tastes even better!',
    'I''m not the best cook, but this recipe made me look like a pro!',
    'This dish has become a family favorite.',
    'I appreciate how detailed the instructions are.',
    'Made this for meal prep and it reheated perfectly.',
    'The flavors are so well-balanced. Amazing recipe!',
    'I''ve tried many recipes for this dish, and this is the best one.',
    'Simple ingredients but incredible taste!',
    'This recipe is foolproof. Even I couldn''t mess it up!',
    'I love that this can be made ahead of time.',
    'The texture and flavor are perfect.',
    'I''m already planning to make this again next week!',
    'This recipe is a game-changer. So good!',
    'I made this for my partner and they were impressed!',
    'The instructions were easy to follow, even for a beginner.',
    'I love how customizable this recipe is.',
    'This dish is both healthy and delicious!',
    'I''ve made this multiple times and it''s always perfect.',
    'The cooking method is brilliant. Great results!',
    'I shared this recipe with my cooking group and everyone loved it.',
    'This is restaurant-quality food made at home!',
    'I love the combination of ingredients. Very creative!',
    'This recipe is perfect for special occasions.',
    'I made this for a potluck and it was the first to go!',
    'The flavors are complex but the recipe is simple.',
    'I''ve bookmarked this recipe. It''s a winner!',
    'This dish is both beautiful and delicious.'
  ];
BEGIN
  -- Get user count
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  IF user_count = 0 THEN
    RAISE EXCEPTION 'No users found. Please create at least one user profile first.';
  END IF;

  -- Loop through all recipes
  FOR recipe_record IN SELECT id FROM recipes LOOP
    RAISE NOTICE 'Processing recipe: %', recipe_record.id;
    
    -- Add reactions (minimum 50 per recipe)
    reactions_to_add := 50 + FLOOR(RANDOM() * 20)::INT; -- 50-70 reactions
    
    FOR i IN 1..reactions_to_add LOOP
      -- Get random user
      SELECT id INTO user_id_val 
      FROM profiles 
      ORDER BY RANDOM() 
      LIMIT 1;
      
      -- Get random reaction type
      reaction_type_val := reaction_types[1 + FLOOR(RANDOM() * array_length(reaction_types, 1))::INT];
      
      -- Insert reaction (ignore if duplicate)
      INSERT INTO reactions (recipe_id, user_id, reaction_type)
      VALUES (recipe_record.id, user_id_val, reaction_type_val)
      ON CONFLICT (recipe_id, user_id, reaction_type) DO NOTHING;
    END LOOP;
    
    RAISE NOTICE 'Added reactions for recipe: %', recipe_record.id;
    
    -- Add comments (minimum 30 per recipe)
    comments_to_add := 30 + FLOOR(RANDOM() * 15)::INT; -- 30-45 comments
    
    FOR i IN 1..comments_to_add LOOP
      -- Get random user
      SELECT id INTO user_id_val 
      FROM profiles 
      ORDER BY RANDOM() 
      LIMIT 1;
      
      -- Get random comment text
      comment_text := sample_comments[1 + FLOOR(RANDOM() * array_length(sample_comments, 1))::INT];
      
      -- Add some variation to comments
      IF RANDOM() < 0.3 THEN
        comment_text := comment_text || ' Highly recommend!';
      ELSIF RANDOM() < 0.3 THEN
        comment_text := 'Amazing recipe! ' || comment_text;
      END IF;
      
      -- Insert comment with random timestamp (within last 30 days)
      INSERT INTO comments (recipe_id, user_id, content, created_at)
      VALUES (
        recipe_record.id, 
        user_id_val, 
        comment_text,
        NOW() - (RANDOM() * INTERVAL '30 days')
      );
    END LOOP;
    
    RAISE NOTICE 'Added comments for recipe: %', recipe_record.id;
  END LOOP;
  
  RAISE NOTICE 'Finished adding reactions and comments to all recipes!';
END $$;

-- Verify the results
SELECT 
  r.id as recipe_id,
  r.title,
  COUNT(DISTINCT react.id) as reaction_count,
  COUNT(DISTINCT c.id) as comment_count
FROM recipes r
LEFT JOIN reactions react ON r.id = react.recipe_id
LEFT JOIN comments c ON r.id = c.recipe_id
GROUP BY r.id, r.title
ORDER BY r.title;
