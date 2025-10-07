# How to Run Tenadam Assessment System

This system consists of two separate applications that work together:

## 📊 System Architecture

1. **OCAI Hub** (Main Assessment Hub) - Port 3010
   - Landing page with both assessment options
   - OCAI Assessment functionality
   - Admin dashboard
   - Assessment management

2. **Baldrige App** (Tenadam Assessment App) - Port 3000
   - Baldrige Excellence Framework Assessment
   - Organizational Profile
   - 7 Category Assessment (1,000 points total)

## 🚀 Quick Start

### Option 1: Use the Batch File (Windows)
Simply double-click `start-both-apps.bat` in the main folder. This will:
- Start OCAI Hub on port 3010
- Start Baldrige App on port 3000
- Open both in separate terminal windows

### Option 2: Manual Start

#### Start OCAI Hub (Port 3010)
```bash
cd "c:\Users\lenovo\Documents\tenadam assessment\ocai-hub"
npm run dev
```

#### Start Baldrige App (Port 3000)
Open a new terminal and run:
```bash
cd "c:\Users\lenovo\Documents\tenadam assessment\ocai-hub\Tenadam Assessment App\tenadam-assessment-app\frontend"
npm run dev
```

## 🌐 Access URLs

- **Assessment Hub**: http://localhost:3010
- **Baldrige App**: http://localhost:3000

## 📝 How to Use

1. Go to **http://localhost:3010** (Assessment Hub)
2. Choose your assessment:
   - Click **"Start OCAI Assessment"** for culture assessment
   - Click **"Start Baldrige Assessment"** for excellence framework assessment
3. The Baldrige button will redirect you to http://localhost:3000
4. Complete your assessment

## 🔄 Navigation Between Apps

- From Baldrige App → Click "Back to Assessment Hub" in the top navigation
- From OCAI Hub → Click "Start Baldrige Assessment" button

## ⚙️ Backend Setup

Don't forget to also run the backend server:

```bash
cd "c:\Users\lenovo\Documents\tenadam assessment\ocai-hub\Tenadam Assessment App\tenadam-assessment-app\backend"
npm run dev
```

The backend typically runs on port 5001.

## 📦 Installation

If you haven't installed dependencies yet:

### OCAI Hub
```bash
cd "c:\Users\lenovo\Documents\tenadam assessment\ocai-hub"
npm install
```

### Baldrige App
```bash
cd "c:\Users\lenovo\Documents\tenadam assessment\ocai-hub\Tenadam Assessment App\tenadam-assessment-app\frontend"
npm install
```

### Backend
```bash
cd "c:\Users\lenovo\Documents\tenadam assessment\ocai-hub\Tenadam Assessment App\tenadam-assessment-app\backend"
npm install
```

## 🛠️ Troubleshooting

**Port Already in Use**
- Make sure no other apps are running on ports 3000 or 3010
- You can kill the process using the port in Task Manager

**Can't Access Baldrige**
- Make sure the Baldrige App (port 3000) is running
- Check the terminal for any errors
- Ensure all dependencies are installed

**Navigation Not Working**
- Make sure both servers are running simultaneously
- Check that ports match the configuration (3000 and 3010)

## 📋 System Requirements

- Node.js v18 or higher
- npm or yarn
- Windows OS (for .bat file) or any OS for manual start
