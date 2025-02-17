# LockedIn - Daily Goal Tracker

A productivity-focused web application for managing daily goals and tracking progress, built with modern web technologies.

## Features

- 🎯 **Goal Management**
  - Create/edit/delete daily goals
  - Track completion status
  - Daily progress reset at midnight
- 🔄 **Smart Sync**
  - Local storage for instant access
  - Automatic Supabase sync at 12:00 WAT
  - Offline-first approach
- 📊 **Progress Tracking**
  - Visual completion indicators
  - Daily achievement tracking
  - Historical goal tracking
- 🔒 **Secure & Reliable**
  - JWT-based authentication
  - Secure Supabase backend
  - Data validation with Zod
- 🎨 **Modern UI**
  - Clean, minimalist interface
  - Responsive design
  - Instant inline editing
  - Keyboard-friendly controls

## Tech Stack

**Frontend**

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI Components

**Backend**

- Supabase (PostgreSQL)
- Next.js API Routes

**Utilities**

- Zod (Validation)
- React Hook Form
- UUID (Unique IDs)
- Date-fns (Date handling)

## Installation

1. **Clone repository**

   ```bash
   git clone https://github.com/freedompraise/lockedin.git
   cd lockedin
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Environment Setup**
   Create `.env` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Configuration

1. **Supabase Setup**

   - Create new project at [supabase.com](https://supabase.com)
   - Create `goals` table:
     ```sql
     CREATE TABLE goals (
       id UUID PRIMARY KEY,
       goal TEXT NOT NULL,
       isCompleted BOOLEAN DEFAULT false,
       lastCompletedDate TEXT,
       user_id UUID REFERENCES auth.users(id)
     );
     ```

2. **Authentication**
   - Enable Email/Password auth in Supabase
   - Configure redirect URLs in Supabase Dashboard

## Running the Application

**Development Mode**

```bash
yarn run dev
```

**Production Build**

```bash
yarn run build
yarn start
```

## Usage

1. **Authentication**

   - Sign up with email/password
   - Verify email address (if required)

2. **Managing Goals**

   - Add new goals using input field
   - Click goals to edit text
   - Check circle to mark complete
   - Click remove (🗑️) to delete

3. **Automatic Sync**
   - Data saves locally immediately
   - Automatically syncs to Supabase daily at 12:00 WAT
   - Manual sync coming soon!

## Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes
4. Push to branch
5. Open Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Created with ❤️ by [Praise Freedom Dike]

[Report Issue](https://github.com/freedompraise/lockedin/issues)

```

```
