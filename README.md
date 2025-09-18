This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# 🚀 Git & GitHub Cheat Sheet for Beginners

This guide helps you save, backup, and restore your code using Git and GitHub.  
Never lose your work again! 💪

---

## 🌱 1. INITIALIZE GIT REPOSITORY

```bash
# Initialize a new Git repository in current folder
# Creates hidden .git folder to track all changes
git init

 ## 2. CHECK STATUS & HISTORY

# Show current status: branch, changed files, staged files
# Always run this first to understand your current state
git status

# Show commit history in compact format
# Each line = one saved version (commit)
git log --oneline

# Show ALL files currently tracked by Git
git ls-files

# Show remote repositories (like GitHub) connected to this project
git remote -v

# Stage ALL changed files for next commit
# "." means "everything in current directory and subdirectories"
git add .

# Stage specific file only (safer for big projects)
git add src/components/Navbar.jsx

# Save staged changes as a new version (commit)
# Always write clear, descriptive messages
git commit -m "feat: add animated navbar component"

# Save with multi-line message (press Enter, then Ctrl+D to finish)
git commit


# Connect local repo to GitHub repo (do this once)
# Replace URL with your actual GitHub repo URL
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename current branch to 'main' (standard name)
git branch -M main

# Push local commits to GitHub for the first time
# "-u" sets upstream so future pushes are easier
git push -u origin main

# Push subsequent changes (after first time)
git push


# Connect local repo to GitHub repo (do this once)
# Replace URL with your actual GitHub repo URL
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename current branch to 'main' (standard name)
git branch -M main

# Push local commits to GitHub for the first time
# "-u" sets upstream so future pushes are easier
git push -u origin main

# Push subsequent changes (after first time)
git push 

# Create and switch to new branch (for new features/fixes)
# Work here without breaking your main code
git checkout -b feature/redesign-login-page

# List all branches (current branch marked with *)
git branch

# Switch back to main branch
git checkout main

# Merge feature branch into main (after testing)
git merge feature/redesign-login-page

# Delete feature branch (after merging)
git branch -d feature/redesign-login-page

# Push branch to GitHub (so others can see it)
git push origin feature/redesign-login-page


# TEMPORARILY view old version (safe, no data loss)
# Replace COMMIT_HASH with actual hash from git log
git checkout COMMIT_HASH

# Return to latest version after checking old one
git checkout main

# PERMANENTLY delete commits after specific version
# ⚠️ WARNING: This erases history — use carefully!
git reset --hard COMMIT_HASH

# Push forced rollback to GitHub (after reset --hard)
# ⚠️ WARNING: Overwrites remote history
git push --force origin main

# SAFELY undo last commit (creates new "undo" commit)
# Best for shared projects — keeps history intact
git revert COMMIT_HASH

# Push revert normally (no --force needed)
git push origin main


# 1. Start day — get latest code from team/GitHub
git checkout main
git pull origin main

# 2. Create new branch for your task
git checkout -b feature/add-footer-animation

# 3. ...work on code, make changes...

# 4. Save your work frequently
git add .
git commit -m "feat: add floating animation to footer"

# 5. Push your branch to GitHub
git push origin feature/add-footer-animation

# 6. Go to GitHub → Create Pull Request → Review → Merge to main

# 7. Next day — cleanup and update
git checkout main
git pull origin main
git branch -d feature/add-footer-animation


# If Git not found in VS Code — reload as Administrator
# Or manually reload PATH in terminal:
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# If you forgot to commit and made changes:
# Stash changes temporarily, then restore later
git stash
git stash pop

# See difference between current files and last commit
git diff

# See difference between two commits
git diff COMMIT_HASH_1 COMMIT_HASH_2



---

## ✅ How to Use This File

1. Copy the entire content above
2. In your project folder, create a new file called `README.md`
3. Paste the content
4. Save it

Now you have a **permanent, searchable reference** for all essential Git commands — with explanations!

---

## 💡 Bonus: Render Beautiful README on GitHub

When you push this to GitHub, it will render beautifully with headings, code blocks, and emojis — making it easy to read and share with teammates.

---

## 🚀 Next Steps

1. Save this `README.md` in your project
2. Run: `git add README.md`
3. Run: `git commit -m "docs: add Git & GitHub cheat sheet"`
4. Run: `git push origin main`

✅ Now your cheat sheet is safely backed up on GitHub too!

---

You’re now equipped with professional-grade version control skills. 🎓  
Reply if you want me to add more sections (like `.gitignore`, merging conflicts, or GitHub Actions)!