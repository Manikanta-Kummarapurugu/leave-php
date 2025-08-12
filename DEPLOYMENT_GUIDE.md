
# Deployment Guide for iPage Hosting

## Steps to Deploy on iPage:

### 1. Build Angular Application
```bash
cd angular-frontend
npm install
npm run build
```

### 2. Upload Files to iPage
Upload the following folders/files to your iPage hosting directory:

**For Angular Frontend:**
- Upload contents of `angular-frontend/dist/` to your domain's public folder (e.g., `public_html/`)

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
├── index.html (Angular app)
├── assets/ (Angular assets)
├── *.js, *.css (Angular build files)
└── php-api/
    ├── api/
    ├── config/
    └── index.php
```

### 6. Testing
- Visit your domain to access the Angular frontend
- Test API endpoints at `your-domain.com/php-api/api/`

## Important Notes:
- Make sure PHP 7.4+ is enabled on your iPage hosting
- Ensure MySQL database is properly configured
- Update CORS settings if needed for your specific domain
