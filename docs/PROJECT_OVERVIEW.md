# PROJECT OVERVIEW
## Personal Portfolio / Digital Business Card

> This document is your north star. Paste it at the top of every Claude Code session to give the model full context on the project before prompting.

---

## Product Summary

A professional one-page portfolio site for an AI Product Manager. Serves as a digital business card and resume — showcasing 9 projects across 3 categories, linking to professional profiles, providing a resume download, and accepting contact form messages. A hidden admin portal (password-protected) provides full visibility into visitor analytics, resume download counts, per-project engagement, and a contact form inbox.

**Live URL:** _(add after deploy)_
**GitHub Repo:** _(add after creation)_
**Admin URL:** `https://yoursite.com/admin` _(not linked publicly)_

---

## Primary User

**Public visitors:** Recruiters, founders, collaborators, and potential clients who receive the portfolio link — likely via LinkedIn, email, or direct share.

**Admin (you):** Monitoring engagement, reading messages, tracking which projects get the most attention.

---

## MVP Feature Set

1. One-page portfolio: hero/bio, social links, project cards, resume download, contact form, footer
2. Project cards in 3 categories with modal popups using a consistent detail template
3. Resume download (PDF) with download event tracking
4. Contact form → Supabase `messages` table inbox
5. Visitor tracking: location, referrer, UTM parameters on every page load
6. Hidden admin portal at `/admin` with: visitor analytics, event stats, project opens leaderboard, messages inbox
7. Projects are served from Supabase `portfolio_projects` in production, with `src/data/projects.json` retained as fallback seed data

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + Magic UI |
| Design System | Magic UI (light mode only) |
| Fonts | DM Serif Display (headings) + DM Sans (body) |
| Backend | Supabase (Postgres + Edge Functions) |
| Hosting | Vercel |
| Icons | lucide-react |
| Routing | React Router v6 |

---

## Color Tokens

```
--color-bg:              #FAFAF9   (warm off-white, page background)
--color-surface:         #FFFFFF   (card/panel/modal background)
--color-border:          #E5E4E2   (subtle borders)
--color-text-primary:    #1C1917   (near-black, headings and body)
--color-text-secondary:  #78716C   (muted text, labels, timestamps)
--color-accent:          #0EA5E9   (sky blue — links, badges, CTA)
--color-accent-subtle:   #F0F9FF   (accent tint — agent arch panel, badges)
```

---

## Supabase Schema

### `visitors`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, gen_random_uuid() |
| created_at | timestamptz | default now() |
| ip_address | text | from ipapi.co |
| country | text | from ipapi.co |
| city | text | from ipapi.co |
| referrer | text | document.referrer |
| utm_source | text | URLSearchParams |
| utm_medium | text | URLSearchParams |
| utm_campaign | text | URLSearchParams |
| user_agent | text | navigator.userAgent |

### `events`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| created_at | timestamptz | default now() |
| visitor_id | uuid | FK → visitors.id (nullable) |
| event_type | text | 'resume_download' \| 'project_open' |
| project_id | text | matches `portfolio_projects.id` (nullable) |
| metadata | jsonb | nullable, reserved for future use |

### `messages`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| created_at | timestamptz | default now() |
| name | text | from contact form |
| email | text | from contact form |
| message | text | from contact form |
| read | boolean | default false |

### `portfolio_projects`
| Column | Type | Notes |
|---|---|---|
| id | text | PK, matches frontend project id |
| title | text | card + modal title |
| category | text | section grouping + modal pill |
| description | text | card summary + modal intro |
| role | text | modal role field |
| tech_stack | text[] | modal tech stack list |
| ai_agent_arch | text | optional modal architecture section |
| outcomes | text[] | card key outcome source + modal outcomes |
| github_url | text | optional modal GitHub button |
| demo_url | text | optional modal Live Demo button |
| sort_order | integer | preserves display order |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### RLS Policies (all tables)
- **anon:** INSERT only — no SELECT
- **authenticated:** full SELECT (+ UPDATE on messages for mark-as-read)
- Admin reads are handled server-side via the `admin-data` Edge Function using the service_role key

---

## Supabase Edge Functions

### `admin-data`
**Purpose:** Server-side proxy for admin dashboard data reads and project writes. Required because the anon key has no SELECT permission on admin-only tables and the admin dashboard uses a protected write path for `portfolio_projects`.

**Request:**
```json
POST /functions/v1/admin-data
Authorization: Bearer <supabase-anon-jwt>
x-admin-secret: ADMIN_SECRET
{ "query": "visitors" | "events" | "messages" | "portfolio_projects", "filters": { ... } }
```

**Response:** JSON array of rows from the requested table.

**Security:** Validates the Bearer token against `ADMIN_SECRET` (stored as a Supabase secret). Returns 401 if token is missing or incorrect. Uses service_role key internally — never exposed to client.

---

## Analytics Module (`src/lib/analytics.js`)

