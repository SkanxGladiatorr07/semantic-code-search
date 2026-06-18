# Semantic Code Search - Google Gemini UI Design Prompt

**Copy and paste this entire prompt into Google Gemini to design an updated UI for this application.**

---

## Project Overview

You are designing a UI for **Semantic Code Search**, a web application that helps developers search, analyze, and understand GitHub repositories using AI-powered semantic search capabilities.

### Application Purpose
- Import public GitHub repositories
- Scan and analyze code to extract functions, classes, and interfaces
- Perform semantic search on code symbols
- Chat with an AI assistant about the repository
- Generate AI-powered insights and summaries about projects

### Tech Stack
- **Frontend**: React 18 with Vite, React Router v6
- **Backend**: Node.js with Express
- **Database**: MySQL
- **AI**: Groq API (llama-3.3-70b-versatile model)
- **Build Tool**: Vite with code splitting and minification
- **Styling**: CSS-in-JS (styled-jsx) + External CSS files
- **API Communication**: Axios with environment-based configuration

---

## Current Design System

### Design Principles
1. **Modern & Clean**: Minimize visual clutter, use ample whitespace
2. **Consistent**: Unified component library with reusable patterns
3. **Accessible**: WCAG compliance-ready (manual testing required for full validation)
4. **Responsive**: Mobile-first approach, supporting desktop, tablet, mobile
5. **Performance-focused**: No unnecessary animations, optimized transitions

### Color Palette
- **Primary**: #3b82f6 (Blue) - Main actions, highlights
- **Secondary**: #6b7280 (Gray) - Secondary actions
- **Success**: #10b981 (Green) - Success states, positive feedback
- **Error**: #ef4444 (Red) - Error messages, dangerous actions
- **Warning**: #f59e0b (Amber) - Warnings, caution
- **Neutral**: #f9fafb to #111827 (Light to Dark grays) - Text and backgrounds

### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, etc.)
- **Page Title**: 2rem (bold)
- **Section Title**: 1.25-1.5rem
- **Card Title**: 1rem-1.125rem
- **Body Text**: 1rem (default)
- **Small Text**: 0.875rem

### Spacing System
- Extra Small (xs): 4px
- Small (sm): 8px
- Medium (md): 16px
- Large (lg): 24px
- Extra Large (xl): 32px
- Double XL (2xl): 48px

### Border Radius
- Small (sm): 4px
- Medium (md): 8px
- Large (lg): 12px

### Shadows
- Subtle: 0 1px 3px rgba(0, 0, 0, 0.1)
- Medium: 0 4px 6px rgba(0, 0, 0, 0.1)
- Large: 0 10px 25px rgba(0, 0, 0, 0.1)

### Transitions
- Fast: 0.2s ease
- Medium: 0.3s ease
- Slow: 0.5s ease

---

## Application Pages & Components

### 1. **Home Page** (Hero Landing)
**Path**: `/`
**Purpose**: Entry point showcasing application capabilities
**Components**:
- Hero section with title and CTA buttons
- Features grid (4 columns on desktop, 2 columns on tablet, 1 on mobile)
- Feature cards with icon, title, and description

**Features Displayed**:
- 📦 Repository Import
- 🔍 Semantic Search
- 📊 Code Analysis
- 💬 AI Assistant

**Layout Pattern**: Hero (full width) → Features Grid (max-width: 1400px centered)

**Interactive Elements**:
- "Get Started" button → Navigate to Dashboard
- "View Repositories" button → Navigate to Repositories page

---

### 2. **Dashboard Page** (Main Hub)
**Path**: `/dashboard`
**Purpose**: Central hub showing server status, repository management, and quick actions
**Components**:
- Page header with title and subtitle
- 2x2 Grid of cards containing:
  1. Server Status Card
  2. Repository Management Card
  3. Quick Actions Card
  4. Getting Started Guide Card

**Server Status Card**:
- Shows backend connection status
- Environment info
- Service status
- Loading spinner during fetch
- Error message if connection fails
- Success state with ✅ indicator

**Quick Actions Card**:
- Vertical button group:
  - View All Repositories
  - View Analytics (disabled)
  - Recent Searches (disabled)

