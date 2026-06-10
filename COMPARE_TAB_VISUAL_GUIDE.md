# Compare Tab - Visual Design Guide

## Overview

The Compare Tab is a premium analytics dashboard with a modern SaaS aesthetic. Below is a detailed visual breakdown of each section.

## Color Palette

```
Primary Purple:     #818cf8  (Current User)
Secondary Cyan:     #22d3ee  (Opponent)
Success Green:      #34d399  (Winners)
Warning Amber:      #fbbf24  (Important)
Danger Red:         #f87171  (Issues)

Text Light:         #f1f5f9  (Headlines)
Text Muted:         #94a3b8  (Descriptions)
Background Deep:    #050810  (Main background)
Glass:              rgba(14, 20, 38, 0.62) + 20px blur
```

## Layout Structure

### Desktop View (1200px+)
```
┌─────────────────────────────────────────────────┐
│                   COMPARE TAB                    │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  Compare Profiles                         │   │
│  │  Go head-to-head against competitors     │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────┐  ┌──┐  ┌──────────────────┐│
│  │  YOU             │  │VS│  │  OPPONENT        ││
│  │  ────────────────│  │  │  │  ────────────────││
│  │  [Avatar]        │  │◯ │  │  [Avatar]        ││
│  │  username        │  │VS│  │  opponent        ││
│  │  ────────────────│  │  │  │  ────────────────││
│  │  Rating: 2400    │  └──┘  │  Rating: 2100    ││
│  │  Peak: 2500      │        │  Peak: 2200      ││
│  │  Problems: 1200  │        │  Problems: 980   ││
│  │  Contests: 45    │        │  Contests: 38    ││
│  └──────────────────┘        └──────────────────┘
│                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ Skill  │ │Consist.│ │Activity│ │Interview   │
│  │Score   │ │        │ │        │ │Readiness   │
│  │ 92 vs  │ │ 85 vs  │ │ 24 vs  │ │ 88 vs 76   │
│  │ 78     │ │ 72     │ │ 18     │ │           │
│  │ ▓▓▓▓   │ │ ▓▓▓▓   │ │ ▓▓▓▓   │ │ ▓▓▓▓▓   │
│  └────────┘ └────────┘ └────────┘ └────────┘   │
│                                                  │
│  ┌─────────────────────────┐ ┌────────────────┐ │
│  │  Topic Comparison       │ │ AI Summary     │ │
│  │                         │ │                │ │
│  │  [Radar Chart with 6    │ │ You have edge  │ │
│  │   topics: Arrays, DP,   │ │ 85% confidence │ │
│  │   Trees, Graphs,        │ │                │ │
│  │   Greedy, Math]         │ │ [Insight chips]│ │
│  │                         │ │                │ │
│  │  Purple = You           │ │                │ │
│  │  Cyan = Opponent        │ │                │ │
│  └─────────────────────────┘ └────────────────┘ │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  Detailed Breakdown                      │   │
│  │  ──────────────────────────────────────  │   │
│  │  Current Rating      │ 2400  │ 2100     │   │
│  │  Peak Rating         │ 2500  │ 2200     │   │
│  │  Problems Solved     │ 1200  │ 980      │   │
│  │  Contests            │ 45    │ 38       │   │
│  │  Activity (30d)      │ 24    │ 18       │   │
│  │  Consistency         │ 85%   │ 72%      │   │
│  │  Skill Score         │ 92    │ 78       │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌───────────┐ ┌───────────┐ ┌──────────────┐  │
│  │Strengths  │ │Areas Focus│ │Recommendat. │  │
│  │           │ │           │ │              │  │
│  │[Tags for] │ │[Tags for] │ │ Practice    │  │
│  │Strong     │ │Weak       │ │ Focus       │  │
│  │Topics]    │ │Topics]    │ │ Engage      │  │
│  └───────────┘ └───────────┘ └──────────────┘  │
└─────────────────────────────────────────────────┘
```

