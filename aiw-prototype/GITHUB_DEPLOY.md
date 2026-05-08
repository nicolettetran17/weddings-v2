# Deploy to GitHub + Pages

The **git repo** for this prototype lives **outside OneDrive** (so large analytics files in the Cursor folder never get committed):

```
~/aiw-wedding-prototype/
```

Open **`~/aiw-wedding-prototype/README.md`** for full instructions.

**TL;DR**

1. Add GitHub CLI to your PATH (installed to `~/bin/gh`):

   ```bash
   echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
   ```

2. Push:

   ```bash
   cd ~/aiw-wedding-prototype
   gh auth login
   gh repo create aiw-wedding-prototype --public --source=. --remote=origin --push
   ```

3. On GitHub: **Settings → Pages → Source → GitHub Actions** (the workflow is already in the repo).

The OneDrive copies (`Cursor/rcd-design-system/`, `Cursor/aiw-prototype/`) are your working copies — edit there, then sync into the git repo before committing:

```bash
SRC="/Users/Nicolette_Tran/Library/CloudStorage/OneDrive-McKinsey&Company/Documents/Cursor"
rsync -av --delete "$SRC/rcd-design-system/" ~/aiw-wedding-prototype/rcd-design-system/
rsync -av --delete "$SRC/aiw-prototype/"       ~/aiw-wedding-prototype/aiw-prototype/
```

Or open **`~/aiw-wedding-prototype/`** directly in Cursor and work there (simplest for git).