**Getting Started Card**:
- Ordered list of steps:
  1. Add a repository
  2. Scan the repository
  3. Analyze code
  4. Search and chat

**Layout**: Grid-based, responsive (4 cols desktop → 2 cols tablet → 1 col mobile)

---

### 3. **Repositories Page** (Management Hub)
**Path**: `/repositories`
**Purpose**: List, add, manage repositories
**Components**:
- Page header with title
- Repository form component (modal or inline)
- Repository list with cards/table showing:
  - Repository name
  - GitHub URL
  - Last scanned date
  - Scan status (pending/completed/failed)
  - Action buttons (view, analyze, delete)
- Empty state when no repositories exist
- Loading state with spinner
- Error state with retry option

**Repository Card Layout**:
- Repository icon/avatar
- Repository name
- GitHub URL (clickable link)
- Status badge (color-coded)
- Last scanned timestamp
- Quick action buttons: View, Analyze, Delete, etc.
- Navigation to sub-pages (Files, Symbols, Search, Chat, Insights, Summary)

**Responsive Grid**:
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column (full width)

---

### 4. **Repository Files Page** (Code Inventory)
**Path**: `/repositories/:id/files`
**Purpose**: Display scanned files from repository
**Components**:
- Header with breadcrumb navigation
- Statistics cards (Total Files, File Types, Scan Date)
- Search input for filtering files
- File type filter dropdown
- Files table with columns:
  - Type icon (📄, 🐍, ⚙️, etc.)
  - File name
  - File path
  - Extension
  - File size
- Table sorting by column (clickable headers)
- No files / Not scanned state

**File Icons by Type**:
- .js → 📜, .jsx → ⚛️, .ts → 📘, .tsx → ⚛️
- .py → 🐍, .java → ☕, .cpp/.c → ⚙️
- .html → 🌐, .css → 🎨, .json → 📋
- .md → 📝, .txt → 📄, .xml → 📰
- .sql → 🗃️, .sh → 🐚, .env → 🔐
- Images (.png, .jpg, .svg) → 🖼️

**Layout**: Full-width content area, max-width: 1400px centered

---

### 5. **Repository Symbols Page** (Code Components)
**Path**: `/repositories/:id/symbols`
**Purpose**: Display extracted functions, classes, and interfaces
**Components**:
- Header with breadcrumb
- Statistics cards:
  - Total Symbols
  - Functions count
  - Classes count
  - Interfaces count (if any)
- Search input
- Filter dropdown (All types, Functions, Classes, Interfaces)
- Symbols grouped by file:
  - File header with name, path, symbol count
  - Symbol cards in grid showing:
    - Type badge (⚡ Function, 📦 Class, 🔷 Interface)
    - Symbol name (monospace font)
    - Inline type display