### Mobile View (< 768px)
```
┌─────────────────────────────┐
│     COMPARE TAB             │
│                             │
│  Compare Profiles           │
│  Go head-to-head against    │
│  competitors               │
│                             │
│  ┌──────────────────────┐  │
│  │  YOU                 │  │
│  │  [Avatar]            │  │
│  │  username            │  │
│  │  Rating: 2400        │  │
│  │  Peak: 2500          │  │
│  │  Problems: 1200      │  │
│  │  Contests: 45        │  │
│  └──────────────────────┘  │
│                             │
│  ┌──────────────────────┐  │
│  │  OPPONENT            │  │
│  │  [Avatar]            │  │
│  │  opponent            │  │
│  │  Rating: 2100        │  │
│  │  Peak: 2200          │  │
│  │  Problems: 980       │  │
│  │  Contests: 38        │  │
│  └──────────────────────┘  │
│                             │
│  ┌──────────┐              │
│  │ Skill    │              │
│  │ 92 vs 78 │              │
│  │ ▓▓▓▓▓▓   │              │
│  └──────────┘              │
│  ┌──────────┐              │
│  │ Activity │              │
│  │ 24 vs 18 │              │
│  │ ▓▓▓▓     │              │
│  └──────────┘              │
│  [continues...]            │
│                             │
│  ┌──────────────────────┐  │
│  │ Topic Comparison     │  │
│  │ [Radar]              │  │
│  └──────────────────────┘  │
│                             │
│  ┌──────────────────────┐  │
│  │ [Detailed Table]     │  │
│  └──────────────────────┘  │
│                             │
│  ┌──────────────────────┐  │
│  │ Strengths            │  │
│  │ [Tags]               │  │
│  └──────────────────────┘  │
└─────────────────────────────┘
```

## Component Details

### 1. Hero Section

**Typography:**
- Title: 28px bold, tracking -0.03em
- Subtitle: 15px regular, muted gray

```
╔════════════════════════════════════════╗
║  Compare Profiles                      ║
║  Go head-to-head against any           ║
║  Codeforces competitor.                ║
╚════════════════════════════════════════╝
```

### 2. Profile Cards

**Layout:**
- 56×56px avatar with gradient background
- Handle: 21.6px bold
- Stats in 2×2 grid within glassmorphic background
- Badge at bottom

