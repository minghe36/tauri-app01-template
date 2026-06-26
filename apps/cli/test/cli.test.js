import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))
const cliEntry = resolve(currentDir, '../src/cli.js')

function runCli(args) {
  return spawnSync(process.execPath, [cliEntry, ...args], {
    encoding: 'utf8',
  })
}

test('prints help output with --help', () => {
  const result = runCli(['--help'])

  assert.equal(result.status, 0)
  assert.match(result.stdout, /Usage:/)
  assert.match(result.stdout, /--help/)
  assert.match(result.stdout, /--version/)
})

test('prints version output with --version', () => {
  const result = runCli(['--version'])

  assert.equal(result.status, 0)
  assert.match(result.stdout, /^app01-tpl 0\.1\.0/m)
})

test('prints help output with no arguments', () => {
  const result = runCli([])

  assert.equal(result.status, 0)
  assert.match(result.stdout, /app01-tpl CLI/)
})

test('returns an error for unknown options', () => {
  const result = runCli(['--unknown'])

  assert.equal(result.status, 1)
  assert.match(result.stderr, /Unknown option: --unknown/)
})
