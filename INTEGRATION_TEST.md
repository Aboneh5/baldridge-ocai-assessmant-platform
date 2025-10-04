# 🧪 Integration Test Guide

## 🎯 **Test the Unified Assessment Hub**

Follow these steps to verify that both OCAI and Baldrige assessments are properly integrated.

## ✅ **Prerequisites**

Ensure both systems are running:
- **OCAI Hub**: http://localhost:3010
- **Baldrige App**: http://localhost:3000
- **Baldrige Backend**: http://localhost:5000

## 🧪 **Test Scenarios**

### **Test 1: Main Hub Landing Page**
1. **Visit**: http://localhost:3010
2. **Expected**: Beautiful landing page with two assessment cards
3. **Verify**: 
   - OCAI card is blue and functional
   - Baldrige card is green and functional
   - Both buttons are clickable

### **Test 2: OCAI Assessment Flow**
1. **Click**: "Start OCAI Assessment" button
2. **Expected**: Redirects to OCAI authentication page
3. **Sign in** with demo credentials:
   - Email: `admin@acme.com`
   - Password: `admin123`
4. **Verify**: Access to OCAI dashboard and features
5. **Check**: Navigation bar shows "Switch to Baldrige" button

### **Test 3: Baldrige Assessment Flow**
1. **Click**: "Start Baldrige Assessment" button
2. **Expected**: Redirects to Baldrige entry page (http://localhost:3000/assessment/entry)
3. **Verify**: Baldrige assessment interface loads
4. **Check**: Navigation bar shows "Switch to OCAI" button

### **Test 4: Cross-System Navigation**
1. **From OCAI Hub**: Click "Switch to Baldrige"
2. **Expected**: Opens Baldrige app in new tab
3. **From Baldrige App**: Click "Switch to OCAI"
4. **Expected**: Opens OCAI authentication in new tab

### **Test 5: Back to Hub Navigation**
1. **From any system**: Click "Back to Assessment Hub"
2. **Expected**: Returns to main landing page
3. **Verify**: Can choose different assessment

## 🔍 **Troubleshooting Tests**

### **If OCAI Button Doesn't Work**
- Check: Is OCAI Hub running on port 3010?
- Solution: Restart OCAI Hub with `npm run dev`

### **If Baldrige Button Shows "Site Can't Be Reached"**
- Check: Is Baldrige frontend running on port 3000?
- Solution: Start Baldrige frontend service

### **If Baldrige Loads but Has API Errors**
- Check: Is Baldrige backend running on port 5000?
- Solution: Start Baldrige backend service

## 📊 **Expected Results**

### **Successful Integration Shows**:
- ✅ Main hub loads with both assessment options
- ✅ OCAI assessment works completely
- ✅ Baldrige assessment loads and functions
- ✅ Navigation between systems works
- ✅ Both systems maintain independence

### **Error Indicators**:
- ❌ "Site can't be reached" errors
- ❌ Broken navigation links
- ❌ Missing assessment cards
- ❌ API connection failures

## 🚀 **Quick Verification Commands**

```bash
# Check if services are running
netstat -an | findstr :3000  # Baldrige frontend
netstat -an | findstr :3010  # OCAI Hub
netstat -an | findstr :5000  # Baldrige backend

# Start services if needed
# OCAI Hub:
cd "ocai-hub" && npm run dev

# Baldrige Backend:
cd "Tenadam Assessment App\tenadam-assessment-app\backend" && npm run dev

# Baldrige Frontend:
cd "Tenadam Assessment App\tenadam-assessment-app\frontend" && npm run dev
```

## 🎯 **Success Criteria**

The integration is successful when:
1. **Main hub** displays both assessment options
2. **OCAI assessment** works end-to-end
3. **Baldrige assessment** loads and functions
4. **Cross-system navigation** works seamlessly
5. **No broken links** or error messages

---

**🎉 If all tests pass, your unified Assessment Hub is fully integrated and ready for use!**
