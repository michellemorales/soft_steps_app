# Soft Steps App

A mobile iOS application built with React Native (Expo), FastAPI backend, and MongoDB database.

## Tech Stack

### Mobile App

* **React Native** – Lets us build one application that works on both iPhone and Android devices.
* **Expo** – Simplifies React Native development, testing, and deployment.

### Backend Server

* **Python** – Programming language used for backend development.
* **FastAPI** – Handles requests from the mobile app, manages application logic, and communicates with the database.

### Database

* **MongoDB** – Stores user accounts, survey responses, and other application data.

### Programming Languages

* **TypeScript** – Used to build the React Native mobile application.
* **Python** – Used to build the backend API and services.

### Collaboration Tools

* **Git** – Tracks code changes and enables version control.
* **GitHub** – Hosts the codebase and supports team collaboration through pull requests, issues, and code reviews.


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

**For step 2, make sure you select the appropriate operating system** ⬇️

#### 2A. Xcode (Mac only - for iOS development)
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
#### 2B: Android Studio + Android Emulator (Windows Users)

Windows users cannot run the iOS Simulator. Instead, use Android Studio and an Android Emulator.

**Installation:**

1. Download Android Studio using the following link:
   https://developer.android.com/studio

2. Run the installer and accept default settings

3. Open Android Studio

4. Follow these instructions to get the emulator set-up: https://docs.expo.dev/workflow/android-studio-emulator/ (Make sure to choose the appropriate operating system)

6. Once you have finished creating the emulator device, you are ready to move on to the next section. 

**Verify installation:**

Open a Command Prompt and run:

```bash
adb devices
```

You should see the device you created listed. 

#### 2C. Expo Go App (for testing on physical device)

This might be helpful in scenarios where we want to demo the app during conferences / poster presentations. Or if you do not have enough space on your laptop to download Xcode / Android Studio. 

Install the Expo Go app on your iPhone from the App Store:
- Search for "Expo Go" in the App Store
- Install the app
- Set-up a free Expo Go account
- Once you run the front-end command, you'll scan the QR code with your phone
- Your phone should autmomatically laucn the app for you to test

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
│   │   ├── ReflectionSpaceScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   └── SurveyScreen.tsx
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

### Start the Front-end Development Server

```bash
# Clear cache and start Expo
npx expo start --clear

# Or just start normally
npx expo start
```

### Running on iOS Simulator / Android Emulator

#### Running on iOS 
1. Make sure Xcode is installed
2. Make sure Xcode command line tools are installed
3. Once you run the expo command  press `i` in the Expo terminal


#### Running on Android 
1. Make sure Android Studio is installed
2. Make sure a device was created in Android Studio
3. Once you run the expo command  press `a` in the Expo terminal
4. Copy the server link you see in Terminal (exp://192.168.1.152:8081) and paste that into the Expo Go app in the emulator, the app should then load


#### Running on Physical iPhone

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

Set-up the Python virtual environment and install the dependencies one time:

```bash
# Navigate to backend directory
cd soft_steps_backend

# Create virtual environment
python3 -m venv soft_steps
source soft_steps/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

```

To run the back-end, make sure you have the virtual environment activated then:

```bash
cd soft_steps_backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

For the back-end and front-end to properly work make sure you have the correct environment variables:

## Environment Variables

### Back-end

Create a `.env` file in the root directory (`soft_steps_backend`), fyi this file is not tracked in git. This file is specific to your personal set-up and is only stored locally on your laptop. 

If you are testing via the Xcode simulator / Android Studio emulator, your `.env` file should look like this:

```env
MONGODB_URL=mongodb+srv://<db_username>:<db_password>@softstepscluster.clhhqzv.mongodb.net/?appName=SoftStepsCluster
DATABASE_NAME=soft_steps_db
```

For the  `MONGODB_URL` replace:

`<db_username>` with the MongoDB Atlas username provided to you
`<db_password>` with the MongoDB Atlas password provided to you


### Front-end

Create a `.env` file in the root directory (soft_steps_app). This file is also not tracked in Git and should never be committed to the repository.

#### Testing with Xcode Simulator or Android Emulator

If you are running the app in a simulator on the same computer as the backend:

```env
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

#### Testing with Expo Go on a Physical Phone

If you are running the app on your phone using Expo Go, replace 127.0.0.1 with your computer's local IP address:

```env
EXPO_PUBLIC_API_URL=http://[YOUR_IP_ADDRESS]:8000/api
```



## Features

- ✅ User Sign Up with validation
- ✅ Password strength requirements
- ✅ Form validation (email, password, name)
- ✅ Loading states
- ✅ Error handling
- ✅ User Authentication 
- ✅ Navigation 
- ✅ Additional screens (Welcome, Home, Survey, etc.)

## Development

### Current Screens

- **SignUpScreen**: User registration with form validation
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