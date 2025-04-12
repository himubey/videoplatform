# Video Upload Platform

A Next.js application for uploading and managing videos with role-based access control.

## Deployment to GitHub Pages

1. Create a new repository on GitHub
2. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/classvideo.git
   git push -u origin main
   ```

3. Configure GitHub Pages:
   - Go to your repository settings
   - Navigate to "Pages" under "Code and automation"
   - Select "GitHub Actions" as the source
   - The site will be available at: `https://YOUR_USERNAME.github.io/classvideo`

4. Environment Variables:
   - Create a `.env.local` file with your environment variables
   - For GitHub Pages, you'll need to set up the following secrets in your repository:
     - `NEXTAUTH_URL`: Your GitHub Pages URL
     - `NEXTAUTH_SECRET`: A random string for session encryption
     - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
     - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
     - Other environment variables as needed

## Deployment to Vercel

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one

2. Install Vercel CLI (optional):
   ```bash
   npm install -g vercel
   ```

3. Deploy using Vercel CLI:
   ```bash
   vercel
   ```
   Or deploy directly from GitHub:
   - Push your code to GitHub
   - Import your repository in Vercel
   - Configure environment variables
   - Deploy

4. Environment Variables:
   Add the following environment variables in your Vercel project settings:
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
   GOOGLE_CLOUD_PRIVATE_KEY_ID=your-private-key-id
   GOOGLE_CLOUD_PRIVATE_KEY=your-private-key
   GOOGLE_CLOUD_CLIENT_EMAIL=your-client-email
   GOOGLE_CLOUD_CLIENT_ID=your-client-id
   GOOGLE_CLOUD_CLIENT_CERT_URL=your-cert-url
   ```

5. After deployment:
   - Your site will be available at: `https://your-domain.vercel.app`
   - You can set up a custom domain in the Vercel dashboard
   - Enable automatic deployments from your GitHub repository

## Features

- User authentication (Email and Google)
- Role-based access (Admin and Teacher)
- Video upload with progress tracking
- Hybrid storage (Local + Cloud)
- Admin dashboard for user and video management

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Google Cloud account
- Google OAuth credentials
- Vercel account
- Google Cloud Platform account (for OAuth and storage)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update the following variables:
     - `NEXTAUTH_URL`: Your application URL
     - `NEXTAUTH_SECRET`: Generate a random string
     - `GOOGLE_CLIENT_ID`: From Google Cloud Console
     - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
     - `GOOGLE_CLOUD_PROJECT_ID`: Your Google Cloud project ID
     - `GOOGLE_CLOUD_BUCKET_NAME`: Your Google Cloud Storage bucket name
     - `GOOGLE_CLOUD_CREDENTIALS`: Your Google Cloud service account credentials

4. Create the uploads directory:
```bash
mkdir -p public/uploads
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Storage Configuration

The application uses a hybrid storage approach:
- Local storage for quick access and caching
- Google Cloud Storage for long-term storage

### Local Storage
- Location: `public/uploads/`
- Maximum file size: 1GB
- Supported formats: MP4, MOV, AVI

### Cloud Storage
- Google Cloud Storage bucket
- Automatic file compression
- Public URL generation

## User Roles

1. Admin
   - Full access to all features
   - User management
   - Video management
   - System settings

2. Teacher
   - Upload videos
   - View their own videos
   - Basic user management

## API Endpoints

- `/api/auth/*`: Authentication endpoints
- `/api/upload`: Video upload endpoint
- `/api/users`: User management endpoints
- `/api/videos`: Video management endpoints

## Security

- All routes are protected by authentication
- Role-based access control
- File type validation
- Size limits on uploads
- Secure storage of credentials

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
