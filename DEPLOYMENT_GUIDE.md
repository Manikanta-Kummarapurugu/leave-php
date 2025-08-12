
# Deployment Guide for iPage Hosting

## Steps to Deploy on iPage:

### 1. Build Angular Application (Do this locally or on Replit)
```bash
cd angular-frontend
npm install
npm run build
```

### 2. Upload Files to iPage
Upload the following folders/files to your iPage hosting directory:

**For Angular Frontend:**
- Upload ALL contents of `angular-frontend/dist/` to your domain's public folder (e.g., `public_html/`)
- This includes: index.html, *.js files, *.css files, assets folder, etc.

**For PHP API:**
- Upload the entire `php-api/` folder to your domain directory

### 3. Database Setup
- Import the `leavedb.sql` file to your MySQL database on iPage
- Update database credentials in `php-api/config/database.php`

### 4. Configuration Updates
- Update the API URL in `angular-frontend/src/environments/environment.prod.ts` to match your domain
- Rebuild Angular after updating the environment file

### 5. File Structure on iPage
```
your-domain.com/
├── index.html (Angular app - from dist folder)
├── main.*.js (Angular compiled JS - from dist folder)
├── styles.*.css (Angular compiled CSS - from dist folder)
├── assets/ (Angular assets - from dist folder)
├── favicon.ico (from dist folder)
└── php-api/
    ├── api/
    ├── config/
    └── index.php
```

### 6. Testing
- Visit your domain to access the Angular frontend
- Test API endpoints at `your-domain.com/php-api/api/`

## Important Notes:
- **NO Node.js required on iPage** - only upload the built static files
- Make sure PHP 7.4+ is enabled on your iPage hosting
- Ensure MySQL database is properly configured
- Angular runs as static HTML/JS/CSS files in the browser
- Only the PHP API requires server-side processing

## Build Process:
1. Develop Angular app locally or on Replit
2. Run `npm run build` to compile to static files
3. Upload only the `dist/` folder contents to iPage
4. Upload PHP API separately
