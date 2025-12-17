# SanctifAi - Christian Media Discernment Platform

AI-powered faith-based media analysis platform helping believers make informed entertainment choices aligned with Christian values.

## Features

- **Media Analysis**: Search movies, TV shows, games, apps, and books for faith-based discernment
- **Discernment Scores**: 0-100 faith alignment ratings with biblical perspective
- **Scripture Reflections**: Relevant NLT Bible verses tied to content themes
- **Faith-Safe Alternatives**: Three recommended alternatives with reasoning
- **TMDB Integration**: Visual poster selection and rich metadata
- **Smart Caching**: PostgreSQL-based caching prevents duplicate API calls
- **User Authentication**: Replit Auth for personalized features
- **Saved Library**: Bookmark and organize your favorite analyses

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Node.js + Express, PostgreSQL (Drizzle ORM)
- **AI**: OpenAI GPT-4o for content analysis
- **APIs**: TMDB for media search and posters
- **Auth**: Replit Auth (OpenID Connect)

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   - `DATABASE_URL` - PostgreSQL connection string
   - `OPENAI_API_KEY` - OpenAI API key
   - `TMDB_API_KEY` - The Movie Database API key
   - `SESSION_SECRET` - Session encryption secret
   - `MAKE_WEBHOOK_URL` (optional) - Make.com webhook for logging

3. **Run Database Migrations**:
   ```bash
   npm run db:push
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Navigate to `http://localhost:5000`

## Canonical URL & Social Sharing

The application uses `VITE_BASE_URL` environment variable for canonical links and social media meta tags.

**Setup**:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. **For production deployment**, update `VITE_BASE_URL` in `.env` to your custom domain:
   ```env
   VITE_BASE_URL=https://yourdomain.com/
   ```

**Note**: This ensures proper SEO canonical URLs and correct social sharing previews (Open Graph, Twitter Cards) when your site is shared on social media.

## Make.com Integration

