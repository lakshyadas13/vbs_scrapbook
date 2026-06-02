# Doodly Scrapbook Setup Guide

This guide describes how to configure the backend database, set up local credentials, install dependencies, and run the scrapbook web application.

---

## 📂 Project Organization

The repository has been restructured into two main directories:
```
├── backend/
│   └── schema.sql       # Database schema, triggers, and Row Level Security (RLS)
├── frontend/
│   ├── src/             # Next.js code, Zustand stores, layout styles, and assets
│   ├── public/          # Static icons, image assets
│   ├── package.json     # Package dependencies and scripts
│   └── ...
├── setup.md             # This setup guide
└── README.md            # Project repository readme
```

---

## 🛠️ Step 1: Backend Database Setup (Supabase)

The scrapbook is powered by a multi-tenant relational schema on Supabase, secured with Row Level Security (RLS) policies.

1. **Create a Supabase Project:**
   - Go to [Supabase Console](https://supabase.com/) and create a new project.
2. **Execute Database Schema:**
   - Navigate to the **SQL Editor** in your Supabase dashboard.
   - Open and copy the contents of the [schema.sql](file:///Users/lakshyadas/Downloads/College/VB/app/backend/schema.sql) file.
   - Paste it into the SQL Editor and click **Run**.
3. **Configure Real-Time Synchronization:**
   - Database tables are automatically registered to the `supabase_realtime` publication channel by the schema script.
   - Verify this in the Supabase dashboard by navigating to **Database** (under Database Management in the left sidebar) -> **Publications** (*not* Platform -> Replication, which is for read replicas).
   - Confirm that the `supabase_realtime` publication is active and has enabled replication for:
     - `moods`
     - `love_taps`
     - `good_things`
     - `oopsies`
     - `plans`
     - `plans_checklist`

---

## ⚙️ Step 2: Frontend Environment Configuration

To connect your frontend to Supabase, configure your environment keys:

1. **Locate Keys:**
   - Go to your Supabase project settings -> **API**.
   - Copy the **Project URL** and the **anon public key**.
2. **Create Environment File:**
   - Inside the [frontend](file:///Users/lakshyadas/Downloads/College/VB/app/frontend) folder, create a file named `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

> [!NOTE]
> **Mock Fallback Sandbox:** If these environment variables are omitted or missing, the frontend will automatically failover to a localized `localStorage` sandbox mode. This enables you to immediately test the interfaces, add notes, tap hearts, and track achievements without database credentials!

---

## 🚀 Step 3: Run the Web Application

To launch the scrapbook locally:

1. **Install Dependencies:**
   - Open your terminal and navigate to the frontend directory:
     ```bash
     cd frontend
     npm install
     ```
2. **Launch Development Server:**
   - Run the following command:
     ```bash
     npm run dev
     ```
   - Open [http://localhost:3000](http://localhost:3000) to view your Doodly Scrapbook!
3. **Build Verification (Optional):**
   - Confirm compilation build succeeds:
     ```bash
     npm run build
     ```
