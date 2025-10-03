# 🏆 Baldrige Assessment App Integration Guide

## 🎯 **Integration Status**

The Baldrige Assessment App has been integrated into the unified Assessment Hub platform. Here's the current status and setup instructions.

## 🏗️ **System Architecture**

```
Unified Assessment Hub
├── 🏠 Main Hub (Port 3010) - Assessment Selection
├── 📊 OCAI Hub (Port 3010) - Culture Assessment  
└── 🏆 Baldrige App (Port 3000) - Excellence Framework
```

## 🚀 **How to Start Both Systems**

### **Method 1: Use the Batch File (Recommended)**
```bash
# Double-click or run:
start-unified-platform.bat
```

### **Method 2: Manual Startup**

#### **Step 1: Start OCAI Hub (Main Platform)**
```bash
cd "C:\Users\lenovo\Documents\tenadam assessment\ocai-hub"
npm run dev
```
**Result**: OCAI Hub runs on http://localhost:3010

#### **Step 2: Start Baldrige Backend**
```bash
cd "C:\Users\lenovo\Documents\tenadam assessment\ocai-hub\Tenadam Assessment App\tenadam-assessment-app\backend"
npm run dev
```
**Result**: Backend API runs on http://localhost:5000

#### **Step 3: Start Baldrige Frontend**
```bash
cd "C:\Users\lenovo\Documents\tenadam assessment\ocai-hub\Tenadam Assessment App\tenadam-assessment-app\frontend"
npm run dev
```
**Result**: Frontend runs on http://localhost:3000

## 🎯 **User Experience Flow**

### **1. Access Main Hub**
- Visit: **http://localhost:3010**
- See unified assessment selection page

### **2. Choose Assessment**
- **OCAI Assessment**: Redirects to OCAI authentication
- **Baldrige Assessment**: Redirects to Baldrige entry page

### **3. Complete Assessment**
- Each system maintains its own functionality
- Cross-system navigation available

## 🔄 **Navigation Features**

### **From OCAI Hub**
- Blue navigation bar at top
- "Back to Assessment Hub" link
- "Switch to Baldrige" button (opens in new tab)

### **From Baldrige App**
- Green navigation bar at top
- "Back to Assessment Hub" link  
- "Switch to OCAI" button (opens in new tab)

## 📍 **Access Points**

| Service | URL | Purpose |
|---------|-----|---------|
| **Main Hub** | http://localhost:3010 | Assessment selection |
| **OCAI Hub** | http://localhost:3010 | Culture assessment |
| **Baldrige App** | http://localhost:3000 | Excellence framework |

## 🔧 **Integration Details**

### **What Was Modified**

#### **Main Landing Page** (`ocai-hub/src/app/page.tsx`)
- ✅ Updated to redirect to correct Baldrige URL
- ✅ Restored full Baldrige card functionality
- ✅ Proper routing to `http://localhost:3000/assessment/entry`

#### **Navigation Component** (`ocai-hub/src/components/navigation/assessment-hub-nav.tsx`)
- ✅ Restored "Switch to Baldrige" functionality
- ✅ Links to Baldrige entry page

#### **Baldrige App Layout** (`Tenadam Assessment App/tenadam-assessment-app/frontend/src/app/layout.tsx`)
- ✅ Added navigation bar for cross-system switching
- ✅ Links back to main assessment hub

### **What Remains Independent**
- ✅ Separate databases and authentication
- ✅ Independent development workflows
- ✅ Separate deployment capabilities

## 🎯 **Testing the Integration**

### **Test Scenario 1: OCAI Assessment**
1. Visit http://localhost:3010
2. Click "Start OCAI Assessment"
3. Sign in with demo credentials
4. Complete assessment
5. Use navigation to switch to Baldrige

### **Test Scenario 2: Baldrige Assessment**
1. Visit http://localhost:3010
2. Click "Start Baldrige Assessment"
3. Should redirect to Baldrige entry page
4. Enter access code and complete assessment
5. Use navigation to switch back to OCAI

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Baldrige App Not Loading**
- **Check**: Is port 3000 running?
- **Solution**: Start Baldrige frontend service
- **Command**: `cd frontend && npm run dev`

#### **Backend API Errors**
- **Check**: Is port 5000 running?
- **Solution**: Start Baldrige backend service
- **Command**: `cd backend && npm run dev`

#### **Navigation Links Not Working**
- **Check**: Both systems must be running
- **Solution**: Ensure all services are started

### **Port Conflicts**
If ports 3000 or 5000 are in use:
- **Find process**: `netstat -ano | findstr :3000`
- **Kill process**: `taskkill /PID <process_id> /F`
- **Restart services**

## 🚀 **Production Deployment**

### **OCAI Hub**
- Deploy to Vercel or similar platform
- Update environment variables
- Configure database (PostgreSQL recommended)

### **Baldrige App**
- Deploy frontend to Vercel/Netlify
- Deploy backend to Railway/Heroku
- Update cross-system URLs for production

### **Update URLs for Production**
```javascript
// Update these URLs in production:
// OCAI Hub: https://your-ocai-domain.com
// Baldrige: https://your-baldrige-domain.com
```

## ✅ **Success Criteria**

The integration is successful when:
- ✅ Main hub loads at http://localhost:3010
- ✅ OCAI assessment works end-to-end
- ✅ Baldrige assessment works end-to-end
- ✅ Cross-system navigation functions
- ✅ Both systems maintain independence

## 🎉 **Integration Complete!**

The unified Assessment Hub now provides:
- **Single entry point** for both assessments
- **Seamless navigation** between systems
- **Professional user experience**
- **Independent system maintenance**

Both OCAI and Baldrige assessments are now fully integrated into a unified platform while maintaining their independence and full functionality.

---

**🎯 Ready to use: Visit http://localhost:3010 to access the unified Assessment Hub!**
