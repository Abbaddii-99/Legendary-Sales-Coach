# Girard's Legacy - replit.md

## Overview

Girard's Legacy is a sales training mobile app that uses AI-powered roleplay coaching to help users practice real sales scenarios. The app features "Joe Girard" (the world's greatest salesman) as an AI coach who simulates customer interactions and provides feedback based on his proven sales philosophy. Users can practice with various customer personas (hesitant buyers, price shoppers, angry customers, etc.), track their progress, and manage client relationships through a built-in CRM.

The app is built as a React Native/Expo application with an Express backend, designed to run on iOS, Android, and web platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 54 (new architecture enabled)
- **Navigation**: React Navigation v7 with native stack and bottom tabs
  - Tab-based navigation with 4 main sections: Arena (Home), Training, CRM, Profile
  - Modal stack for training sessions and summaries
- **State Management**: TanStack React Query for server state, local component state for UI
- **Styling**: StyleSheet-based with a custom theme system supporting light/dark modes
- **Animations**: React Native Reanimated for smooth UI transitions
- **Internationalization**: Custom i18n system with Arabic (RTL) and English support

### Backend Architecture
- **Framework**: Express.js v5 running on Node.js
- **API Pattern**: REST endpoints under `/api/` prefix
- **AI Integration**: OpenAI API via Replit AI Integrations for:
  - Sales roleplay conversations (Joe Girard persona)
  - Customer simulation with various personality types
  - Session evaluation and feedback generation

### Data Storage
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` for shared types, `shared/models/` for additional models
- **Client-Side Storage**: AsyncStorage for:
  - Training session history
  - User preferences and stats
  - Client CRM data
- **Current Implementation**: MemStorage class for development (can be swapped to PostgreSQL)

### Key Design Patterns
- **Monorepo Structure**: 
  - `client/` - React Native app code
  - `server/` - Express backend
  - `shared/` - Common types and schemas
- **Path Aliases**: `@/` maps to `client/`, `@shared/` maps to `shared/`
- **Replit Integrations**: Pre-built utilities in `server/replit_integrations/` and `client/replit_integrations/` for audio, chat, image generation, and batch processing

### Training System Architecture
- Sessions are initiated via `/api/training/start` with scenario and customer type
- Messages exchanged via `/api/training/message` with conversation history
- Sessions ended via `/api/training/end` which returns AI-generated evaluation scores
- Scoring covers: Building Rapport, Trust, Active Listening, Objection Handling, Service Focus

## External Dependencies

### AI Services
- **OpenAI API**: Accessed through Replit AI Integrations
  - Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
  - Used for chat completions with Joe Girard system prompt

### Database
- **PostgreSQL**: Required for production
  - Environment variable: `DATABASE_URL`
  - Schema managed via Drizzle Kit (`npm run db:push`)

### Third-Party Libraries
- **Expo SDK**: Core mobile functionality (splash screen, haptics, fonts, status bar)
- **Google Fonts**: Montserrat font family for typography
- **React Native Keyboard Controller**: Enhanced keyboard handling
- **React Native Gesture Handler**: Touch gesture support

### Build & Development
- **Replit Environment Variables**:
  - `REPLIT_DEV_DOMAIN`: Development domain for API calls
  - `REPLIT_DOMAINS`: Production domains for CORS
  - `EXPO_PUBLIC_DOMAIN`: Client-side API endpoint configuration