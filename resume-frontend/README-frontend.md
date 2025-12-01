# Resume Frontend — Quick setup

Steps to get the frontend running locally (Windows PowerShell):

1. Open a terminal and change into the frontend folder:

```powershell
cd D:\xampp\htdocs\Project\resume-builder\resume-frontend
```

2. Install dependencies:

```powershell
npm install
```

3. Start the dev server:

```powershell
npm run dev
```

Notes:
- `tailwindcss`, `postcss` and `autoprefixer` are already present in `devDependencies`.
- `src/index.css` contains Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) and is imported from `src/main.jsx`.
- If you update Tailwind config or add new file types, restart the dev server so Vite picks up changes.
