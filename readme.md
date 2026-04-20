# Farmster Git Workflow

Use this workflow every time you work on the project.

## Repo

`https://github.com/aimimisman/farmster.git`

---

## Rules

- Do **not** push directly to `main`
- Each member uses **one branch with their name only**
- Use the **same branch** for all modules
- Every change must go through a **Pull Request**
- Use clear commit messages
- Deploy only from `main`

---

## First Time Setup

Clone the repo:

```bash
git clone https://github.com/aimimisman/farmster.git
cd farmster
```

Make sure `main` is up to date:

```bash
git checkout main
git pull origin main
```

Create your personal branch:

```bash
git checkout -b yourname
```

Example:

```bash
git checkout -b ali
```

Push your branch:

```bash
git push -u origin yourname
```

Example:

```bash
git push -u origin ali
```

---

## Every Time You Start Working

Get the latest code from `main`:

```bash
git checkout main
git pull origin main
```

Switch to your branch:

```bash
git checkout yourname
```

Update your branch:

```bash
git merge main
```

---

## After You Make Changes

Add your changes:

```bash
git add .
```

Commit with a clear message:

```bash
git commit -m "Describe your changes clearly"
```

Examples:

```bash
git commit -m "Add login validation"
git commit -m "Fix dashboard layout"
git commit -m "Update product form"
```

Push your work:

```bash
git push origin yourname
```

---

## Create Pull Request

After pushing:

1. Go to the GitHub repo
2. Click **Compare & pull request**
3. Set:
   - **base** = `main`
   - **compare** = your branch
4. Create the PR

---

## Deployment Flow

Follow this every deployment:

1. Pull latest `main`
2. Switch to your branch
3. Merge `main` into your branch
4. Make changes
5. Commit and push
6. Open PR
7. Merge into `main`
8. Deploy from `main`

---

## Quick Summary

### First time

```bash
git clone https://github.com/aimimisman/farmster.git
cd farmster
git checkout main
git pull origin main
git checkout -b yourname
git push -u origin yourname
```

### Daily use

```bash
git checkout main
git pull origin main
git checkout yourname
git merge main
git add .
git commit -m "Describe your changes clearly"
git push origin yourname
```