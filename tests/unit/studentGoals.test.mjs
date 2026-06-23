import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { STUDENT_GOALS, toolsForGoal } from '../../src/lib/studentGoals.js'

test('STUDENT_GOALS is non-empty and every goal carries tool IDs', () => {
  assert.ok(STUDENT_GOALS.length >= 6)
  for (const g of STUDENT_GOALS) {
    assert.ok(g.id && g.icon && g.coll)
    assert.ok(Array.isArray(g.toolIds) && g.toolIds.length > 0, `goal ${g.id} has no toolIds`)
  }
})

test('goal IDs are unique', () => {
  const ids = STUDENT_GOALS.map((g) => g.id)
  assert.equal(new Set(ids).size, ids.length)
})

test('toolsForGoal resolves curated IDs in order and ignores unknown goals', () => {
  const tools = [
    { id: 'libreoffice' }, { id: 'onlyoffice' }, { id: 'zotero' }, { id: 'obsidian' },
  ]
  assert.deepEqual(toolsForGoal(tools, 'write').map((t) => t.id), ['libreoffice', 'onlyoffice', 'zotero', 'obsidian'])
  assert.deepEqual(toolsForGoal(tools, 'nonexistent'), [])
  assert.deepEqual(toolsForGoal(null, 'write'), [])
})

test('toolsForGoal drops IDs not present in the data', () => {
  const tools = [{ id: 'libreoffice' }] // missing onlyoffice/zotero/obsidian
  assert.deepEqual(toolsForGoal(tools, 'write').map((t) => t.id), ['libreoffice'])
})

// Data-integrity guard: every curated goal tool ID must exist in tools.json, so a
// goal never renders short/empty. Fails the build if a future data edit removes one.
test('every goal tool ID exists in tools.json', () => {
  const data = JSON.parse(readFileSync(new URL('../../public/assets/data/tools.json', import.meta.url)))
  const ids = new Set(data.tools.map((t) => t.id))
  const missing = []
  for (const g of STUDENT_GOALS) {
    for (const id of g.toolIds) if (!ids.has(id)) missing.push(`${g.id}:${id}`)
  }
  assert.deepEqual(missing, [], `missing tool IDs: ${missing.join(', ')}`)
})
