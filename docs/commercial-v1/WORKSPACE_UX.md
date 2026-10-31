# NUMPA Commercial V1 — Workspace UX Specification

## 1. Experience principles

- Familiar, focused workspace inspired by modern AI productivity applications.
- Collapsible left navigation and a flexible right-side content workspace.
- The data workflow remains the primary focus; navigation should not compete with it.
- Desktop-first for analyst workflows, fully responsive on smaller screens.
- Both light and dark themes.
- Consistency and accessibility over decorative complexity.

This is an interaction and layout reference, not permission to copy another product's branding or proprietary visual assets.

## 2. Global application shell

### Left sidebar

Expanded state:
- NUMPA brand/wordmark area.
- Collapse control.
- Primary navigation in the exact order specified in PRODUCT_REQUIREMENTS.md.
- Clear active item.
- Bottom utility area: Help & Support, account/profile and theme access if not placed in the top bar.

Collapsed state:
- Icon-only navigation.
- Accessible labels and tooltips.
- Active state remains visually obvious.
- No loss of navigation functionality.

Mobile:
- Sidebar becomes a drawer/sheet opened from a menu control.
- Selecting a destination closes the drawer.
- Main content uses the full available width.
- Do not force desktop-width tables or charts onto small screens.

### Main workspace

- Top application bar with current section title and contextual actions.
- Dataset/workspace context when a dataset is active.
- Main page content with consistent maximum width and spacing.
- Responsive content grid.
- Toast/inline feedback for completed and failed actions.
- Avoid a second competing navigation system inside the page.

## 3. Navigation order and icons

Use clear, familiar icons with text labels:

1. Data Analysis — chart/search or table icon.
2. Data Preprocessing / Cleaning — sliders or broom icon.
3. Data Visualization — chart-column icon.
4. ML Readiness — gauge icon.
5. ML Lab — flask icon.
6. Analysis History — history/clock icon.
7. Settings — settings icon.

Icons are secondary to text. Use tooltips in collapsed mode and accessible names for assistive technology.

## 4. Theme system

- Both light and dark themes are required.
- Light theme is the initial default.
- Use semantic design tokens (background, surface, text, muted text, border, primary, focus, success, warning, danger).
- Components must use tokens rather than hard-coded theme-specific colours wherever practical.
- Theme switching must not cause page reloads or reset active workflow state.
- Phase 1 preference persistence should use a safe local preference mechanism already available in the application; do not add a Supabase setting or schema migration.
- Respect system preference only if it can be implemented without overriding an explicit user choice.
- Check contrast, focus indicators, chart legibility and disabled states in both themes.

## 5. Page templates

### Data Analysis
- Dataset upload/drop zone when no active dataset exists.
- Overview cards and dataset summary when a dataset exists.
- Column/profile table and data-quality observations.
- Keep existing inspect functionality intact.

### Data Preprocessing / Cleaning
- Left/primary area: cleaning operations and recommendations.
- Main area: preview/results.
- Clear source-versus-output distinction.
- Review/approve interaction before execution.

### Data Visualization
- Chart gallery and chart canvas.
- Select columns and chart types.
- Show chart explanation and any sampling/aggregation note.
- Empty state prompts user to select a dataset.

### ML Readiness
- Score summary, score dimensions, warnings and recommendations.
- Task/target selection as supported by the current engine.
- Explain methodology and limitations.

### ML Lab
- Algorithm comparison workspace.
- Comparison table/cards, metric definitions and validation strategy.
- Only show capabilities actually supported by the backend.
- If a capability is not yet implemented, label it as planned or unavailable; do not fabricate a result.

### Analysis History
- Initially provide a clearly labelled empty/planned state unless safe history data already exists.
- Future history view will contain analysis metadata and report references, not original raw datasets by default.

### Settings
- Profile/account area backed by existing auth only.
- Appearance settings.
- Usage, privacy, support and integrations sections can be staged.
- Never make fake controls look connected or operational.

## 6. Interaction details

- Sidebar collapse/expand state must be stable and not cause content jumps.
- Active navigation must update based on the selected route or section.
- Browser back/forward navigation should remain sensible if routing is used.
- Loading states should reserve space to reduce layout shift.
- Confirm before destructive or irreversible actions.
- Keep keyboard navigation, focus order and escape-to-close behaviour correct.
- Show inline validation close to the relevant control.

## 7. Responsive breakpoints

Use the existing project's responsive conventions if they are sound. At minimum verify:
- Wide desktop: expanded sidebar and full workspace.
- Laptop: expanded or collapsed sidebar depending on available width.
- Tablet: collapsed sidebar or drawer.
- Mobile: drawer navigation, stacked cards and horizontally scrollable data tables with clear affordances.

Do not add a new UI framework or component library solely for this redesign without a clear technical reason.

## 8. Phase 1 visual scope

Phase 1 implements the shared shell, navigation, responsive behaviour, theme tokens and existing Data Analysis workflow inside the new shell. Other navigation destinations may use honest, polished coming-soon states until their dedicated implementation phase. Do not create fake backend functionality.