SanctifAi integrates with [Make.com](https://make.com) for powerful automation workflows. See [MAKE_INTEGRATION.md](./MAKE_INTEGRATION.md) for complete setup instructions.

### Advanced Make.com Scenarios

**Note:** These advanced automations remain inactive until analytics mature. They are documented here for future implementation.

#### 1. Weekly Faith-Safe Email (Gmail)

**Purpose**: Send weekly digest of high-scoring faith-safe content to subscribers

**Make.com Scenario Flow**:
1. **Scheduler** → Runs every Monday at 9 AM
2. **Webhook** → Filter search logs from past week
3. **Filter** → Only include items with `score >= 80` (highly faith-aligned)
4. **Aggregator** → Group by media type (movies, shows, books)
5. **Gmail** → Send formatted email digest

**Filter Configuration**:
- Field: `score` (discernment score)
- Condition: `Greater than or equal to 80`
- Additional filter: `tags` contains "inspirational" OR "biblical" OR "faith-based"

**Email Template**:
```
Subject: This Week's Faith-Safe Entertainment

Hi [Name],

Here are the top-rated faith-aligned media this week:

TV Shows (Score 85+):
- [Title] - Score: [score] - [summary]

Movies (Score 85+):
- [Title] - Score: [score] - [summary]

Books (Score 85+):
- [Title] - Score: [score] - [summary]

Blessings,
SanctifAi Team
```

**Status**: Inactive - Awaiting analytics maturation

---

#### 2. Occult Content Alert (Slack/Discord)

**Purpose**: Instant notifications when concerning spiritual content is detected

**Make.com Scenario Flow**:
1. **Webhook** → Receives search data from SanctifAi
2. **Filter** → Apply occult/spiritual danger criteria
3. **Router** → Split to multiple notification channels
4. **Slack/Discord** → Send formatted alert

**Filter Configuration**:
- **Primary Filter**: `score < 50` (low discernment score)
- **Tag Filters** (any of these triggers alert):
  - `tags` contains "occult"
  - `tags` contains "witchcraft"
  - `tags` contains "divination"
  - `tags` contains "spiritualism"
  - `tags` contains "new age"
  - `tags` contains "dark magic"

**Alert Format (Slack/Discord)**:
```
WARNING: SPIRITUAL CONCERN DETECTED

Title: [title]
Type: [mediaType]
Discernment Score: [score]/100

Concerning Tags: [tags]

Summary: [summary]

Recommended Alternatives:
1. [alternative 1]
2. [alternative 2]
3. [alternative 3]

Pray for discernment before viewing
```

**Additional Routing**:
- If `score < 30`: Send to #critical-alerts channel
- If `score 30-49`: Send to #content-warnings channel
- If tags include "children": Also notify #family-safety channel

**Status**: Inactive - Awaiting analytics maturation

---

#### 3. Content Trend Analysis (Notion Dashboard)

**Purpose**: Track content trends and popular searches over time

**Make.com Scenario Flow**:
1. **Scheduler** → Runs daily at midnight
2. **HTTP Module** → Fetch previous day's search logs
3. **Aggregator** → Calculate statistics
4. **Notion** → Update dashboard database

**Analytics Fields**:
- Total searches by media type
- Average discernment scores
- Most common tags (trending themes)
- Low-score content count (score < 50)
- High-score content count (score >= 80)

**Notion Database Structure**:
- Date (Date field)
- Total Searches (Number)
- Avg Score (Number)
- Movies Searched (Number)
- Shows Searched (Number)
- Books Searched (Number)
- Concerning Content (Number) - score < 50
- Faith-Safe Content (Number) - score >= 80
- Top Tags (Multi-select)

**Status**: Inactive - Awaiting analytics maturation

---

### When to Activate Advanced Scenarios

These automation scenarios should be activated when:

1. ✅ **User Base**: At least 100+ active users
2. ✅ **Search Volume**: Consistent 50+ searches per week
3. ✅ **Data Quality**: AI analysis accuracy validated
4. ✅ **Privacy Compliance**: User consent for automated processing
5. ✅ **Make.com Plan**: Upgraded plan to handle operation volume

**Current Status**: Platform in early adoption phase. Advanced automations documented for future activation.

---

## App Analysis (Android & iOS)

SanctifAi provides comprehensive analysis for mobile applications across both Android and iOS platforms.

### Data Sources

- **Android (Primary)**: [Google Play Scraper](https://www.npmjs.com/package/google-play-scraper) - No API key required
- **iOS (Fallback)**: [Apple iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/) - No API key required
- **Smart Fallback**: Automatically tries Google Play Store first, then iTunes App Store if no results found

### Supported Metadata Fields

When analyzing apps, SanctifAi enriches AI analysis with:

- **title** - Application name
- **description** - Full app description for context
- **developer** - App publisher/developer name
- **genre** - Primary category (e.g., "Social", "Communication", "Entertainment")
- **rating** - Store rating (e.g., 4.5/5)
- **installs** - Download count (Android only, e.g., "100,000,000+")
- **icon** - App icon URL (saved as posterUrl)
- **source** - Platform identifier ("Google Play Store" or "Apple App Store")

### Example API Request

```bash
POST /api/search
Content-Type: application/json

{
  "title": "YouVersion",
  "mediaType": "app"
}
```

### Example Response

```json
{
  "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "title": "Bible: The Bible App",
  "mediaType": "app",
  "genre": "Books & Reference",
  "description": "Bring the beauty and truth of the Bible into everyday life...",
  "posterUrl": "https://play-lh.googleusercontent.com/...",
  "discernmentScore": 100,
  "faithAnalysis": "The YouVersion Bible App is an excellent faith-building tool that provides free access to Scripture in hundreds of translations and languages. It promotes daily Bible reading through devotional plans, verse imagery, and community features that encourage believers to engage with God's Word. From a biblical perspective, this app directly supports spiritual growth and scriptural meditation as encouraged in Joshua 1:8.",
  "tags": ["Biblical", "Faith-Building", "Educational"],
  "verse": {
    "text": "Study this Book of Instruction continually. Meditate on it day and night so you will be sure to obey everything written in it. Only then will you prosper and succeed in all you do.",
    "reference": "Joshua 1:8 (NLT)"
  },
  "alternatives": [
    {
      "title": "Olive Tree Bible Study",
      "reason": "Comprehensive study tools with deep scriptural resources."
    },
    {
      "title": "Blue Letter Bible",
      "reason": "Strong academic tools for biblical research and study."
    },
    {
      "title": "Logos Bible",
      "reason": "Professional-grade theological library and study platform."
    }
  ]
}
```

### Integration Notes

- **Automatic Enrichment**: Backend automatically fetches app metadata before AI analysis
- **Caching**: App analyses cached in PostgreSQL to prevent duplicate API calls
- **Make.com Logging**: Webhook logs include `mediaType: "app"` for automation workflows
- **No Authentication Required**: Both Google Play and iTunes APIs are free and open

---

## Community Features (Coming Soon)

The platform includes scaffolded infrastructure for:
- User comments on analyses
- Community reviews and ratings
- Discussion forums
- Prayer request threads

See [Community Page](/community) for updates.

## Documentation

- [Make.com Integration Guide](./MAKE_INTEGRATION.md) - Complete webhook setup and automation scenarios
- [Project Architecture](./replit.md) - Technical overview and system design

## Contributing

This is a faith-based project. Contributions should align with Christian values and biblical principles.

## License

Proprietary - All rights reserved

---

**Built with faith to help believers navigate media with biblical wisdom**
