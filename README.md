# CodeQuest Frontend

A gamified task management and learning platform for programmers that integrates with GitHub to track coding activities and provide a fun, RPG-like experience for skill development.

## 🚀 Features

- **Gamified Experience**: Level up, gain XP, and track HP as you complete coding tasks
- **GitHub Integration**: Automatic tracking of commits, streaks, and contribution history
- **Task Management**: Create, track, and complete programming tasks
- **Progress Visualization**: GitHub calendar, commit history, and streak tracking
- **User Authentication**: Secure login and registration system
- **Real-time Statistics**: Track your coding progress and achievements

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Zustand** - State management
- **Axios** - HTTP client for API requests
- **React Icons** - Icon library
- **date-fns** - Date utility library

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Yarn** - Package manager

## 📋 Prerequisites

- Node.js 20.19.0 or higher
- Yarn 4.7.0 or higher
- Backend API running on `http://localhost:8080`

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd codequest-frontend
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. **Start the development server**

   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth-callback/     # OAuth callback handling
│   ├── dashboard/         # Main dashboard page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── profile/          # User profile page
│   ├── tasks/            # Task management page
│   └── layout.tsx        # Root layout
├── components/           # Reusable React components
│   ├── AddTaskModal.tsx  # Task creation modal
│   ├── CardSection.tsx   # Dashboard card component
│   ├── GitHubCalendar.tsx # GitHub contribution calendar
│   ├── GitHubCommitHistory.tsx # Commit history display
│   ├── GitHubStreak.tsx  # Streak tracking component
│   ├── Header.tsx        # Navigation header
│   ├── LogoutButton.tsx  # Logout functionality
│   ├── PageLink.tsx      # Navigation link component
│   └── ProtectedRoute.tsx # Route protection wrapper
├── services/             # API service layer
│   └── githubService.ts  # GitHub API integration
└── store/               # State management
    └── userStore.ts     # User state with Zustand
```

## 🔧 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## 🌟 Key Features

### GitHub Integration

- Automatic commit tracking and streak calculation
- GitHub contribution calendar visualization
- Real-time commit history display
- Integration with GitHub API for user data

### Gamification

- Level system with XP tracking
- HP (Health Points) system
- Achievement tracking
- Ranking system

### Task Management

- Create and manage coding tasks
- Task completion tracking
- Experience points for completed tasks

## 🔐 Authentication

The application uses JWT-based authentication with the backend API. Users can:

- Register with email and password
- Login with existing credentials
- OAuth integration with GitHub
- Protected routes for authenticated users only

## 🎨 UI/UX

- Dark theme optimized for developers
- Responsive design for all screen sizes
- Modern, clean interface using Tailwind CSS
- Geist font family for optimal readability

## 📝 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
