// @ts-check
// Placeholder interpolation for translated strings.
//
// Several translation values carry `{name}`-style placeholders the caller fills at
// render time — the `install.*` steps interpolate {name} and {platforms}, and
// `hero.definition` interpolates {count} so the catalog size in that sentence
// tracks the data instead of being retyped in four language files every time a
// tool is added. Unknown placeholders are left untouched so a typo shows up as a
// literal `{foo}` in the UI rather than silently rendering "undefined".
/** @param {string} str @param {Record<string, string | number>} vars @returns {string} */
export function fillTemplate(str, vars) {
  return String(str).replace(/\{(\w+)\}/g, (match, key) => (vars[key] != null ? String(vars[key]) : match))
}
