# Soft Steps App

A mobile iOS application built with React Native (Expo), FastAPI backend, and MongoDB database.

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Python (FastAPI)
- **Database**: MongoDB
- **Language**: TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

#### 1. Node.js (v16 or higher)
Node.js is a JavaScript runtime that allows you to run JavaScript on your computer.

**Installation:**
- **Mac**: 
  ```bash
  # Using Homebrew (recommended)
  brew install node
  
  # Or download from official website
  # Visit: https://nodejs.org/
  ```
- **Windows**: Download the installer from [nodejs.org](https://nodejs.org/) and run it
- **Verify installation**:
  ```bash
  node --version
  npm --version
  ```

#### 2. Xcode (Mac only - for iOS development)
Xcode is Apple's development environment required for iOS app development.

**Installation:**
1. Open the App Store on your Mac
2. Search for "Xcode"
3. Click "Get" or "Install" (it's free but large, ~12GB+)
4. After installation, open Xcode and agree to the license
5. Install Command Line Tools:
   ```bash
   xcode-select --install
   ```

**Verify installation:**
```bash
xcode-select -p
# Should return: /Applications/Xcode.app/Contents/Developer
```


#### 3. Expo Go App (for testing on physical device)
Install the Expo Go app on your iPhone from the App Store:
- Search for "Expo Go" in the App Store
- Install the app
- You'll use this to scan QR codes and test your app

#### 4. Python 3.8+ (for Backend)
Python is required for the FastAPI backend.

**Installation:**
- **Mac**:
  ```bash
  # Using Homebrew
  brew install python3
  ```
- **Windows**: Download from [python.org](https://www.python.org/downloads/)
- **Verify installation**:
  ```bash
  python3 --version
  # or
  python --version
  ```

#### 5. MongoDB (for Database)
MongoDB is the database system for storing app data.

**Prerequisites for MongoDB:**
First, you need Docker installed:
- **Mac**: Download [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
- **Windows**: Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
- Install and start Docker Desktop

**Installation:**

To install and run MongoDB, run the following commands in your MacOS Terminal or Windows CommandPrompt:

1. Pull the latest MongoDB Docker image:
   ```bash
   docker pull mongo
   ```

2. Start the MongoDB container using the Docker image:
   ```bash
   docker run -d -p 27017-27019:27017-27019 --name mongodb --restart always mongo
   ```

That's it! MongoDB is now running in its own container.

**Interacting with MongoDB:**

You can interact with it using **MongoDB Compass** (GUI - Recommended):
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Install and launch Compass
3. MongoDB has no password, so you can just launch Compass with default settings
4. Connection string: `mongodb://localhost:27017`

**Useful Docker Commands:**
```bash
# Check if MongoDB container is running
docker ps

# Stop MongoDB
docker stop mongodb

# Start MongoDB
docker start mongodb

# Remove MongoDB container (if you need to start fresh)
docker rm -f mongodb
```

### Optional Tools

#### Git (Version Control)
**Installation:**
- **Mac**: 
  ```bash
  brew install git
  ```
- **Windows**: Download from [git-scm.com](https://git-scm.com/)

**Verify:**
```bash
git --version
```

#### VS Code (Recommended Code Editor)
Download from [code.visualstudio.com](https://code.visualstudio.com/)

**Recommended Extensions:**
- React Native Tools
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Python (for backend development)

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd soft_steps_app
```

### 2. Install Dependencies

```bash
# Install npm dependencies
npm install

# Install Expo-specific packages
npx expo install react-native-safe-area-context react-native-screens

# Install navigation and other dependencies
npm install @react-navigation/native @react-navigation/native-stack axios @react-native-async-storage/async-storage
```

### 3. Project Structure

The project follows this structure:

```
soft_steps_app/
├── src/
│   ├── screens/           # App screens
│   │   └── BraveStepScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   └── SignUpScreen.tsx
│   ├── components/        # Reusable components
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── index.ts
│   ├── navigation/        # Navigation setup
│   ├── services/          # API services
│   │   └── api.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   └── validation.ts
│   ├── constants/         # App constants
│   │   ├── colors.ts
│   │   └── theme.ts
│   └── assets/            # Images, fonts, etc.
│       └── logo.png
├── App.tsx
├── package.json
└── README.md
```

## Running the App

### Start the Development Server

```bash
# Clear cache and start Expo
npx expo start --clear

# Or just start normally
npx expo start
```

### Running on iOS Simulator

1. Make sure Xcode is installed
2. Open iOS Simulator manually:
   ```bash
   open -a Simulator
   ```
3. Once the simulator is running, press `i` in the Expo terminal

### Running on Physical iPhone

1. Install Expo Go app from the App Store on your iPhone
2. Scan the QR code shown in the terminal with your iPhone camera
3. The app will open in Expo Go

### Troubleshooting

**Cache Issues:**
```bash
# Clear all caches
npx expo start --clear
rm -rf .expo node_modules/.cache
```

**App Not Updating:**
```bash
# In the Expo terminal, press:
# 'r' - Reload app
# 'c' - Clear cache and reload
```

**Simulator Issues:**
```bash
# Kill and restart simulator
killall Simulator
open -a Simulator
npx expo start
```

**NPM Permission Errors:**
```bash
# Fix npm cache permissions
sudo rm -rf ~/.npm/_cacache
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
```

## Backend Setup (Coming Soon)

### FastAPI Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv soft_steps
source soft_steps/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn pymongo python-jose passlib bcrypt

# Run the server
python -m uvicorn app.main:app --reload
```


## Environment Variables

Create a `.env` file in the root directory (not tracked in git):

```env
API_URL=http://localhost:8000/api
MONGODB_URI=mongodb://localhost:27017/soft_steps_app
```




## Features

- ✅ User Sign Up with validation
- ✅ Password strength requirements
- ✅ Form validation (email, password, name)
- ✅ Loading states
- ✅ Error handling
- 🚧 User Authentication (coming soon)
- 🚧 Navigation (coming soon)
- 🚧 Additional screens (Welcome, Home, Survey, etc.)

## Development

### Current Screens

- **SignUpScreen**: User registration with form validation

### Planned Screens

- SignUpScreen 
- HomeScreen
- SurveyScreen
- ReflectionScreen
- BraveStepScreen

## API Endpoints (Backend)

```
POST /api/auth/signup - Create new user account
POST /api/auth/login - User login
GET /api/user/profile - Get user profile
```
To view the documentation for existing endpoints, you can open up your browser and go to:

```
http://127.0.0.1:8000/docs#/
```
## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Your License Here]

## Contact

[Your Contact Information]

---

**Note**: This app is currently in development. The backend API and additional screens are coming soon.