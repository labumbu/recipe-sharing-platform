# GitHub Setup Instructions

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `recipe-sharing-platform` (or any name you prefer)
   - **Description**: "A recipe sharing platform built with Next.js and Supabase"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
cd "/Users/newbe/Dropbox/VS Code/cursor-projects-1/recipe-sharing-platform"

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/recipe-sharing-platform.git

# Or if you prefer SSH:
# git remote add origin git@github.com:YOUR_USERNAME/recipe-sharing-platform.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Verify

1. Go to your GitHub repository page
2. You should see all your files there
3. Your code is now on GitHub! 🎉

## Important Notes

- **Never commit `.env.local`** - It contains your Supabase keys and should stay local
- The `.gitignore` file already excludes `.env*` files
- If you need to update your code later:
  ```bash
  git add .
  git commit -m "Your commit message"
  git push
  ```
