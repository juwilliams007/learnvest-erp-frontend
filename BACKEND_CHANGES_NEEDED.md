# Backend Changes Needed for Password Change Feature

## Overview
You need to add a new API endpoint to your backend (juwilliams007/learnvest-erp) that allows users to change their password.

---

## Step 1: Find Your User Routes File

Your backend should have a file like:
- `routes/users.js` OR
- `routes/userRoutes.js` OR
- `routes/user.js`

**Open this file.**

---

## Step 2: Add This Code to Your User Routes

Add this new route **BEFORE** the `module.exports = router;` line:

```javascript
// Change password endpoint
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Find user by ID from token (req.user.id comes from auth middleware)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save user with new password
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
```

---

## Step 3: Make Sure You Have These Imports

At the **TOP** of your user routes file, make sure you have:

```javascript
const bcrypt = require('bcryptjs'); // or 'bcrypt'
const User = require('../models/User'); // adjust path if needed
const auth = require('../middleware/auth'); // your auth middleware
```

---

## Step 4: Save, Commit, and Deploy

After adding the code:

1. **Save the file**
2. **Commit to git:**
   ```bash
   git add .
   git commit -m "Add password change endpoint"
   git push origin main
   ```
3. **Wait for Render to deploy** (2-5 minutes)

---

## Testing

After deployment:
1. Login as an employee
2. Scroll down to "Change Password" section
3. Enter:
   - Current password (probably "default123")
   - New password
   - Confirm new password
4. Click "Change Password"
5. Should see success message!

---

## Need Help?

If you don't know where to find these files, please:
1. Open your backend repository: `juwilliams007/learnvest-erp`
2. Share the file structure with me
3. Or copy-paste the content of your user routes file here

---

**Questions? Show me your backend code and I'll tell you exactly where to paste this!**
