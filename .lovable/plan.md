

## Add "Social Media and Brand Collaborations" Section

### Overview
Create a new section that sits between Projects and Contact, maintaining full design consistency with the existing portfolio. The section will use the same cinematic AAA styling, grouped list approach from Projects, and follow the established chapter-based hierarchy.

### New File to Create
**`src/components/sections/CollaborationsSection.tsx`**

### Design Approach

**Header Structure (matching existing sections):**
- Chapter badge: "Chapter 04" (Projects is 03, Contact becomes 05)
- Title: "SOCIAL MEDIA AND BRAND" with gradient on "COLLABORATIONS"
- Badge pill: "Collaboration Hub" (using same styling as Featured/LIVE badges in Projects)
- Subtitle: Muted text below title

**Content Structure (grouped lists like Projects):**
The links will be organized into two groups with dividers:

| Group | Links |
|-------|-------|
| Instagram - Glazer / Funpunch Outreach | 4 items |
| Instagram - AceHack Hackathon Judge | 1 item |

**Card Styling:**
- Use `card-cinematic-glow` class (same as minimal project cards)
- Each item shows Instagram icon + title + external link icon
- Hover effects match existing project cards

### Section Layout

```text
+--------------------------------------------------+
|          [Chapter 04]                            |
|   SOCIAL MEDIA AND BRAND COLLABORATIONS          |
|         [Collaboration Hub badge]                |
|   Selected outreach and collaborations...        |
+--------------------------------------------------+
|                                                  |
|  -------- Glazer / Funpunch Outreach --------   |
|                                                  |
|  [Glazer Games Reel 1]    [Glazer Games Reel 2] |
|  [Funpunch India Reel]    [Instagram Post]      |
|                                                  |
|  -------- AceHack Hackathon Judge --------      |
|                                                  |
|  [AceHack Judge Reel]                           |
|                                                  |
+--------------------------------------------------+
```

### Component Structure

```tsx
// Data structure for collaboration groups
interface CollaborationItem {
  id: number;
  title: string;
  link: string;
}

interface CollaborationGroup {
  id: number;
  name: string;
  items: CollaborationItem[];
}

const collaborations: CollaborationGroup[] = [
  {
    id: 1,
    name: 'Instagram - Glazer / Funpunch Outreach',
    items: [
      { id: 1, title: 'Glazer Games Reel 1', link: '...' },
      { id: 2, title: 'Glazer Games Reel 2', link: '...' },
      { id: 3, title: 'Funpunch India Reel', link: '...' },
      { id: 4, title: 'Instagram Post', link: '...' },
    ],
  },
  {
    id: 2,
    name: 'Instagram - AceHack Hackathon Judge',
    items: [
      { id: 5, title: 'AceHack Judge Reel', link: '...' },
    ],
  },
];
```

### Styling Elements Used (all existing)
- `py-20 sm:py-32 px-4` - Section padding (matches Projects/Contact)
- `max-w-6xl mx-auto` - Container width (consistent)
- `section-chapter` - Chapter header styling
- `text-gradient` - Gradient text for emphasis
- `card-cinematic-glow` - Minimal project card style with glow
- Divider: `h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent`
- Grid: `grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4`

### Index.tsx Changes
- Import the new `CollaborationsSection` component
- Place it between `<ProjectsSection />` and `<ContactSection />`

### Chapter Numbering Update
- Projects remains Chapter 03
- Collaborations becomes Chapter 04
- Contact becomes Chapter 05 (requires updating ContactSection.tsx)

### Technical Details

**Icons to import:**
- `Instagram` from lucide-react (for all items since they're Instagram links)
- `ExternalLink` from lucide-react (for the link indicator)

**Animations:**
- Framer Motion `initial/whileInView` animations matching Projects section
- Same stagger delays: `delay: index * 0.05` for items

**FloatingPixels and ShootableSpaceships:**
- Include same decorative elements as other sections
- Define appropriate safeZones for the section

### Files Modified
1. **Create:** `src/components/sections/CollaborationsSection.tsx`
2. **Edit:** `src/pages/Index.tsx` - Add import and component
3. **Edit:** `src/components/sections/ContactSection.tsx` - Update chapter from 04 to 05

