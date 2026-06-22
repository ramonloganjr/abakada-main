#!/usr/bin/env node
// JSON Schema validation for the hand-maintained data files. Run in CI and as a
// prebuild-adjacent gate (`npm run validate:data`) so a malformed tool / toolkit /
// curriculum record fails fast instead of shipping a broken page.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import Ajv from 'ajv'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => JSON.parse(readFileSync(resolve(ROOT, p), 'utf8'))
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true })

const toolsSchema = {
  type: 'object',
  required: ['tools'],
  properties: {
    tools: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['id', 'name', 'category'],
        properties: {
          id: { type: 'string', minLength: 1 },
          name: { type: 'string', minLength: 1 },
          category: { type: 'string', minLength: 1 },
          tagline: { type: 'string' },
          description: { type: 'string' },
          website: { type: 'string' },
          license: { type: 'string' },
          platforms: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } },
          alternatives_to: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: true,
      },
    },
  },
  additionalProperties: true,
}

const learningSchema = {
  type: 'object',
  required: ['toolkits'],
  properties: {
    toolkits: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['id', 'title', 'stages'],
        properties: {
          id: { type: 'string', minLength: 1 },
          title: { type: 'string', minLength: 1 },
          stages: { type: 'array', minItems: 1 },
          curriculum: { type: 'array', items: { type: 'string' } },
          audiences: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: true,
      },
    },
  },
  additionalProperties: true,
}

const curriculumSchema = {
  type: 'object',
  required: ['strands'],
  properties: {
    strands: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['id', 'category', 'label'],
        properties: {
          id: { type: 'string', minLength: 1 },
          category: { type: 'string', minLength: 1 },
          label: { type: 'string', minLength: 1 },
        },
        additionalProperties: true,
      },
    },
  },
  additionalProperties: true,
}

let failed = false
function check(name, schema, data) {
  if (ajv.validate(schema, data)) {
    console.log(`✔ ${name} valid`)
    return true
  }
  failed = true
  console.error(`✖ ${name} failed schema validation:`)
  for (const e of (ajv.errors || []).slice(0, 20)) console.error(`    ${e.instancePath || '(root)'} ${e.message}`)
  return false
}

const tools = read('public/assets/data/tools.json')
const learning = read('public/assets/data/learning-paths.json')
const curriculum = read('public/assets/data/curriculum.json')

check('tools.json', toolsSchema, tools)
check('learning-paths.json', learningSchema, learning)
check('curriculum.json', curriculumSchema, curriculum)

// Integrity: unique tool IDs
const ids = tools.tools.map((t) => t.id)
const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))]
if (dupes.length) { failed = true; console.error(`✖ duplicate tool IDs: ${dupes.join(', ')}`) }
else console.log(`✔ ${ids.length} unique tool IDs`)

// Referential integrity: every toolkit curriculum strand must exist
const strandIds = new Set(curriculum.strands.map((s) => s.id))
for (const tk of learning.toolkits) {
  for (const c of tk.curriculum || []) {
    if (!strandIds.has(c)) { failed = true; console.error(`✖ toolkit "${tk.id}" references unknown strand "${c}"`) }
  }
}
if (!failed) console.log('✔ curriculum references resolve')

if (failed) { console.error('\nData validation FAILED'); process.exit(1) }
console.log('\nAll data valid.')
