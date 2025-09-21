# 🚀 Supabase Setup Instructions - Step by Step

## Error: "Failed to fetch" during authentication

This happens because the app needs your **Project URL** and **anon/public key** from Supabase.

---

## 📋 **EXACT Steps to Get Credentials:**

### Step 1: Go to Supabase Dashboard
```
https://supabase.com/dashboard
```
- Sign in with your account

### Step 2: Select Your Project
- Click on your project name (you should have one since you have the access token)

### Step 3: Go to Settings → API
- In the left sidebar, click **"Settings"**
- Then click **"API"** (it's usually the second option)

### Step 4: Copy the Required Values
Look for these **two specific fields**:

**🔗 Project URL:**
- It looks like: `https://abcdefghijklmnop.supabase.co`
- **Copy the entire URL**

**🔑 Anon/Public Key:**
- It starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- This is a long JWT token
- **Copy the entire key**

---

## 📝 **Update Your .env.local File**

Open `pdf-toolkit/.env.local` and replace:

```env
# Replace these lines:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# With your actual values:
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔄 **Restart the Server**

```bash
cd pdf-toolkit
npm run dev
```

---

## ❓ **What You Should See in Supabase Dashboard:**

The API settings page should show something like:

```
Project API keys
─────────────────
Project URL: https://abcdefghijklmnop.supabase.co

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [long token]

service_role secret
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [different token]
```

**Use the "anon public" key, NOT the "service_role secret" key!**

---

## 🎯 **Quick Test:**

After updating `.env.local`, try signing up again. If it still doesn't work, double-check:

1. ✅ URL starts with `https://` and ends with `.supabase.co`
2. ✅ Anon key starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
3. ✅ No extra spaces or characters
4. ✅ Server restarted

---

## 📞 **Need Help?**

If you're still confused, you can:
1. Take a screenshot of your Supabase API settings page
2. Or I can help you create a new Supabase project from scratch

**The PDF tools are working perfectly - we just need these 2 credentials to enable authentication!**

---

## 🚨 **"Email not confirmed" Error Fix:**

If you get "Email not confirmed" error when signing in:

### **Option 1: Disable Email Confirmation (Recommended for Development)**

1. **Go to Supabase Dashboard** → **Authentication** → **Settings**
2. **Scroll down to "Email Auth" section**
3. **Uncheck "Enable email confirmations"**
4. **Click "Save"**

### **Option 2: Confirm Email Manually**

If you can't disable email confirmation:
1. Check your email inbox (including spam/junk)
2. Look for email from Supabase with subject like "Confirm your email"
3. Click the confirmation link
4. Then try signing in again

### **Option 3: Use Existing Account**

If you already have a confirmed account, just sign in with those credentials instead of creating a new account.

---

## ✅ **Success Indicators:**

Once everything is set up correctly, you should see:
- ✅ Sign up works without errors
- ✅ Sign in works immediately
- ✅ No "Email not confirmed" errors
- ✅ Redirect to tools page after login
- ✅ User info shows in header
- ✅ Dark mode toggle works
- ✅ All PDF tools are accessible
