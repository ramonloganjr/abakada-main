import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getInstallBuckets, platformLabel, formatPlatformList } from '../../src/lib/install.js'
import { toolkitForRole, ROLE_TO_TOOLKIT } from '../../src/lib/onboarding.js'
import { isSafeUrl } from '../../src/lib/url.js'

test('platformLabel maps known codes and capitalizes unknown ones', () => {
  assert.equal(platformLabel('macos'), 'macOS')
  assert.equal(platformLabel('windows'), 'Windows')
  assert.equal(platformLabel('self-hosted'), 'Self-hosted')
  assert.equal(platformLabel('frobnicator'), 'Frobnicator')
  assert.equal(platformLabel(''), '')
})

test('getInstallBuckets groups desktop OS platforms into one bucket', () => {
  const buckets = getInstallBuckets({ platforms: ['windows', 'macos', 'linux'] })
  assert.equal(buckets.length, 1)
  assert.equal(buckets[0].id, 'desktop')
  assert.deepEqual(buckets[0].platforms, ['windows', 'macos', 'linux'])
})

test('getInstallBuckets is ordered easiest-first (web before desktop)', () => {
  const buckets = getInstallBuckets({ platforms: ['windows', 'web'] })
  assert.deepEqual(buckets.map((b) => b.id), ['web', 'desktop'])
})

test('getInstallBuckets separates runtime and server platforms', () => {
  const buckets = getInstallBuckets({ platforms: ['python', 'self-hosted'] })
  assert.deepEqual(buckets.map((b) => b.id), ['runtime', 'server'])
})

test('getInstallBuckets falls back to a single generic bucket', () => {
  assert.deepEqual(getInstallBuckets({ platforms: ['specification'] }), [{ id: 'generic', platforms: [] }])
  assert.deepEqual(getInstallBuckets({}), [{ id: 'generic', platforms: [] }])
  assert.deepEqual(getInstallBuckets(null), [{ id: 'generic', platforms: [] }])
})

test('formatPlatformList renders a readable, labeled list', () => {
  assert.equal(formatPlatformList(['windows', 'macos']), 'Windows, macOS')
  assert.equal(formatPlatformList([]), '')
})

test('every onboarding role resolves to a toolkit, unknown roles resolve to null', () => {
  for (const role of Object.keys(ROLE_TO_TOOLKIT)) {
    assert.equal(typeof toolkitForRole(role), 'string')
  }
  assert.equal(toolkitForRole('nonexistent'), null)
})

test('isSafeUrl accepts http(s) and rejects unsafe or malformed values', () => {
  assert.equal(isSafeUrl('https://example.org'), true)
  assert.equal(isSafeUrl('http://example.org'), true)
  assert.equal(isSafeUrl('javascript:alert(1)'), false)
  assert.equal(isSafeUrl('ftp://example.org'), false)
  assert.equal(isSafeUrl(''), false)
  assert.equal(isSafeUrl(null), false)
  assert.equal(isSafeUrl('not a url'), false)
})
