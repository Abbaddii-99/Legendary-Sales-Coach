# Joe Girard Sales Coach - Design Guidelines

## 1. Brand Identity

**Purpose**: A sales training app that transforms users into master salespeople through AI-powered roleplay coaching with "Joe Girard," the legendary car salesman. Users practice real sales scenarios, receive instant feedback, and build their personal CRM.

**Aesthetic Direction**: **Bold & Confident** - High-contrast, professional, motivational. Think premium business coaching meets actionable intensity. Dominant navy/gold palette conveys authority and success. Sharp typography and clean layouts project confidence without clutter.

**Memorable Element**: Every training session ends with a signature "Joe's Golden Rule" card—a swipeable motivational quote with metallic gold accent that users can save and share.

## 2. Navigation Architecture

**Root Navigation**: Tab Bar (4 tabs) with floating action button for core action

**Tabs**:
1. **Home** - Dashboard with stats and quick actions
2. **Training** - Roleplay scenarios library
3. **CRM** - Personal client notes and follow-ups
4. **Profile** - Settings and progress tracking

**Floating Action Button**: "Start Training Session" (positioned center-bottom, above tab bar)

**Auth**: No authentication required (local-first app with optional cloud sync). Profile screen includes user avatar, display name, and preferences.

## 3. Screen-by-Screen Specifications

### 3.1 Home (Dashboard)
- **Stack**: Home Tab
- **Header**: Transparent, no title, right button (settings icon)
- **Layout**: ScrollView
  - Top: Greeting card with user name and motivational quote
  - Stats section: Cards showing total sessions, win rate, clients tracked
  - "Recent Sessions" list (last 3)
  - "Quick Tips" carousel from Joe
- **Safe Area**: Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Empty State**: When no sessions completed yet, show illustration with "Ready to become a sales legend?"

### 3.2 Training Library
- **Stack**: Training Tab
- **Header**: Default with title "Training Scenarios", right button (filter icon)
- **Layout**: List (FlatList)
  - Categories: "Automotive", "Real Estate", "Tech Services", "Retail"
  - Each scenario card shows difficulty level, estimated time, focus area
- **Safe Area**: Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Empty State**: N/A (always has default scenarios)

### 3.3 Active Training Session (Modal)
- **Stack**: Modal (full screen)
- **Header**: Custom, transparent background
  - Left: Exit button (with confirmation alert)
  - Center: Customer persona name (e.g., "The Skeptic")
  - Right: Timer
- **Layout**: ScrollView with chat-like interface
  - Messages alternate between "Customer" and "You"
  - After each user message, Joe's feedback appears in gold-bordered card before customer responds
  - Input at bottom: Text field with send button
- **Safe Area**: Top: insets.top + Spacing.xl, Bottom: insets.bottom + Spacing.xl
- **Components**: Chat bubbles, feedback cards, text input

### 3.4 Session Summary (Modal)
- **Stack**: Modal (presented after session ends)
- **Header**: None
- **Layout**: ScrollView
  - Top: Success illustration
  - Score breakdown (5 criteria from rubric)
  - Joe's overall feedback paragraph
  - "Save Client Note" form
  - CTA buttons: "Save to CRM" or "Dismiss"
- **Safe Area**: Top: insets.top + Spacing.xl, Bottom: insets.bottom + Spacing.xl

### 3.5 CRM (Client Notes)
- **Stack**: CRM Tab
- **Header**: Default with title "My Clients", right button (add icon)
- **Layout**: List (FlatList) of client cards
  - Each card: Client name, personal note snippet, last contact date
  - Tap to view details and follow-up suggestions
- **Safe Area**: Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Empty State**: Illustration with "No clients tracked yet. Complete a session to start building your network."

### 3.6 Client Detail
- **Stack**: CRM Tab stack
- **Header**: Default with client name as title, right button (edit icon)
- **Layout**: ScrollView
  - Avatar (user-selected or generated)
  - Personal notes section (editable)
  - Follow-up ideas from Joe (generated based on notes)
  - Contact history timeline
- **Safe Area**: Top: Spacing.xl, Bottom: insets.bottom + Spacing.xl

### 3.7 Profile/Settings
- **Stack**: Profile Tab
- **Header**: Transparent, title "Profile"
- **Layout**: ScrollView
  - User avatar (tappable to change)
  - Display name field
  - Stats summary (total sessions, favorite scenario)
  - Settings sections: Notifications, Theme, About
- **Safe Area**: Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + Spacing.xl

## 4. Color Palette

**Primary**: Navy Blue (#1A2B4A) - Authority, professionalism
**Accent**: Gold (#D4AF37) - Success, achievement (used sparingly for highlights, awards, CTAs)
**Background**: Off-White (#F8F9FA)
**Surface**: White (#FFFFFF)
**Text Primary**: Charcoal (#2C3E50)
**Text Secondary**: Gray (#6C757D)
**Success**: Emerald Green (#27AE60)
**Warning**: Amber (#F39C12)
**Error**: Crimson (#C0392B)

**Semantic Colors**:
- Customer messages: Light Blue (#E3F2FD)
- User messages: Navy with white text
- Joe's feedback cards: Gold border, cream fill (#FFF9E6)

## 5. Typography

**Font**: Montserrat (Google Font) for headings, System Sans-Serif for body
- **Display**: Montserrat Bold, 32px (welcome messages, stats)
- **H1**: Montserrat Bold, 24px (screen titles)
- **H2**: Montserrat SemiBold, 20px (section headers)
- **H3**: Montserrat SemiBold, 18px (card titles)
- **Body**: System Regular, 16px
- **Caption**: System Regular, 14px (timestamps, meta info)
- **Button**: Montserrat SemiBold, 16px

## 6. Assets to Generate

**Required**:
1. **icon.png** - App icon: Joe Girard's silhouette in suit with gold star badge
2. **splash-icon.png** - Same as app icon, used during launch
3. **empty-sessions.png** - Illustration: Empty trophy case with motivational text. WHERE USED: Home screen when no sessions completed
4. **empty-crm.png** - Illustration: Open empty notebook with pen. WHERE USED: CRM tab when no clients saved
5. **session-success.png** - Illustration: Trophy or handshake. WHERE USED: Session summary modal
6. **joe-avatar.png** - Professional headshot-style avatar for "Joe's feedback" cards. WHERE USED: Feedback cards throughout training sessions

**User Avatars** (3 preset options):
7. **avatar-professional-1.png** - Business professional silhouette (blue)
8. **avatar-professional-2.png** - Business professional silhouette (gold)
9. **avatar-professional-3.png** - Business professional silhouette (charcoal)

**Style Note**: All illustrations should be clean, professional line art with Navy/Gold accent colors. Avoid cartoonish style—lean toward sophisticated business aesthetic.