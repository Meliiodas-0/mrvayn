

## Update Antarya Project Link

### Overview
Update the first featured project "Antarya" to redirect to the Magadha Studios website when clicked.

### Current Issue
The Antarya project link is currently set to `'#'` (a placeholder), which prevents the card from navigating anywhere when clicked.

### Implementation

**File to modify:** `src/components/sections/ProjectsSection.tsx`

**Change:** Update line 32 from:
```typescript
link: '#',
```
to:
```typescript
link: 'https://magadhastudios.com/category',
```

### Result
After this change, clicking on the Antarya featured project card will open the Magadha Studios category page in a new tab.

