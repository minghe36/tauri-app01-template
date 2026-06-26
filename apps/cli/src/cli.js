#!/usr/bin/env node

import packageJson from '../package.json' with { type: 'json' }

const CLI_NAME = 'app01-tpl'

export function getHelpText() {
  return [
    'app01-tpl CLI',
    '',
    'Usage:',
    '  app01-tpl [options]',
    '',
    'Options:',
    '  --help       Show this help message',
    '  --version    Show the current CLI version',
  ].join('\n')
}

export function run(argv, io = {}) {
  const stdout = io.stdout ?? process.stdout
  const stderr = io.stderr ?? process.stderr
  const args = argv.slice(2)

  if (args.length === 0 || args.includes('--help')) {
    stdout.write(`${getHelpText()}\n`)
    return 0
  }

  if (args.includes('--version')) {
    stdout.write(`${CLI_NAME} ${packageJson.version}\n`)
    return 0
  }

  stderr.write(`Unknown option: ${args[0]}\n\n${getHelpText()}\n`)
  return 1
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = run(process.argv)
}
