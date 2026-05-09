/**
 * Comparison Engine
 * Req 7.1–7.3, 8.1–8.5, 10.1
 */

// 9.2 — Configurable tag-to-tier mapping (Req 8.3)
export const TAG_TO_TIER = {
  'beginner': 'Beginner',
  'easy': 'Beginner',
  'simple': 'Beginner',
  'intermediate': 'Intermediate',
  'advanced': 'Advanced',
  'professional': 'Advanced',
  'expert': 'Advanced',
  // default: 'Intermediate' when no match
};

/**
 * Derive offline capability from a tool (Req 8.2)
 * @param {Object} tool
 * @returns {boolean}
 */
function deriveOfflineCapable(tool) {
  const platforms = tool.platforms || [];
  const tags = tool.tags || [];
  return platforms.includes('self-hosted') || tags.includes('offline');
}

/**
 * Derive ease-of-use tier from a tool's first tag (Req 8.3)
 * @param {Object} tool
 * @returns {string}
 */
function deriveEaseOfUse(tool) {
  const tags = tool.tags || [];
  const firstTag = (tags[0] || '').toLowerCase();
  return TAG_TO_TIER[firstTag] || 'Intermediate';
}

/**
 * Derive license classification (Req 8.4)
 * @param {Object} tool
 * @returns {string}
 */
function deriveLicense(tool) {
  if (tool.is_foss === true) return 'Open Source';
  return tool.license || 'Freeware';
}

/**
 * Build a Comparison_Matrix from an array of tool IDs and the full tools list.
 * Accepts 2–4 tool IDs (Req 7.1).
 * Marks highlight flags per dimension (Req 10.1).
 * All tools share identical dimension keys (Req 8.5).
 *
 * @param {string[]} toolIds - 2 to 4 tool IDs
 * @param {Object[]} allTools - full tools array from tools.json
 * @returns {Object} Comparison_Matrix
 */
export function buildMatrix(toolIds, allTools) {
  // Resolve tool objects
  const tools = toolIds.map(id => allTools.find(t => t.id === id)).filter(Boolean);

  // Pre-derive values for each tool
  const derived = tools.map(tool => ({
    id: tool.id,
    name: tool.name,
    category: tool.category,
    platforms: tool.platforms || [],
    offlineCapable: deriveOfflineCapable(tool),
    easeOfUse: deriveEaseOfUse(tool),
    features: tool.tags || [],
    license: deriveLicense(tool),
    useCases: tool.alternatives_to || [],
  }));

  // Highlight logic (Req 10.1)
  // offlineCapable: highlight true values
  // easeOfUse: highlight 'Beginner'
  // features: highlight tool with most tags
  // platforms: highlight tool with most platforms
  // license: highlight 'Open Source'
  // name / category / useCases: no highlight

  const maxFeatureCount = Math.max(...derived.map(d => d.features.length));
  const maxPlatformCount = Math.max(...derived.map(d => d.platforms.length));

  function buildValues(key, getValue, shouldHighlight) {
    const values = {};
    derived.forEach(d => {
      values[d.id] = {
        value: getValue(d),
        highlight: shouldHighlight(d, derived),
      };
    });
    return values;
  }

  const dimensions = [
    {
      key: 'name',
      label: 'Name',
      values: buildValues('name', d => d.name, () => false),
    },
    {
      key: 'category',
      label: 'Category',
      values: buildValues('category', d => d.category, () => false),
    },
    {
      key: 'platforms',
      label: 'Platforms',
      values: buildValues(
        'platforms',
        d => d.platforms,
        d => d.platforms.length === maxPlatformCount && maxPlatformCount > 0,
      ),
    },
    {
      key: 'offlineCapable',
      label: 'Offline Capable',
      values: buildValues(
        'offlineCapable',
        d => d.offlineCapable,
        d => d.offlineCapable === true,
      ),
    },
    {
      key: 'easeOfUse',
      label: 'Ease of Use',
      values: buildValues(
        'easeOfUse',
        d => d.easeOfUse,
        d => d.easeOfUse === 'Beginner',
      ),
    },
    {
      key: 'features',
      label: 'Features',
      values: buildValues(
        'features',
        d => d.features,
        d => d.features.length === maxFeatureCount && maxFeatureCount > 0,
      ),
    },
    {
      key: 'license',
      label: 'License',
      values: buildValues(
        'license',
        d => d.license,
        d => d.license === 'Open Source',
      ),
    },
    {
      key: 'useCases',
      label: 'Use Cases',
      values: buildValues('useCases', d => d.useCases, () => false),
    },
  ];

  return { tools, dimensions };
}

/**
 * Add a tool ID to the comparison selection (Req 7.1, 7.2).
 * @param {string[]} ids - current selection
 * @param {string} newId - tool ID to add
 * @returns {{ ids: string[], error: string|null, message?: string }}
 */
export function addToComparison(ids, newId) {
  if (ids.length >= 3) {
    return { ids, error: 'max_reached', message: 'Maximum 3 tools can be compared' };
  }
  if (ids.includes(newId)) {
    return { ids, error: null };
  }
  return { ids: [...ids, newId], error: null };
}

/**
 * Remove a tool ID from the comparison selection (Req 7.3).
 * @param {string[]} ids - current selection
 * @param {string} removeId - tool ID to remove
 * @returns {{ ids: string[], error: null }}
 */
export function removeFromComparison(ids, removeId) {
  return { ids: ids.filter(id => id !== removeId), error: null };
}
