// Task-based entry points for the Students page.
//
// Students think in terms of what they need to *do* ("write a report", "edit a
// video") rather than curriculum strands, so the Students page leads with goals.
// Each goal maps to a curated set of verified tool IDs from tools.json. Kept pure
// (no React/DOM) so the mapping is unit-testable and the page can resolve it
// against live data, silently skipping any ID that is missing.
export const STUDENT_GOALS = [
  { id: 'write', icon: 'file-text', coll: 'category', toolIds: ['libreoffice', 'onlyoffice', 'zotero', 'obsidian'] },
  { id: 'present', icon: 'presentation', coll: 'ui', toolIds: ['libreoffice', 'onlyoffice', 'drawio'] },
  { id: 'notes', icon: 'book-open-text', coll: 'category', toolIds: ['anki', 'obsidian', 'joplin', 'xournalpp'] },
  { id: 'photos', icon: 'palette', coll: 'category', toolIds: ['gimp', 'krita', 'inkscape', 'darktable'] },
  { id: 'media', icon: 'clapperboard', coll: 'category', toolIds: ['shotcut', 'kdenlive', 'audacity', 'obs-studio'] },
  { id: 'code', icon: 'code', coll: 'ui', toolIds: ['scratch', 'thonny', 'vscode', 'godot'] },
  { id: 'science', icon: 'flask-round', coll: 'ui', toolIds: ['geogebra', 'stellarium', 'freecad'] },
  { id: 'safe', icon: 'shield-check', coll: 'category', toolIds: ['firefox', 'bitwarden', 'signal'] },
]

// Resolve a goal's curated tool IDs against live tools data, preserving order and
// dropping any that aren't present.
export function toolsForGoal(tools, goalId) {
  const goal = STUDENT_GOALS.find((g) => g.id === goalId)
  if (!goal) return []
  const byId = new Map((tools || []).map((t) => [t.id, t]))
  return goal.toolIds.map((id) => byId.get(id)).filter(Boolean)
}
