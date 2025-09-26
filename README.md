# DocVault - Document Management System

DocVault is a modern document management web application built with React and Firebase. It provides secure document storage, organization, and retrieval capabilities for personal and professional use.

## Features

- **Document Storage**: Secure file upload and storage with Firebase Storage
- **Document Organization**: Categorize and tag documents for easy management
- **Search Functionality**: Find documents by name, tags, or category
- **User Authentication**: Secure login and registration with Firebase Auth
- **Responsive Design**: Mobile-first interface that works on all devices
- **Theme Support**: Light and dark theme options
- **Multi-language UI**: Support for English, Macedonian, and French interface
- **Document Management**: Upload, view, and delete documents
- **User Profiles**: Manage user settings and preferences

## Tech Stack

### Frontend
- **React 19.1.1** with TypeScript
- **React Router v7.9.2** for routing
- **TanStack Query 5.90.2** for state management
- **Tailwind CSS 3.4.0** for styling
- **Framer Motion 12.23.22** for animations
- **Lucide React** for icons

### Backend
- **Firebase Authentication** for user management
- **Firebase Firestore** for database
- **Firebase Storage** for file storage
- **Firebase Functions** for serverless functions

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase project setup
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone https://github.com/erector666/docvaultzf.git
cd dv3
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
- Document categorization and tagging
- File size validation (50MB limit)
- Document search by name, tags, or category

### User Interface
- Responsive design for all devices
- Light and dark theme support
- Multi-language UI support (EN, MK, FR)
- Modern, accessible UI components
- Dashboard with document statistics
- Analytics page for usage insights

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