| Function | Trigger | Writes to |
|---|---|---|
| `trackVisitor()` | App load (useEffect) | `visitors` |
| `trackEvent('project_open', id)` | ProjectModal mount | `events` |
| `trackEvent('resume_download', null)` | Resume button click | `events` |
| `submitMessage(formData)` | Contact form submit | `messages` |

`trackVisitor()` uses `https://ipapi.co/json/` for geolocation (free, no key needed). Fails silently — never blocks page load. Deduplication via `sessionStorage['visitor_id']`.

---

## Project Data Structure (`src/data/projects.json` fallback + `portfolio_projects` source schema)

```json
{
  "categories": ["Internal Tools", "Production Builds", "Capstone + Learning"],
  "projects": [
    {
      "id": "unique-kebab-case-id",
      "title": "Project Title",
      "category": "Internal Tools",
      "description": "2-3 sentence card description",
      "role": "Your role on this project",
      "techStack": ["Tech 1", "Tech 2"],
      "aiAgentArch": null,
      "outcomes": ["Outcome 1", "Outcome 2"],
      "links": {
        "github": null,
        "demo": null
      }
    }
  ]
}
```

`aiAgentArch` is `null` for non-AI projects. When not null, it renders as a highlighted info panel in the modal.

Equivalent `portfolio_projects` DB mapping for a single project row:

```text
id            -> id
title         -> title
category      -> category
description   -> description
role          -> role
techStack     -> tech_stack
aiAgentArch   -> ai_agent_arch
outcomes      -> outcomes
links.github  -> github_url
links.demo    -> demo_url
```

---

## Key File Paths

```
src/
├── App.jsx                          # Router, trackVisitor() on load
├── data/
│   ├── projects.json                # Fallback seed data for portfolio projects
│   └── profile.json                 # Name, bio, social links
├── hooks/
│   └── useProjects.js               # Fetches Supabase-backed project data with fallback
├── lib/
│   ├── analytics.js                 # trackVisitor, trackEvent, submitMessage
│   └── supabaseClient.js            # Supabase client (anon key)
│   └── projectsApi.js               # Public project fetch path (`portfolio_projects`)
├── components/
│   ├── ProjectCard.jsx              # Card: title, category badge, description
│   ├── ProjectModal.jsx             # Full detail modal
│   ├── sections/
│   │   ├── Hero.jsx                 # Name, bio, social links
│   │   ├── Projects.jsx             # 3-category grid with cards
│   │   ├── ResumeDownload.jsx       # Download button with tracking
│   │   ├── Contact.jsx              # Form → submitMessage()
│   │   └── Footer.jsx
│   └── admin/
│       ├── AdminLogin.jsx           # Password gate
│       ├── AdminPanel.jsx           # Reusable panel wrapper (loading/empty/error)
│       ├── VisitorStats.jsx         # Visitor counts, top countries, referrers
│       ├── EventStats.jsx           # Downloads count + project opens leaderboard
│       └── MessagesInbox.jsx        # Inbox with read/unread
├── pages/
│   ├── Home.jsx                     # One-pager (all sections)
│   └── Admin.jsx                    # Admin dashboard
└── styles/
    └── globals.css

supabase/
└── functions/
    └── admin-data/
        └── index.ts                 # Admin data proxy Edge Function
```

---

## Environment Variables

```bash
# .env (never commit — see .env.example)
VITE_SUPABASE_URL=           # Supabase project URL
VITE_SUPABASE_ANON_KEY=      # Supabase anon/public key
VITE_ADMIN_PASSWORD=         # Admin portal password (also set as ADMIN_SECRET in Supabase)
```

Supabase Edge Function secrets (set via CLI, never in .env):
```
ADMIN_SECRET=                # Same value as VITE_ADMIN_PASSWORD, sent as x-admin-secret
SUPABASE_SERVICE_ROLE_KEY=   # Auto-available in Edge Functions
```

---

## Build Workbook Files

| File | Phase | Est. Time |
|---|---|---|
| `build-core.md` | Scaffold, Supabase, all sections, admin portal | ~7 hrs |
| `build-refinement.md` | Error handling, validation, admin improvements | ~4 hrs |
| `design.md` | Magic UI, tokens, polish, responsive | ~5 hrs |
| `app-hardening.md` | RLS, secrets, deploy, performance | ~2.5 hrs |

**Total estimated build time:** ~18-20 hours

---

## Admin Portal Notes

- URL: `/admin` — not linked anywhere on the public site
- Password stored in `.env` as `VITE_ADMIN_PASSWORD` — embedded in the compiled bundle (security-through-obscurity for the gate UI)
- Real security is Supabase RLS — anon key has no SELECT on any table
- All admin data reads go through the `admin-data` Edge Function using the service_role key
- Session stored in `sessionStorage['admin_auth']` — clears on tab close

---

*Last updated: Initial generation — update as the project evolves.*