**Symbol Card Design**:
- Background: Light gray (#f9fafb)
- Border: 1px solid #e5e7eb
- Padding: 16px
- Min height: 80px
- Type badge: Color-coded (blue for functions, green for classes, purple for interfaces)
- Symbol name: Monospace font, 15px, bold

**Empty States**:
- No symbols found
- Repository not analyzed yet
- Error loading symbols

---

### 6. **Repository Search Page** (Semantic Symbol Search)
**Path**: `/repositories/:id/search`
**Purpose**: Search symbols by name with filters and sorting
**Components**:
- Header with breadcrumb
- Search form containing:
  - Large search input (autofocus)
  - Type filter dropdown
  - Search button
  - Clear button (if search performed)
- Results toolbar showing:
  - Statistics (total results, functions, classes, interfaces)
  - Sort dropdown (by relevance, name, file)
  - Extension filter dropdown
  - Expand/Collapse All button
- Search results grouped by file:
  - Collapsible file headers
  - Symbol items with:
    - Icon (type indicator)
    - Symbol name with highlighted matches
    - Type badge
    - "Details" link
- Empty state with tips and suggestions
- Loading state with spinner

**Search UI Features**:
- Query highlighting in results
- File-based grouping with expand/collapse
- Symbol count per file
- Quick links to other views
- "Try asking" suggestions for initial state

**Suggestion Chips** (after search):
- "What does this repository do?"
- "What are the main functions?"
- "Explain the project structure"

---

### 7. **Repository Chat Page** (AI Conversation)
**Path**: `/repositories/:id/chat`
**Purpose**: Multi-turn conversation with AI about repository
**Components**:
- Header with breadcrumb and title
- Clear chat button (disabled when empty)
- Chat messages area:
  - User messages (right-aligned, blue background, white text)
  - AI messages (left-aligned, white background)
  - Error messages (left-aligned, red background)
  - Avatar icons (👤 user, 🤖 AI, ⚠️ error)
  - Timestamp for each message
  - Context metadata (symbols count, files used)
- Chat input area:
  - Error alert (if any)
  - Textarea (auto-growing, Enter to send, Shift+Enter for newline)
  - Send button (disabled when loading or empty)
  - Suggestion chips below input:
    - "What does this repository do?"
    - "What are the main functions?"
    - "Explain the project structure"

**Chat Message Design**:
- Avatar: 40px circle, 1.5rem emoji
- Bubble: Max-width 70% on desktop
- Timestamp: Small gray text
- Metadata: Small border-top with context info
- Animation: Fade-in on appearance
- Typing indicator: 3 dots bouncing animation

**Chat Features**:
- Auto-scroll to latest message
- Suggestion chips clickable
- Clear chat functionality
- Error recovery with retry
- Loading overlay during AI response

---

### 8. **Repository Insights Page** (Analytics Dashboard)
**Path**: `/repositories/:id/insights`
**Purpose**: Statistical and analytical overview
**Components**:
- Header with breadcrumb and title
- Primary card (full width):
  - Repository info
  - GitHub link
  - Description
  - Gradient background (purple/violet)
  - White text
- Statistics cards grid:
  - Total Files (📄)
  - Total Symbols (🔢)
  - Functions (⚡)
  - Classes (📦)
  - Interfaces (🔷)
  - Last Scan Date (🕐)
  - Each card shows: icon, title, large number value, label
- File types distribution section:
  - Table/grid showing file extensions and counts
  - One extension per row/box
- Quick action buttons:
  - 💬 Chat with Repository
  - 🔍 Search Symbols
  - 📊 View All Symbols

**Card Colors**:
- Primary Card: Linear gradient #667eea → #764ba2
- Scan Card: Light blue background (#f0f9ff)
- Stat Cards: White with 1px border
- Status badges: Green for completed, yellow for pending

**Layout**: 
- Primary card: Full width
- Stat cards: 3-column grid (desktop) → 2 columns (tablet) → 1 column (mobile)
- File types: Full width grid, auto-fit columns

---

### 9. **Repository Summary Page** (AI Summary)
**Path**: `/repositories/:id/summary`
**Purpose**: AI-generated comprehensive repository overview
**Components**:
- Header with breadcrumb and title
- Generate button prompt (if no summary):
  - Large emoji (🤖)
  - Title: "Generate AI Summary"
  - Description
  - "Generate Summary" button
- Summary sections (when generated):
  - 📋 Overview (large paragraph)
  - 🎯 Purpose
  - 🛠️ Technologies & Tools (chip grid, blue badges)
  - 💻 Languages (chip grid, yellow badges)
  - 🏗️ Architecture (paragraph)
  - 📦 Major Classes (cards with name, file, purpose)
  - ⚡ Major Functions (cards with name, file, purpose)
  - ✨ Key Features (bulleted list)
  - 📊 Complexity Assessment (single badge: Low/Medium/High)
  - Statistics footer (Total Files, Total Symbols, Analyzed Files)
- Regenerate button in actions section
- Regenerate button replaces Generate button
- Loading overlay during generation

**Item Card Design** (Classes/Functions):
- Background: #f9fafb
- Padding: 12px
- Header: Icon + Name (monospace, bold)
- Meta: File info (smaller text)
- Purpose: Description paragraph
- Border-radius: 6px

**Complexity Badge Colors**:
- Low: Green (#d1fae5, text #065f46)
- Medium: Yellow (#fef3c7, text #92400e)
- High: Red (#fee2e2, text #991b1b)

**Section Background**: White cards with 1px border, rounded corners, padding 24px

---

## Common UI Patterns & Components

### Buttons
- **Primary Button**: Blue background, white text, hover darkens color + lifts up
- **Secondary Button**: Gray background, hover effect
- **Outline Button**: Transparent with colored border, filled on hover
- **Size Variants**: sm (small), md (default), lg (large)
- **States**: Default, Hover, Active, Disabled (50% opacity)

### Form Elements
- **Input fields**: 2px border, focus shows blue border + light blue shadow
- **Dropdowns/Selects**: Same styling as inputs
- **Labels**: Bold, 12px, dark gray, margin-bottom 8px
- **Form groups**: Margin-bottom 24px

### Cards
- **Background**: White (#ffffff)
- **Border**: 1px solid #e5e7eb
- **Border-radius**: 12px
- **Padding**: 24px (lg), 16px (md)
- **Shadow**: 0 1px 3px rgba(0, 0, 0, 0.1)
- **Hover**: Shadow increases, slight transform translateY(-2px)

### Badges
- **Primary**: Blue background (#dbeafe), blue text (#1e40af)
- **Success**: Green background (#d1fae5), green text (#065f46)
- **Danger**: Red background (#fee2e2), red text (#991b1b)
- **Warning**: Yellow background (#fef3c7), yellow text (#92400e)
- **Padding**: 4px 12px, radius: 9999px

### Loading States
- **Spinner**: 48px circle, 3px border top colored, rotation animation
- **Text**: "Loading..." or specific action text
- **Loading Overlay**: Full-screen semi-transparent background with centered spinner
- **Disabled interactions**: 50% opacity, cursor: not-allowed

### Empty States
- **Large emoji**: 4rem
- **Title**: 1.5rem, bold, dark gray
- **Description**: 1rem, light gray
- **CTA Button**: Primary button below
- **Icon**: Center-aligned

### Error States
- **Background**: Light red (#fee2e2)
- **Border**: 1px solid #fca5a5
- **Text**: Dark red (#991b1b)
- **Icon**: ❌ or ⚠️
- **Close button**: Visible to dismiss

### Data Tables
- **Header**: Dark gray background (#f3f4f6)
- **Rows**: White, 1px border-bottom
- **Hover**: Light gray background (#f9fafb)
- **Padding**: 12px per cell
- **Responsive**: Stack on mobile, horizontal scroll on tablet

### Navigation
- **Breadcrumb**: Small text (0.875rem), links in primary blue
- **Separators**: Light gray text "/"
- **Current page**: Light gray text (not a link)

### Status Indicators
- **Badges**: Color-coded by status
  - Completed: Green
  - Pending: Yellow/Amber
  - Failed: Red
  - Processing: Blue with animation

---

## Responsive Breakpoints

### Desktop (≥1024px)
- Full layout, multi-column grids
- Cards: 3-4 columns
- Sidebars visible
- Tables with all columns

### Tablet (768px - 1023px)
- 2-column layouts
- Cards: 2 columns
- Reduced padding
- Stacked sidebars

### Mobile (< 768px)
- Single column layout
- Full-width cards
- Stacked buttons
- Hidden non-essential UI
- Bottom navigation if needed
- Reduced font sizes
- Single column for all grids

### Micro (< 480px)
- Very compact layouts
- Minimal padding
- Larger touch targets (44px minimum)
- Simplified tables → card view

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance (Planning)
- Color contrast: Minimum 4.5:1 for text, 3:1 for UI components
- Focus indicators: Visible 2px outline on all interactive elements
- Keyboard navigation: Tab order logical, Enter to activate buttons
- ARIA labels: For screen readers on icons and interactive elements
- Semantic HTML: Proper heading hierarchy (h1, h2, h3)
- Alt text: For all images and icons with meaningful descriptions
- Error messages: Clear, associated with form fields
- Loading states: Announce to screen readers

### Manual Testing Required
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard navigation testing
- Color contrast verification
- Focus management testing

---

## Layout Grid System

### Max-width Container
- Desktop: 1400px centered
- Padding: 24px on sides
- Margin: 0 auto

### Column Grid
- Desktop: 12-column system or CSS Grid
- Tablet: 8-column
- Mobile: 4-column

### Gaps/Gutters
- Desktop: 24px
- Tablet: 16px
- Mobile: 12px

---

## Animation & Interactions

### Hover Effects
- Button color shift + scale(1.02)
- Card shadow increase + translateY(-2px)
- Link underline appear
- Icon color change

### Loading Animations
- Spinner: Continuous 360° rotation
- Pulse: Optional opacity fade for loading text
- Skeleton screens: Optional for content previews

### Transitions
- All: 0.2s ease
- On focus: No animation, instant focus state
- Page navigation: Optional fade-in animation

### Disabled States
- Opacity: 50%
- Cursor: not-allowed
- No hover effects

---

## Suggested Enhancements

### UI Improvements
1. **Dark Mode**: Toggle switch for theme preference
2. **Advanced Filters**: More filtering options on search page
3. **Favorite Repositories**: Star/favorite functionality
4. **Repository Templates**: Quick templates for common setups
5. **Code Highlighting**: Syntax highlighting in results
6. **Export**: Export search results or summaries as PDF/CSV

### Feature Enhancements
1. **Real-time Collaboration**: Multiple users on same repo
2. **Analytics Dashboard**: Trends over time
3. **API Documentation**: Auto-generated docs from code
4. **Metrics**: Code quality, complexity scores
5. **Alerts**: Notifications for repository changes
6. **Scheduled Scans**: Auto-scan on schedule

### Performance
1. **Lazy Loading**: Load repositories on scroll
2. **Infinite Scroll**: Alternative to pagination
3. **Search Debouncing**: Delay API calls during typing
4. **Caching**: Cache search results and symbols
5. **Progressive Web App**: Offline support

---

## Implementation Notes

### React Component Structure
```
App
├── Layout (wrapper with Navbar + Outlet)
├── Home
├── Dashboard
├── Repositories
├── RepositoryFiles
├── RepositorySymbols
├── RepositorySearch
├── RepositoryChat
├── RepositoryInsights
└── RepositorySummary

Common Components
├── Navbar
├── LoadingSpinner
├── ErrorMessage
├── EmptyState
├── Breadcrumb
└── StatusBadge
```

### API Integration Points
- `GET /api/health` - Server status
- `GET /api/repositories` - List repositories
- `POST /api/repositories` - Add repository
- `GET /api/repositories/:id/files` - Get files
- `GET /api/repositories/:id/symbols` - Get symbols
- `GET /api/repositories/:id/search` - Search symbols
- `POST /api/repositories/:id/chat` - Chat with AI
- `GET /api/repositories/:id/insights` - Get insights
- `POST /api/repositories/:id/summary` - Generate summary

### Environment Variables for Frontend
```
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
```

### CSS Approach
- Global styles: `global.css` (design system, utilities)
- Component-level: `styled-jsx` or separate `.css` files
- Layout: `layout.css` (grid, spacing utilities)
- Variables: CSS custom properties for colors, spacing, shadows

---

## Brand Voice & Tone

- **Modern**: Use contemporary design patterns
- **Helpful**: Clear guidance and helpful tooltips
- **Technical**: Respect developer knowledge, use appropriate terminology
- **Friendly**: Welcoming error messages and empty states
- **Professional**: Clean, organized, distraction-free interface

---

## Copy Examples

### Empty States
- "No repositories yet. Add one to get started!"
- "No results found. Try adjusting your search filters."
- "Repository not scanned yet. Click 'Analyze' to get started."

### Error Messages
- "Failed to connect to server. Please try again."
- "Unable to generate summary. Check your API key and try again."
- "Repository not found. It may have been deleted."

### Loading States
- "Scanning repository files..."
- "Analyzing code structure..."
- "Generating AI summary..."

### Success Messages
- "Repository added successfully!"
- "Scan completed. Ready to explore!"
- "Analysis complete. View insights."

---

**End of Prompt**

---

Copy this entire prompt into Google Gemini and request:
"Design a modern, professional UI for this application. Include mockups or prototypes for each page, component variations, responsive layouts, and any suggested improvements to the user experience."
