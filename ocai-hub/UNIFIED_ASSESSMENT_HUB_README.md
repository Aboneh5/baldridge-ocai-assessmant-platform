# 🎯 Unified Assessment Hub - OCAI & Baldrige Platform

A comprehensive assessment platform that provides both **OCAI (Organizational Culture Assessment)** and **Baldrige Excellence Framework** assessments in one unified interface.

## 🏗️ **System Architecture**

```
Unified Assessment Hub
├── 🏠 Main Landing Page (Port 3010) - Assessment Selection
├── 📊 OCAI Hub (Port 3010) - Culture Assessment System
└── 🏆 Tenadam Assessment App (Port 3000) - Baldrige Excellence Framework
```

## 🚀 **Quick Start Guide**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL (for production)
- SQLite (for development - included)

### **1. Start the Unified Platform**

```bash
# Navigate to the main OCAI Hub directory
cd ocai-hub

# Install dependencies
npm install

# Start the main platform (includes OCAI Hub)
npm run dev
```

The main platform will be available at: **http://localhost:3010**

### **2. Start the Baldrige Assessment App**

```bash
# In a new terminal, navigate to the Tenadam Assessment App
cd "Tenadam Assessment App/tenadam-assessment-app"

# Start the backend (Express.js API)
cd backend
npm install
npm run dev

# In another terminal, start the frontend (Next.js)
cd frontend
npm install
npm run dev
```

The Baldrige Assessment App will be available at: **http://localhost:3000**

## 🎯 **How It Works**

### **1. Assessment Selection**
- Visit **http://localhost:3010** to see the unified landing page
- Choose between **OCAI Assessment** or **Baldrige Assessment**
- Each assessment runs independently but provides seamless navigation

### **2. OCAI Assessment Flow**
- Click "Start OCAI Assessment" → Redirects to OCAI authentication
- Complete culture assessment with 6 dimensions and 4 culture types
- Access dashboard, reports, and analytics within OCAI Hub

### **3. Baldrige Assessment Flow**
- Click "Start Baldrige Assessment" → Redirects to Tenadam Assessment App
- Enter 6-digit access code for authentication
- Complete comprehensive excellence framework assessment
- Access admin dashboard and reports within Baldrige system

## 🔄 **Navigation Between Systems**

### **From OCAI Hub to Baldrige**
- Use the blue navigation bar at the top of OCAI pages
- Click "Switch to Baldrige" button
- Opens Baldrige Assessment App in new tab

### **From Baldrige to OCAI**
- Use the green navigation bar at the top of Baldrige pages  
- Click "Switch to OCAI" button
- Opens OCAI Hub authentication in new tab

### **Back to Assessment Selection**
- Both systems have "Back to Assessment Hub" links
- Returns to the main landing page for assessment selection

## 📊 **Assessment Comparison**

| Feature | OCAI Assessment | Baldrige Assessment |
|---------|----------------|-------------------|
| **Purpose** | Culture Assessment | Excellence Framework |
| **Framework** | Competing Values (6 dimensions) | Baldrige (7 categories, 1000 pts) |
| **Duration** | 15-20 minutes | 45-60 minutes |
| **Authentication** | Email/Google OAuth | 6-digit access codes |
| **Best For** | Culture change, team building | Performance improvement, awards |

## 🛠️ **Development Setup**

### **OCAI Hub Development**
```bash
cd ocai-hub
npm run dev          # Start development server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

### **Baldrige App Development**
```bash
cd "Tenadam Assessment App/tenadam-assessment-app"

# Backend
cd backend
npm run dev          # Start Express.js API
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database

# Frontend  
cd frontend
npm run dev          # Start Next.js frontend
```

## 🌐 **Port Configuration**

| Service | Port | URL |
|---------|------|-----|
| **Main Assessment Hub** | 3010 | http://localhost:3010 |
| **Baldrige Frontend** | 3000 | http://localhost:3000 |
| **Baldrige Backend** | 5000 | http://localhost:5000 |

## 📁 **Project Structure**

```
ocai-hub/
├── 🏠 src/app/page.tsx                    # Main landing page
├── 📊 src/app/auth/                       # OCAI authentication
├── 📈 src/app/dashboard/                  # OCAI dashboard
├── 📋 src/app/surveys/                    # OCAI surveys
├── 📊 src/app/reports/                    # OCAI reports
├── 🔧 src/components/                     # OCAI components
├── 📚 src/lib/                           # OCAI utilities
└── 📁 Tenadam Assessment App/             # Baldrige system
    └── tenadam-assessment-app/
        ├── 🎯 frontend/                   # Baldrige UI
        └── ⚙️ backend/                    # Baldrige API
```

## 🔐 **Authentication Systems**

### **OCAI Hub**
- **NextAuth.js** with email and Google OAuth
- **Role-based access** (OrgAdmin, Facilitator, Employee)
- **Organization-scoped** data access

### **Baldrige Assessment**
- **6-digit access codes** for user authentication
- **User registration** after code validation
- **Session management** with JWT tokens

## 📊 **Data Storage**

### **OCAI Hub**
- **SQLite** (development) / **PostgreSQL** (production)
- **Prisma ORM** with comprehensive schema
- **Multi-tenant** organization structure

### **Baldrige Assessment**
- **PostgreSQL** database
- **Prisma ORM** with advanced features
- **Multi-organization** support

## 🚀 **Deployment**

### **Production Deployment**
1. **OCAI Hub**: Deploy to Vercel with Neon PostgreSQL
2. **Baldrige App**: Deploy backend and frontend separately
3. **Update URLs**: Modify cross-system links for production domains

### **Environment Variables**
- **OCAI Hub**: See `env.example` for required variables
- **Baldrige App**: See `env.production.example` for setup

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Port Conflicts**
   - Ensure ports 3000, 3010, and 5000 are available
   - Check for other running services

2. **Database Issues**
   - Run `npm run db:migrate` for OCAI Hub
   - Run `npm run db:push` for Baldrige App

3. **Cross-System Navigation**
   - Verify both systems are running
   - Check localhost URLs in navigation components

### **Development Tips**
- Use separate terminal windows for each system
- Monitor console logs for debugging
- Use browser dev tools to inspect navigation

## 📞 **Support**

For technical support or questions:
- **OCAI Hub Issues**: Check OCAI Hub documentation
- **Baldrige Issues**: Check Tenadam Assessment App documentation
- **Integration Issues**: Review this unified platform guide

## 🎯 **Next Steps**

1. **Start both systems** using the commands above
2. **Visit http://localhost:3010** to see the unified platform
3. **Test both assessments** to ensure everything works
4. **Customize branding** and content as needed
5. **Deploy to production** when ready

---

**🎉 You now have a unified assessment platform with both OCAI and Baldrige assessments!**