**Avatar Gradients:**
- Current: Purple (#818cf8) → Cyan (#22d3ee)
- Opponent: Magenta (#c026d3) → Cyan (#06b6d4)

```
┌──────────────────────────────────┐
│  ┌──────┐  YOU                   │
│  │ [U] │  username               │
│  └──────┘  [Your Profile]        │
│                                  │
│  ┌───────────────────────────┐  │
│  │ Current Rating  Peak Rating │  │
│  │    2400            2500    │  │
│  │ Problems Solved   Contests │  │
│  │    1200              45    │  │
│  └───────────────────────────┘  │
│                                  │
│  [Your Profile Badge]            │
└──────────────────────────────────┘
```

### 3. VS Circle

**Properties:**
- 80×80px circle
- Gradient border: Purple → Cyan
- Inner shadow glow
- Text: "VS" 1.1rem bold

```
        ◯ ← 80px diameter
        | "VS"
        | glow effect
```

### 4. KPI Cards (4 Total)

**Grid Layout:**
- Responsive: 4 columns (desktop), 2 columns (tablet), 1 column (mobile)
- Gap: 1rem

**Card Contents:**
- Icon (18px) + Label in header
- Two large numbers (purple and cyan)
- "vs" separator
- Winner indicator in green
- Progress bar below

```
┌────────────────────────┐
│  ⚡ Skill Score       │
│                        │
│    92  vs  78          │
│    ▓▓▓▓    ▓▓▓▓       │
│    (cyan)  (purple)    │
│                        │
│  You lead ↗            │
│  ▓▓▓▓▓▓░░░░░░░░░░    │
└────────────────────────┘
```

### 5. Radar Chart

**Properties:**
- 280px height
- 6 topics arranged in hexagon
- Two data series:
  - Purple (current user)
  - Cyan (opponent)
- Grid: faint white lines
- Tooltip on hover

```
                   Arrays
              /            \
           DP                Greedy
           |                   |
           |       [0-100]     |
         Trees           Math  |
            \                /
               Graphs ◀──┘
```

### 6. Comparison Table

**Structure:**
- White header row with small caps labels
- Alternating hover effects
- Winner values highlighted in green boxes
- Monospace numbers (Instrument Sans)

```
┌──────────────────────────────────────┐
│ Metric          │ You     │ Opponent │
├──────────────────────────────────────┤
│ Current Rating  │ 2400✓   │ 2100     │ ✓ highlighted
│ Peak Rating     │ 2500✓   │ 2200     │
│ Problems Solved │ 1200✓   │ 980      │
│ ...             │ ...     │ ...      │
└──────────────────────────────────────┘
```

### 7. Bottom Cards

**Tags:**
- Green gradient background for strong topics
- Red gradient background for weak topics
- Rounded pill shape: 8px radius, 0.45rem vertical padding

```
Strong Topics:
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ ✓ Arrays     │ │ ✓ DP         │ │ ✓ Trees      │
└──────────────┘ └──────────────┘ └──────────────┘

Weak Topics:
┌──────────────┐ ┌──────────────┐
│ ✗ Geometry   │ │ ✗ String     │
└──────────────┘ └──────────────┘
```

## Animations

### Page Load
- Staggered fade-in with 20px slide-up
- Duration: 0.45s per section
- Delay between items: 0.08s
- Easing: Custom cubic-bezier(0.22, 1, 0.36, 1)

### Card Hover
- Lift effect: -4px translateY
- Scale: 1.01x
- Duration: 0.2s
- Border and shadow enhanced

### Tab Switch
- Fade out current (0.2s)
- Fade in new (0.3s)
- Smooth opacity transition

### Progress Bars
- Animate width: 0 → target value
- Duration: 0.6s
- Easing: ease curve
- Gradient animation on fill

## Glass Effect

**Layering:**
```
Background Image
    ↓
Semi-transparent overlay
  rgba(14, 20, 38, 0.62)
    ↓
20px Backdrop Filter Blur
    ↓
1px Border with glow
  rgba(129, 140, 248, 0.35)
    ↓
24px Shadow
  0 24px 64px rgba(0, 0, 0, 0.45)
```

## Responsive Transitions

### Desktop → Tablet
```
Compare Row: 1fr | auto | 1fr  →  1fr (stacked)
KPI Strip: repeat(4, 1fr)  →  repeat(2, 1fr)
Charts Row: 1fr | 1fr  →  1fr (stacked)
Bottom Cards: repeat(3, 1fr)  →  repeat(2, 1fr)
```

### Tablet → Mobile
```
KPI Strip: repeat(2, 1fr)  →  1fr (single column)
Bottom Cards: repeat(2, 1fr)  →  1fr
Table: Horizontal scroll added
```

## Typography Hierarchy

```
Hero Title          28px | 700 | -0.03em
Section Heading     17.6px | 700 | normal
KPI Header          15.2px | 700 | normal
Stat Label          11.2px | 600 | 0.05em uppercase
Stat Value          21.6px | 700 | Instrument Sans
Table Header        12px | 700 | 0.05em uppercase
Table Cell          14.4px | 600 | normal
Tag                 13.6px | 600 | normal
```

## Spacing Scale

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 0.75rem (12px)
lg: 1rem (16px)
xl: 1.25rem (20px)
2xl: 1.5rem (24px)
3xl: 2rem (32px)
```

## Interactive States

### Buttons/Cards
- Rest: Base styling
- Hover: +1px border brightness, +4px shadow, -4px translateY
- Active: Darker background
- Disabled: 50% opacity

### Inputs
- Rest: Dark background, subtle border
- Focus: Purple border glow
- Error: Red border
- Disabled: Faded appearance

### Tabs
- Inactive: Gray text
- Active: White text + gradient background
- Hover: Slightly lighter border

---

**Design System Version:** 1.0
**Last Updated:** June 10, 2026
