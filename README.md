# Human vs AI Productivity Tracker

A modern web application for tracking and visualizing productivity gains when using AI tools compared to traditional human-only workflows. Built with React, TypeScript, and Vite, this application helps teams quantify the impact of AI integration on their development processes.

![Human vs AI App](https://img.shields.io/badge/React-19.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.2.2-purple)

## 🌟 Features

### 📊 Dashboard
- **Visual Comparison Charts**: Side-by-side comparison of task completion times with and without AI
- **Real-time Metrics**: Live calculation of productivity multipliers (e.g., 3.5x faster with AI)
- **Interactive Widgets**: Hexagonal widgets displaying aggregate statistics
  - "With AI" widget showing total time saved
  - "Without AI" widget showing baseline time
- **Task Management**: Add, edit, and delete tasks with time tracking
- **Data Persistence**: All data stored in browser localStorage
- **Clear All**: Bulk delete functionality with confirmation modal

### 📁 Projects & Tasks
- **Project Organization**: Group related tasks into projects
- **Multi-project Support**: Manage multiple projects simultaneously
- **Task Assignment**: Associate tasks with specific projects
- **Expandable Views**: Collapse/expand project details for better organization
- **CRUD Operations**: Full create, read, update, delete functionality for both projects and tasks
- **Mandatory Task Requirement**: Each project must have at least one task

### 📈 Reports Page
- **Multi-project Visualization**: Productivity charts showing all projects on a single graph
- **Smooth Curve Rendering**: Beautiful Bézier curve interpolation for data points
- **Interactive Data Labels**:
  - Median values always visible with styled background boxes
  - Non-median values appear on hover for cleaner visualization
- **Color-coded Projects**: Each project has a distinct color for easy identification
- **Performance Metrics**:
  - Total tasks across all projects
  - Average productivity gain
  - Per-project breakdown with task counts and average gains
- **Responsive Design**: Charts scale beautifully across all screen sizes

### 🎨 Design Features
- **Modern UI**: Clean, professional interface with glassmorphism effects
- **Dark Mode Ready**: Carefully selected color palette
- **Smooth Animations**: Micro-interactions for enhanced UX
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: ARIA labels and semantic HTML throughout

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.2
- **Routing**: React Router DOM 7.9.6
- **AI Integration**: Google Generative AI SDK 0.24.1
- **Styling**: Vanilla CSS with CSS Modules
- **State Management**: React Context API
- **Data Persistence**: Browser localStorage

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js**: Version 20.x or higher
- **npm**: Version 10.x or higher (comes with Node.js)
- **Git**: For cloning the repository
- **Google Cloud SDK**: (Optional) For deployment to Google Cloud

## 🚀 Local Development

### 1. Clone the Repository

```bash
git clone <repository-url>
cd human-vs-ai-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including React, TypeScript, Vite, and other packages.

### 3. Environment Setup (Optional)

If you plan to use AI features, create a `.env` file in the root directory:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

### 4. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (default Vite port).

### 5. Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot module replacement |
| `npm run build` | Build production-ready bundle to `dist/` directory |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

### 6. Development Workflow

1. Make changes to files in the `src/` directory
2. Vite will automatically reload the browser
3. Check the console for any TypeScript or linting errors
4. Test your changes across different screen sizes

## 🏗️ Project Structure

```
human-vs-ai-app/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable React components
│   │   ├── Chart.tsx           # Dashboard chart component
│   │   ├── Header.tsx          # Dashboard header with widgets
│   │   ├── InputForm.tsx       # Task input form
│   │   ├── Layout.tsx          # App layout with navigation
│   │   ├── ProductivityChart.tsx # Reports page chart
│   │   └── ...
│   ├── context/         # React Context providers
│   │   └── ProjectContext.tsx  # Global state management
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx       # Main dashboard page
│   │   ├── ProjectsPage.tsx    # Projects management page
│   │   └── Reports.tsx         # Analytics and reports page
│   ├── services/        # API and external services
│   ├── types.ts         # TypeScript type definitions
│   ├── App.tsx          # Root component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── Dockerfile           # Docker configuration
├── nginx.conf           # Nginx configuration for production
├── cloudbuild.yaml      # Google Cloud Build configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

## 🐳 Docker Build (Local)

### Build Docker Image

```bash
docker build -t human-vs-ai-app .
```

### Run Docker Container

```bash
docker run -p 8080:8080 human-vs-ai-app
```

Access the application at `http://localhost:8080`

## ☁️ Deploying to Google Cloud

### Prerequisites for Cloud Deployment

1. **Google Cloud Account**: Active GCP account with billing enabled
2. **gcloud CLI**: Installed and authenticated
3. **Project Setup**: GCP project created and selected

### Initial Setup

#### 1. Install Google Cloud SDK

**macOS:**
```bash
brew install google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Windows:**
Download and run the [Google Cloud SDK installer](https://cloud.google.com/sdk/docs/install)

#### 2. Authenticate with Google Cloud

```bash
gcloud auth login
```

#### 3. Set Your Project

```bash
# List available projects
gcloud projects list

# Set your project
gcloud config set project YOUR_PROJECT_ID
```

#### 4. Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Deployment Methods

#### Method 1: Using Cloud Build (Recommended)

This method uses the included `cloudbuild.yaml` configuration for automated builds and deployments.

```bash
# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

**What happens:**
1. Cloud Build creates a Docker container from your code
2. Pushes the container to Google Container Registry (GCR)
3. Deploys the container to Cloud Run
4. Returns a public URL for your application

**Expected output:**
```
Service [human-vs-ai-app] revision [human-vs-ai-app-00001-xxx] has been deployed
Service URL: https://human-vs-ai-app-XXXXXXXXXX.us-central1.run.app
```

#### Method 2: Manual Docker Build and Deploy

```bash
# 1. Build and tag the Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/human-vs-ai-app .

# 2. Configure Docker to use gcloud credentials
gcloud auth configure-docker

# 3. Push image to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/human-vs-ai-app

# 4. Deploy to Cloud Run
gcloud run deploy human-vs-ai-app \
  --image gcr.io/YOUR_PROJECT_ID/human-vs-ai-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Cloud Build Configuration

The `cloudbuild.yaml` file defines the deployment pipeline:

```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/human-vs-ai-app', '.']

  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/human-vs-ai-app']

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'human-vs-ai-app'
      - '--image'
      - 'gcr.io/$PROJECT_ID/human-vs-ai-app'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

### Deployment Configuration Options

#### Change Region

Edit `cloudbuild.yaml` and modify the `--region` parameter:

```yaml
- '--region'
- 'europe-west1'  # or any other region
```

Available regions: `us-central1`, `us-east1`, `europe-west1`, `asia-east1`, etc.

#### Require Authentication

To restrict access to authenticated users only:

```yaml
# Remove this line from cloudbuild.yaml:
- '--allow-unauthenticated'
```

#### Set Memory and CPU Limits

```bash
gcloud run deploy human-vs-ai-app \
  --image gcr.io/YOUR_PROJECT_ID/human-vs-ai-app \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --allow-unauthenticated
```

### Continuous Deployment

#### Set up Cloud Build Triggers

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Click "Create Trigger"
3. Connect your repository (GitHub, Bitbucket, etc.)
4. Configure trigger settings:
   - **Name**: `deploy-human-vs-ai-app`
   - **Event**: Push to branch
   - **Branch**: `^main$`
   - **Configuration**: Cloud Build configuration file
   - **Location**: `cloudbuild.yaml`
5. Click "Create"

Now, every push to the `main` branch will automatically deploy to Cloud Run!

### Monitoring and Logs

#### View Deployment Logs

```bash
gcloud builds list
gcloud builds log BUILD_ID
```

#### View Application Logs

```bash
gcloud run services logs read human-vs-ai-app --region us-central1
```

#### Monitor in Console

Visit the [Cloud Run Console](https://console.cloud.google.com/run) to:
- View service metrics
- Monitor request counts
- Check error rates
- View container logs
- Manage revisions

### Cost Optimization

Cloud Run pricing is based on:
- **Requests**: Number of requests served
- **Compute time**: CPU and memory usage during request processing
- **Networking**: Outbound data transfer

**Free tier includes:**
- 2 million requests per month
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds of compute time

For this application, you'll likely stay within the free tier for development and small-scale usage.

### Updating the Deployment

To deploy a new version:

```bash
# Make your code changes, then:
gcloud builds submit --config cloudbuild.yaml
```

Cloud Run will:
1. Create a new revision
2. Gradually shift traffic to the new revision
3. Keep the old revision available for rollback

### Rollback to Previous Version

```bash
# List revisions
gcloud run revisions list --service human-vs-ai-app --region us-central1

# Route traffic to a specific revision
gcloud run services update-traffic human-vs-ai-app \
  --to-revisions REVISION_NAME=100 \
  --region us-central1
```

## 🔧 Configuration

### TypeScript Configuration

The project uses strict TypeScript settings for type safety. See `tsconfig.json` for details.

### Vite Configuration

Custom Vite configuration in `vite.config.ts` includes:
- React plugin for Fast Refresh
- Build optimizations
- Path aliases (if configured)

### Nginx Configuration

For production deployments, the app uses Nginx as a reverse proxy. The `nginx.conf` file:
- Serves static files from `/usr/share/nginx/html`
- Handles SPA routing (redirects all routes to `index.html`)
- Listens on port 8080
- Includes gzip compression

## 📊 Data Model

### TaskData Type

```typescript
interface TaskData {
  task: string;           // Task name
  humanTime: number;      // Time in minutes without AI
  aiTime: number;         // Time in minutes with AI
  projectName: string;    // Associated project name
}
```

### Project Type

```typescript
interface Project {
  id: string;            // Unique identifier
  name: string;          // Project name
  tasks: string[];       // Array of task names
}
```

## 🎯 Usage Guide

### Adding a Task

1. Navigate to the Dashboard
2. Enter task details:
   - **Task Name**: Description of the task
   - **Human + AI Time**: Time taken with AI assistance (in minutes)
   - **Human Only Time**: Time taken without AI (in minutes)
   - **Project**: Select or create a project
3. Click "Add Task"

### Managing Projects

1. Navigate to "Projects & Tasks" from the sidebar
2. Click "Create New Project"
3. Enter project name and initial task
4. Click "Save Project"
5. Expand projects to add more tasks or delete existing ones

### Viewing Reports

1. Navigate to "Reports" from the sidebar
2. View the productivity chart showing all projects
3. Hover over data points to see exact productivity gains
4. Review aggregate statistics below the chart

## 🐛 Troubleshooting

### Development Issues

**Port already in use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

### Deployment Issues

**Cloud Build fails:**
- Check that all required APIs are enabled
- Verify your `cloudbuild.yaml` syntax
- Check Cloud Build logs: `gcloud builds log BUILD_ID`

**Cloud Run deployment fails:**
- Ensure the Docker image builds locally first
- Check that the container exposes port 8080
- Verify Nginx configuration

**Application not loading:**
- Check Cloud Run logs: `gcloud run services logs read human-vs-ai-app`
- Verify the service URL is correct
- Check browser console for errors

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Vite](https://vite.dev/)
- Deployed on [Google Cloud Run](https://cloud.google.com/run)
- Icons from [Lucide](https://lucide.dev/)

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Live Demo**: [https://human-vs-ai-app-274526825726.us-central1.run.app](https://human-vs-ai-app-274526825726.us-central1.run.app)

Built with ❤️ using React and TypeScript
