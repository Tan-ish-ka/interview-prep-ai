# Compare Tab - Usage Guide

## Overview

The Compare Tab is a premium analytics dashboard that allows users to compare their Codeforces profile against any other competitor. It features a modern SaaS-style interface with glassmorphism effects, cyan + purple accents, and comprehensive metrics visualization.

## Component Architecture

### Main Component: `CompareTab`

Located at: `src/components/CompareTab.tsx`

**Props:**
```typescript
interface CompareTabProps {
  currentReport: ReportResponse;      // Current user's report
  opponentReport?: ReportResponse;    // Opponent's report (optional)
}
```

## Features

### 1. Hero Section
- Displays the page title "Compare Profiles"
- Subtitle: "Go head-to-head against any Codeforces competitor"

### 2. Top Comparison Row
Two large profile cards (side by side on desktop, stacked on mobile):
- **Current User Card** (left): Shows your profile information
  - Avatar with gradient background
  - Handle and profile label
  - Key stats: Current Rating, Peak Rating, Problems Solved, Contests
  - Badge indicating "Your Profile"

- **Opponent Card** (right): Shows opponent's profile information
  - Avatar with different gradient
  - Handle and opponent label
  - Same stat cards as current user
  - Badge with opponent's handle

- **VS Circle**: Animated circle in the middle with "VS" text
  - Only visible on desktop (hidden on mobile)
  - Features gradient border and glow effect

### 3. KPI Strip (4 Cards)
Four key metric cards displayed in a responsive grid:
1. **Skill Score** - Overall skill assessment
2. **Consistency** - Momentum and steadiness
3. **Activity** - Problems solved in last 30 days
4. **Interview Readiness** - Interview preparation level

Each card displays:
- Large score for both users
- Winner indicator ("You lead" or "Opponent leads")
- Progress bar showing relative performance

### 4. Charts Area (Two-Column Layout)
- **Left: Radar Chart**
  - Compares expertise across topics:
    - Arrays, DP, Trees, Graphs, Greedy, Math
  - Current user shown in purple (#818cf8)
  - Opponent shown in cyan (#22d3ee)
  - Interactive tooltip on hover

- **Right: AI Comparison Summary**
  - Winner determination with confidence percentage
  - Explanation of comparison results
  - Insight chips showing key advantages/disadvantages

### 5. Detailed Breakdown Table
Comprehensive comparison table with 8 metrics:
- Current Rating
- Peak Rating
- Problems Solved
- Contests
- Activity (30 days)
- Consistency
- Skill Score
- (Extensible for additional metrics)

Better values are highlighted with green background (#34d399).

### 6. Bottom Cards (3-Column Grid)
1. **Your Strengths** - Top strong topics with tags
2. **Areas to Focus** - Weak topics with tags
3. **Recommendations** - Actionable insights

## Integration with Dashboard

The Compare Tab is integrated into the main Dashboard component with tab navigation:

```typescript
// In Dashboard.tsx
const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

// Tabs: "overview" | "topics" (Compare) | "recommendations"
{activeTab === "topics" && (
  <CompareTab currentReport={report} opponentReport={opponentReport} />
)}
```

## Styling System

### CSS Classes Structure
All styles are organized in `App.css` under the "COMPARE TAB STYLES" section (line 1725+)

**Key Class Prefixes:**
- `.compare-` - Main layout classes
- `.compare-hero-` - Hero section
- `.compare-profile-` - Profile cards
- `.compare-vs-circle-` - VS circle
- `.compare-kpi-` - KPI cards
- `.compare-radar-` - Radar chart section
- `.compare-summary-` - AI summary
- `.compare-table-` - Comparison table
- `.compare-bottom-card-` - Bottom cards
- `.compare-tag-` - Tag styling
- `.compare-insight-chip-` - Insight chips

### Color Scheme
- **Primary Accent:** Purple `#818cf8` (current user)
- **Secondary Accent:** Cyan `#22d3ee` (opponent)
- **Success:** Green `#34d399` (winners)
- **Warning:** Yellow `#fbbf24` (attention)
- **Text:** Light slate `#f1f5f9`
- **Text Muted:** Medium slate `#94a3b8`
- **Background:** Deep navy `#050810`
- **Glass Background:** Semi-transparent `rgba(14, 20, 38, 0.62)`

### Responsive Breakpoints
- Mobile: Default (single column)
- Tablet: `@media (max-width: 1000px)`
- Desktop: `grid-template-columns: 1fr 1fr`

## Empty State

When `opponentReport` is undefined, displays:
- Trophy icon
- "No opponent selected" heading
- Prompt to "Search for a Codeforces competitor to compare profiles"

## Data Flow

```
CompareTab (receives reports)
├── Hero Section
├── Profile Cards
│   ├── Current User Stats
│   ├── VS Circle
│   └── Opponent Stats
├── KPI Strip (4 cards)
├── Charts Row
│   ├── Radar Chart
│   └── AI Summary
├── Detailed Table
└── Bottom Cards
    ├── Strong Topics
    ├── Weak Topics
    └── Recommendations
```

## Animation

All sections use Framer Motion for smooth transitions:
- **Container:** `staggerContainer` - Staggered child animations
- **Sections:** `fadeUp` - Fade in + slide up effect
- **Duration:** 0.45s with ease-out timing
- **Stagger Delay:** 0.08s between children

## TypeScript Types

```typescript
// From types/report.ts
interface ReportResponse {
  profile: Profile;
  insights: Insights;
  recommendations: string[];
  interview_preparation: InterviewPreparation;
}

// Key nested types used
interface Profile {
  username: string;
  current_rating: number | null;
  max_rating: number | null;
  total_solved: number;
  tag_stats: TagStat[];
}

interface Insights {
  skill_score: number;
  momentum_score: number;
  activity_stats: ActivityStats;
  contest_stats: ContestStats;
  strong_topics: string[];
  weak_topics: string[];
  top_tags: Record<string, number>;
}
```

## Recharts Configuration

**Radar Chart:**
- Type: `RadarChart`
- Data: 6 topics with current and opponent values (0-100)
- Strokes: Purple for current, Cyan for opponent
- Styling: Dark theme with transparent grid

**Customization Options:**
```typescript
radarData = [
  { name: "Topic", current: 85, opponent: 72 },
  // ... more topics
]
```

## Future Enhancements

Possible improvements:
1. Add more chart types (BarChart, LineChart for rating trends)
2. Expand radar chart topics (currently 6)
3. Add head-to-head rating history comparison
4. Include problem difficulty distribution
5. Add contest performance trends
6. Interactive filtering by date range
7. Export comparison as PDF/image

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (responsive design)

## Performance Notes

- All data is computed from ReportResponse objects
- No external API calls within the component
- Animations use GPU-accelerated transforms
- Chart rendering optimized with ResponsiveContainer
