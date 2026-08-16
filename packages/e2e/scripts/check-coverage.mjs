import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { coverageRequirements, coverageSuites } from '../coverage-manifest.mjs'

const e2eRoot = fileURLToPath(new URL('..', import.meta.url))
const uiRoot = fileURLToPath(new URL('../../ccui/ui', import.meta.url))
const publicComponents = new Set()

for (const entry of readdirSync(uiRoot, { withFileTypes: true })) {
  const indexFile = `${uiRoot}/${entry.name}/index.ts`
  if (!entry.isDirectory() || entry.name === 'locale' || !existsSync(indexFile)) continue
  const source = readFileSync(indexFile, 'utf8')
  for (const match of source.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const rawExport of match[1].split(',')) {
      const name = rawExport
        .trim()
        .split(/\s+as\s+/)
        .at(-1)
      if (/^[A-Z][A-Za-z0-9]*$/.test(name) && !/^[A-Z0-9_]+$/.test(name)) {
        publicComponents.add(name)
      }
    }
  }
  for (const match of source.matchAll(/export\s+const\s+([A-Z][A-Za-z0-9]*)\b/g)) {
    const name = match[1]
    if (!/^[A-Z0-9_]+$/.test(name)) publicComponents.add(name)
  }
}

const assigned = new Map()
const errors = []

for (const [suiteName, suite] of Object.entries(coverageSuites)) {
  for (const relativePath of [suite.spec, suite.fixture].filter(Boolean)) {
    if (!existsSync(`${e2eRoot}/${relativePath}`)) {
      errors.push(`${suiteName}: missing ${relativePath}`)
    }
  }
  if (!suite.covers.length) errors.push(`${suiteName}: covers must not be empty`)
  for (const component of suite.covers) {
    if (assigned.has(component)) {
      errors.push(`${component}: assigned to both ${assigned.get(component)} and ${suiteName}`)
    }
    assigned.set(component, suiteName)
  }
}

const compareNames = (left, right) => left.localeCompare(right)
const missing = [...publicComponents].filter((component) => !assigned.has(component)).sort(compareNames)
const unknown = [...assigned.keys()].filter((component) => !publicComponents.has(component)).sort(compareNames)
if (missing.length) errors.push(`public components without E2E coverage: ${missing.join(', ')}`)
if (unknown.length) errors.push(`unknown manifest components: ${unknown.join(', ')}`)

function collectSpecFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`
    if (entry.isDirectory()) return collectSpecFiles(path)
    return entry.name.endsWith('.spec.ts') ? [path] : []
  })
}

const scenarioCounts = new Map()
const scenarioTitles = new Set()
let totalTests = 0
const fixtureBySpec = {
  'components.spec.ts': 'src/App.vue',
  'display.spec.ts': 'src/fixtures/DisplayFixtures.vue',
  'inputs.spec.ts': 'src/fixtures/InputFixtures.vue',
  'navigation-data.spec.ts': 'src/fixtures/NavigationDataFixtures.vue',
  'overlays.spec.ts': 'src/fixtures/OverlayFixtures.vue',
}
for (const specFile of collectSpecFiles(`${e2eRoot}/tests`)) {
  const specSource = readFileSync(specFile, 'utf8')
  const specName = specFile.split('/').at(-1)
  const fixtureFile = fixtureBySpec[specName]
  const fixtureSource = fixtureFile ? readFileSync(`${e2eRoot}/${fixtureFile}`, 'utf8') : ''
  const mountedComponents = new Set()
  for (const match of fixtureSource.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]@ccui\//g)) {
    for (const rawImport of match[1].split(',')) {
      const name = rawImport
        .trim()
        .split(/\s+as\s+/)
        .at(-1)
      mountedComponents.add(name)
      mountedComponents.add(`${name.charAt(0).toUpperCase()}${name.slice(1)}`)
    }
  }
  if (/\btest(?:\.describe)?\.(?:only|skip|fixme|fail)\s*\(/.test(specSource)) {
    errors.push(`${specFile}: committed focused, skipped, fixme, or expected-failure tests are not allowed`)
  }
  if (!/from\s+['"][^'"]*support\/test['"]/.test(specSource)) {
    errors.push(`${specFile}: must import test/expect from support/test to enforce browser error checks`)
  }
  if (/waitForTimeout\s*\(/.test(specSource)) {
    errors.push(`${specFile}: waitForTimeout is not allowed; wait for an observable condition instead`)
  }
  for (const match of specSource.matchAll(/\btest\(\s*(['"`])(\[([^\]]+)](?:\\.|[^\n])*?)\1\s*,/g)) {
    totalTests++
    const title = match[2]
    if (scenarioTitles.has(title)) errors.push(`${specFile}: duplicate test title ${title}`)
    scenarioTitles.add(title)
    const taggedComponents = match[3].split(',').map((name) => name.trim())
    if (new Set(taggedComponents).size !== taggedComponents.length) {
      errors.push(`${specFile}: duplicate component tag in ${title}`)
    }
    for (const component of taggedComponents) {
      if (!publicComponents.has(component)) {
        errors.push(`${specFile}: unknown component scenario tag ${component}`)
        continue
      }
      if (fixtureFile && !mountedComponents.has(component)) {
        errors.push(`${specFile}: ${component} is tagged but not directly imported by ${fixtureFile}`)
      }
      scenarioCounts.set(component, (scenarioCounts.get(component) ?? 0) + 1)
    }
  }
}

for (const component of publicComponents) {
  const componentName = String(component)
  const minimum = Number(
    coverageRequirements.minimumScenarios[componentName] ?? coverageRequirements.defaultMinimumScenarios,
  )
  const actual = scenarioCounts.get(componentName) ?? 0
  if (actual < minimum) errors.push(`${componentName}: requires ${minimum} scenarios, found ${actual}`)
}
if (totalTests < coverageRequirements.minimumTotalTests) {
  errors.push(`requires at least ${coverageRequirements.minimumTotalTests} tagged tests, found ${totalTests}`)
}

const playwright = spawnSync(`${e2eRoot}/node_modules/.bin/playwright`, ['test', '--list'], {
  cwd: e2eRoot,
  encoding: 'utf8',
})
const listOutput = `${playwright.stdout ?? ''}\n${playwright.stderr ?? ''}`
const registeredMatch = listOutput.match(/Total:\s+(\d+)\s+tests?/)
const registeredTests = registeredMatch ? Number(registeredMatch[1]) : 0
if (playwright.status !== 0 || !registeredMatch) {
  errors.push(`unable to list registered Playwright tests: ${listOutput.trim()}`)
} else if (registeredTests < coverageRequirements.minimumTotalTests) {
  errors.push(`Playwright registers ${registeredTests} tests, requires ${coverageRequirements.minimumTotalTests}`)
}

if (errors.length) {
  console.error(`E2E coverage check failed:\n- ${errors.join('\n- ')}`)
  process.exitCode = 1
} else {
  console.log(
    `E2E coverage covers all ${publicComponents.size} public UI exports with ${totalTests} tagged scenarios and ${registeredTests} registered browser tests.`,
  )
}
