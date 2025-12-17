# ⚙️ Configuration Guide

## 📖 Project Overview

**SanctifAi** is an AI-powered Christian media discernment platform that helps believers make informed entertainment choices aligned with biblical values. The application analyzes movies, TV shows, books, games, and mobile apps, providing faith-based insights, discernment scores (0-100), relevant Scripture reflections, and faith-safe alternatives.

---

## 🔑 Environment Variables

SanctifAi uses environment variables for API keys and configuration. Below is a complete reference of all available settings:

| Variable Name | Status | Description | Example/Default |
|---------------|--------|-------------|-----------------|
| `OPENAI_API_KEY` | Optional (Recommended) | OpenAI API key for GPT-4o content analysis | `sk-proj-...` |
| `TMDB_API_KEY` | Optional (Recommended) | The Movie Database API bearer token for media search | `eyJhbGci...` |
| `LYRICS_PROVIDER` | Optional | Lyrics service provider (`none`, `musixmatch`, `manual`) | `none` |
| `LYRICS_API_KEY` | Optional | API key for lyrics provider (if not `none`) | _(empty)_ |
| `LYRICS_CACHE_TTL_DAYS` | Optional | Days to cache lyrics data | `90` |
| `VITE_BASE_URL` | Required | Application base URL for canonical links and social sharing | `http://localhost:5000` |
| `VITE_SCRIPTURE_API_BASE` | Required | Bible API endpoint for Scripture verses | `https://bible.helloao.org` |
| `VITE_SUPABASE_URL` | Required | Supabase project URL for database | _(provided by Bolt)_ |
| `VITE_SUPABASE_ANON_KEY` | Required | Supabase anonymous key for client access | _(provided by Bolt)_ |

### 📝 Notes:

- **`OPENAI_API_KEY`**: Without this key, the app will return placeholder discernment analysis. Get your key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **`TMDB_API_KEY`**: Without this key, media search will return empty results. Get your key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- **`VITE_*` variables**: These are exposed to the client-side code. Never put sensitive secrets in VITE_ variables.

---

## 🚀 Setup Instructions

### Step 1: Create Your `.env` File

**In Bolt.new:**
1. Click on the **file explorer** in the left sidebar
2. Right-click on the project root folder
3. Select **"New File"**
4. Name it `.env` (with the dot at the beginning)

**In Replit:**
1. Open the **Secrets** tool in the left sidebar (🔒 icon)
2. Add each environment variable as a separate secret
3. Alternatively, create a `.env` file in the root directory

### Step 2: Add Your Configuration

Copy this template into your `.env` file and replace the placeholder values:

```env
# --- SanctifAi Configuration ---

# AI & Media APIs (Optional but Recommended)
OPENAI_API_KEY=your_openai_api_key_here
TMDB_API_KEY=your_tmdb_bearer_token_here

# Lyrics Settings (Optional)
LYRICS_PROVIDER=none
LYRICS_API_KEY=
LYRICS_CACHE_TTL_DAYS=90

# Client Configuration (Required)
VITE_BASE_URL=http://localhost:5000
VITE_SCRIPTURE_API_BASE=https://bible.helloao.org

# Supabase (Auto-configured in Bolt.new)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Format Guidelines

- **No spaces** around the `=` sign
- **No quotes** around values (unless the value contains spaces)
- **One variable per line**
- Lines starting with `#` are comments

---

## ✅ Configuration Validation

### Quick Config Check

Run this command to verify your configuration:

```bash
npm run check:config
```

### Understanding the Output

**✅ Success (All Keys Present):**
```
[Config] Loaded env: { hasOpenAI: true, hasTMDB: true }
Config check: { hasOpenAI: true, hasTMDB: true }
```

**⚠️ Partial Configuration (Some Keys Missing):**
```
[Config] Loaded env: { hasOpenAI: false, hasTMDB: true }
Config check: { hasOpenAI: false, hasTMDB: true }
```

**❌ No API Keys:**
```
[Config] Loaded env: { hasOpenAI: false, hasTMDB: false }
Config check: { hasOpenAI: false, hasTMDB: false }
```

### 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| `hasOpenAI: false` | Check that `OPENAI_API_KEY` is in your `.env` and starts with `sk-` |
| `hasOpenAI: true` but analysis fails | Verify API key is valid and has credits at [platform.openai.com](https://platform.openai.com) |
| `hasTMDB: false` | Check that `TMDB_API_KEY` is in your `.env` (it's a JWT token, very long) |
| `hasTMDB: true` but search fails | Verify bearer token is valid at [themoviedb.org](https://www.themoviedb.org) |
| Config not loading | Ensure `.env` file is in the **project root** (same level as `package.json`) |
| Changes not applying | Restart the dev server: Stop (`Ctrl+C`) and run `npm run dev` again |

---

## 🌐 Platform-Specific Notes

### Bolt.new 🔷

**Advantages:**
- ✅ Supabase database automatically configured
- ✅ Environment variables persist in `.env` file
- ✅ Auto-reload on file changes
- ✅ Built-in dev server management

**Setup Notes:**
- Supabase `VITE_*` variables are pre-configured by Bolt
- `.env` file is gitignored by default for security
- Hot module replacement (HMR) applies changes instantly

### Replit 🟢

**Advantages:**
- ✅ Secrets tool provides secure storage
- ✅ Environment variables automatically injected
- ✅ Built-in PostgreSQL database (Neon)
- ✅ Always-on deployment option

**Setup Notes:**
- Use the **Secrets** tool (🔒) for sensitive keys
- Variables added via Secrets are available as `process.env.*`
- Can use both Secrets tool AND `.env` file (Secrets take precedence)
- Database connection string auto-configured as `DATABASE_URL`

**Key Differences:**

| Feature | Bolt.new | Replit |
|---------|----------|--------|
| **Database** | Supabase | Neon PostgreSQL |
| **Secrets Management** | `.env` file | Secrets tool or `.env` |
| **Hot Reload** | ✅ Yes | ✅ Yes |
| **Auto HTTPS** | ✅ Yes | ✅ Yes |
| **Deployment** | Manual | One-click |

---

## 🎯 Quick Start Checklist

- [ ] Create `.env` file in project root
- [ ] Add `OPENAI_API_KEY` (get from [OpenAI](https://platform.openai.com/api-keys))
- [ ] Add `TMDB_API_KEY` (get from [TMDB](https://www.themoviedb.org/settings/api))
- [ ] Run `npm run check:config` to validate
- [ ] Run `npm run dev` to start the server
- [ ] Test the app at `http://localhost:5000`

---

## 📚 Additional Resources

- **OpenAI API Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **TMDB API Docs**: [developers.themoviedb.org](https://developers.themoviedb.org/3)
- **Project README**: [README.md](./README.md)
- **Make.com Integration**: [MAKE_INTEGRATION.md](./MAKE_INTEGRATION.md)

---

**Built with faith to help believers navigate media with biblical wisdom** 🙏
