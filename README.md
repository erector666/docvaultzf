# AppVault - AI-Powered Document Management Platform

AppVault is an intelligent document management web application that provides AI-powered document processing, classification, and organization capabilities.

## Features

- **AI-Powered Processing**: Automatic document classification, language detection, and content extraction
- **Intelligent Organization**: Smart categorization and tagging without manual intervention
- **Advanced Search**: Content-based search with AI-enhanced results
- **Multi-language Support**: Support for English, Macedonian, and French
- **Real-time Processing**: Live document analysis with progress tracking
- **Mobile-First Design**: Responsive interface optimized for all devices
- **Theme System**: Light and dark theme support with system detection
- **Authentication**: Secure user authentication with Firebase Auth

## Tech Stack

### Frontend
- **React 18.2.0** with TypeScript
- **React Router v7.8.2** for routing
- **TanStack Query 3.39.3** for state management
- **Tailwind CSS 3.2.4** for styling
- **Framer Motion 9.0.1** for animations
- **Lucide React** for icons

### Backend
- **Firebase Authentication** for user management
- **Firebase Firestore** for database
- **Firebase Storage** for file storage
- **Firebase Functions** for serverless functions

### AI/ML Services
- **Tesseract.js 5.0.4** for OCR
- **Hugging Face API** for language detection and classification
- **DeepSeek API** for enhanced processing

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase project setup
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd appvault
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

Edit `.env` with your Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── layout/         # Layout components
│   ├── auth/           # Authentication components
│   ├── documents/      # Document-related components
│   └── dashboard/      # Dashboard components
├── pages/              # Page components
├── services/           # API and business logic
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── constants/          # Application constants
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID |
| `REACT_APP_DEEPSEEK_API_KEY` | DeepSeek API key for enhanced processing |
| `REACT_APP_HUGGINGFACE_API_KEY` | Hugging Face API key |

## Features Overview

### Authentication
- User registration and login
- Password reset functionality
- Protected routes
- User profile management

### Document Management
- Drag-and-drop file upload
- Support for multiple file formats (PDF, DOCX, images, TXT)
- Real-time upload progress tracking
- Batch upload capabilities

### AI Processing
- Automatic text extraction using OCR
- Language detection with confidence scoring
- Document classification into categories
- Entity extraction and content summarization

### User Interface
- Responsive design for all devices
- Light and dark theme support
- Multi-language support (EN, MK, FR)
- Modern, accessible UI components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.