import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { k12Strands, findStrand, pathsForStrand } from '../../src/lib/curriculum.js'

const curriculum = {
  strands: [
    { id: 'STEM', category: 'k12' },
    { id: 'ABM', category: 'k12' },
    { id: 'BSCS', category: 'ched' },
  ],
}

const toolkits = [
  { id: 'a', curriculum: ['STEM', 'TVL-ICT'] },
  { id: 'b', curriculum: ['ABM'] },
  { id: 'c' }, // no curriculum array
]

test('k12Strands returns only DepEd K-12 strands, in order', () => {
  assert.deepEqual(k12Strands(curriculum).map((s) => s.id), ['STEM', 'ABM'])
  assert.deepEqual(k12Strands({}), [])
  assert.deepEqual(k12Strands(null), [])
})

test('findStrand looks up by id and degrades gracefully', () => {
  assert.equal(findStrand(curriculum, 'ABM').id, 'ABM')
  assert.equal(findStrand(curriculum, 'nope'), null)
  assert.equal(findStrand(null, 'STEM'), null)
})

test('pathsForStrand filters toolkits by curriculum membership', () => {
  assert.deepEqual(pathsForStrand(toolkits, 'STEM').map((t) => t.id), ['a'])
  assert.deepEqual(pathsForStrand(toolkits, 'ABM').map((t) => t.id), ['b'])
  assert.deepEqual(pathsForStrand(toolkits, 'HUMSS'), [])
  assert.deepEqual(pathsForStrand(toolkits, ''), [])
  assert.deepEqual(pathsForStrand(null, 'STEM'), [])
})

// Data-integrity guard: if a future curriculum/learning-path edit leaves a K-12
// strand with no aligned paths, the Educators browser would render an empty state
// for that strand. Fail the build instead.
test('every K-12 strand maps to at least one real learning path', () => {
  const realCurriculum = JSON.parse(readFileSync(new URL('../../public/assets/data/curriculum.json', import.meta.url)))
  const realLearning = JSON.parse(readFileSync(new URL('../../public/assets/data/learning-paths.json', import.meta.url)))
  for (const strand of k12Strands(realCurriculum)) {
    const paths = pathsForStrand(realLearning.toolkits, strand.id)
    assert.ok(paths.length > 0, `strand ${strand.id} has no aligned learning paths`)
  }
})
