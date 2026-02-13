

## Reverse Journey Timeline Order (Latest First)

### Overview
Flip the journey timeline to show the most recent experience first, while preserving the parallel grouping structure (e.g., Magadha Studios and Couragely stay side-by-side).

### Current Order (oldest first)
1. Esports Leadership (2019-2020)
2. Environmental Designer - Hidden Beyond (2023)
3. UE Developer - Norian Games (2023)
4. Software Developer - Glazer Games (2023-2024)
5. Co-Founder CTO - Magadha Studios (2024) + Roblox Launch - Couragely (2025) [Parallel]

### New Order (latest first)
1. Co-Founder CTO - Magadha Studios (2024) + Roblox Launch - Couragely (2025) [Parallel]
2. Software Developer - Glazer Games (2023-2024)
3. UE Developer - Norian Games (2023)
4. Environmental Designer - Hidden Beyond (2023)
5. Esports Leadership (2019-2020)

### Technical Details

**File:** `src/components/sections/JourneySection.tsx`

Reverse the `journeyItems` array order so the items are listed newest-to-oldest. The parallel grouping logic (based on `groupId`) remains untouched - only the declaration order changes.

New array order:
```typescript
const journeyItems: JourneyItem[] = [
  { year: '2024', title: 'Co-Founder | CTO', company: 'Magadha Studios...', groupId: 'parallel_build', tag: 'Parallel', ... },
  { year: '2025', title: 'Roblox Launch - Couragely', groupId: 'parallel_build', tag: 'Parallel', ... },
  { year: '2023-2024', title: 'Software Developer', company: 'Glazer Games...', ... },
  { year: '2023', title: 'Unreal Engine Developer', company: 'Norian Games...', ... },
  { year: '2023', title: 'Environmental Designer', company: 'Hidden Beyond...', ... },
  { year: '2019-2020', title: 'Esports Leadership', ... },
];
```

No changes to the grouping logic, rendering, or timeline layout. Only the array order is reversed.

