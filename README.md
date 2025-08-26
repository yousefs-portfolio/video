# Video Learning Platform

A modern, comprehensive video-based educational platform built with React, TypeScript, and Vite. This platform provides an immersive learning experience with advanced video playback features, gamification elements, and social learning capabilities.

## Features

### 🎥 Advanced Video Player
- Chapter-based navigation with preview thumbnails
- Synchronized transcript display
- Multi-language captions and subtitles
- Interactive hotspots and in-video quizzes
- Adaptive bitrate streaming
- Playback speed controls with memory
- Keyboard shortcuts (J, K, L navigation)

### 🎮 Gamification System
- Achievement badges with rarity tiers
- XP and leveling system
- Learning streaks with visual indicators
- Progress tracking with circular visualizations
- Leaderboards and competitions
- Milestone celebrations

### 🤖 Smart Learning Features
- Personalized learning paths
- Natural language course discovery
- Adaptive difficulty adjustment
- Spaced repetition for knowledge retention
- Performance analytics and insights

### 👥 Social Learning
- Study groups and communities
- Live learning sessions
- Peer review system
- Collaborative note-taking
- Discussion forums

### 📱 Responsive Design
- Mobile-first approach
- Offline capability
- Cross-platform synchronization
- Accessibility features (WCAG compliant)
- Dark mode support

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **UI Libraries**: Material UI + TailwindCSS
- **Animations**: Framer Motion + Lottie
- **Video**: Video.js
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yousefs-portfolio/video.git
cd video
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── common/        # Shared components
│   ├── gamification/  # Gamification features
│   └── layout/        # Layout components
├── pages/            # Page components
├── store/            # Redux store and slices
├── styles/           # Theme and styling
├── types/            # TypeScript definitions
└── utils/            # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository.