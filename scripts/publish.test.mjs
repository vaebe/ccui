import assert from 'node:assert/strict'
import test from 'node:test'
import {
  changelogHasVersion,
  classifyRegistryLookup,
  createStagingTag,
  isAllowedReleaseHead,
} from './publish-helpers.mjs'

test('changelogHasVersion 只接受独立的目标版本标题', () => {
  assert.equal(changelogHasVersion('# Changelog\n\n## [2.1.1] - 2026-08-17\n', '2.1.1'), true)
  assert.equal(changelogHasVersion('# Changelog\n\n## 2.1.1\n', '2.1.1'), true)
  assert.equal(changelogHasVersion('# Changelog\n\n## [2.1.10]\n', '2.1.1'), false)
})

test('createStagingTag 生成版本专属且 npm 可接受的标签', () => {
  assert.equal(createStagingTag('2.1.1-beta.2'), 'release-2-1-1-beta-2')
  assert.equal(createStagingTag('2.1.1+Build.5'), 'release-2-1-1-build-5')
})

test('classifyRegistryLookup 不会把网络失败当作版本不存在', () => {
  assert.equal(classifyRegistryLookup({ status: 0 }), 'exists')
  assert.equal(classifyRegistryLookup({ status: 1, stderr: 'npm error code E404' }), 'missing')
  assert.equal(classifyRegistryLookup({ status: 1, stderr: 'getaddrinfo ENOTFOUND registry.npmjs.org' }), 'error')
})

test('isAllowedReleaseHead 仅为续发放行一个本地 release commit', () => {
  assert.equal(isAllowedReleaseHead({ head: 'a', remoteHead: 'a', parentHead: 'z', resume: false }), true)
  assert.equal(isAllowedReleaseHead({ head: 'b', remoteHead: 'a', parentHead: 'a', resume: true }), true)
  assert.equal(isAllowedReleaseHead({ head: 'c', remoteHead: 'a', parentHead: 'b', resume: true }), false)
  assert.equal(isAllowedReleaseHead({ head: 'b', remoteHead: 'a', parentHead: 'a', resume: false }), false)
})
