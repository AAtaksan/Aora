Aora: AI Art Community App
Aora is a mobile-first platform for sharing AI-generated visual content and the prompts that created them. This community-driven space allows users to discover, share, and learn from each other's AI art creations.
About Aora
Aora is designed to be the leading mobile platform for AI art enthusiasts, focusing on:

Sharing AI-generated images and videos along with their prompts
Building a community of AI art creators
Enabling discovery of effective prompting techniques
Fostering creativity and collaboration

Getting Started with Development
Prerequisites

Node.js (LTS version recommended)
npm or Yarn
Expo CLI
Appwrite Instance (self-hosted or cloud)
iOS Simulator or Android Emulator (optional)
Expo Go app on your physical device (for testing)

Installation

Clone the repository:
bashgit clone [https://github.com/yourusername/aora-app.git](https://github.com/AAtaksan/Aora.git)
cd aora-app

Install dependencies:
bashnpm install
# or
yarn install

Set up environment variables:
bashcp .env.example .env
Edit the .env file with your Appwrite configuration values:
APPWRITE_ENDPOINT=https://your-appwrite-instance.com/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_DATABASE_ID=your-database-id
APPWRITE_STORAGE_ID=your-storage-id
APPWRITE_COLLECTION_USERS=your-users-collection-id
APPWRITE_COLLECTION_POSTS=your-posts-collection-id


Appwrite Setup

Create an Appwrite project in your Appwrite console
Set up the following services:

Authentication (enable Email/Password, and optionally social providers)
Database (create collections for users, posts, comments, etc.)
Storage (for storing images and videos)
Functions (for any backend processing needs)


Set up appropriate security rules and indexes for your collections

Running the App
Start the development server:
bashnpx expo start
# or
yarn expo start
This will start the Metro Bundler and display a QR code.
Running on a physical device:

Install the Expo Go app on your iOS or Android device
Scan the QR code with your camera (iOS) or directly within the Expo Go app (Android)
The app will load on your device

Running on simulators/emulators:

Press i in the terminal to open in iOS Simulator
Press a in the terminal to open in Android Emulator

Building for Production
Create a production build:
basheas build:android  # For Android
eas build:ios      # For iOS
