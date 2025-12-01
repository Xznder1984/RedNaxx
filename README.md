# RedNax - Video Sharing Platform

A minimalistic YouTube-like video sharing platform built with Node.js, Express, and vanilla JavaScript.

## Features

- 🔐 User authentication (Sign up / Login)
- 📹 Video upload functionality
- 🎬 Video playback with view counter
- 🎨 Clean, modern UI design
- 📱 Responsive layout

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd REDNAX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - The `.env` file is already created
   - Change the `JWT_SECRET` to a secure random string in production

4. **Run the application**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

1. **Sign up** for a new account or **Login** if you already have one
2. Click the **Upload** button to upload a video
3. Fill in the title and description
4. Select your video file
5. Click **Upload** and wait for the upload to complete
6. Your video will appear on the homepage
7. Click on any video to watch it

## Project Structure

```
REDNAX/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── uploads/          # Video files (not tracked in git)
├── .env             # Environment variables
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Deployment to Vercel

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add `JWT_SECRET` with a secure random string

**Note:** For production deployment, you should use a database (like MongoDB or PostgreSQL) instead of in-memory storage, and cloud storage (like AWS S3 or Cloudflare R2) for video files.

## Technologies Used

- **Backend:** Node.js, Express
- **Authentication:** JWT, bcryptjs
- **File Upload:** Multer
- **Frontend:** HTML, CSS, JavaScript
- **Styling:** Custom CSS with CSS Variables

## Important Notes

- This version uses in-memory storage for users and videos (data will be lost on server restart)
- Videos are stored locally in the `uploads/` folder
- For production, implement a proper database and cloud storage solution
- The upload size limit is set to 100MB

## License

MIT
"# RedNaxx" 
