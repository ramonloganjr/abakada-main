// Curriculum helpers shared by the Educators page (and reusable elsewhere).
//
// curriculum.json defines DepEd K-12 Senior High School strands and CHED programs;
// each learning-path toolkit carries a `curriculum` array of strand IDs it aligns
// to. These pure helpers turn that relationship into the data the Educators
// "find tools for your strand" browser renders. Kept free of React/DOM so they
// are trivially unit-testable.

// DepEd K-12 strands only, preserving curriculum.json display order.
export function k12Strands(curriculum) {
  const strands = curriculum?.strands || []
  return strands.filter((s) => s.category === 'k12')
}

// Look up a single strand record by id.
export function findStrand(curriculum, strandId) {
  return (curriculum?.strands || []).find((s) => s.id === strandId) || null
}

// Learning-path toolkits whose curriculum alignment includes the given strand id,
// preserving the toolkits' original order.
export function pathsForStrand(toolkits, strandId) {
  if (!strandId) return []
  return (toolkits || []).filter(
    (tk) => Array.isArray(tk.curriculum) && tk.curriculum.includes(strandId),
  )
}
