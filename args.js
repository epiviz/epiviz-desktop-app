'use strict'

const { basename } = require('path')
const pkg = require('./package')
const exe = basename(process.argv[0])

module.exports = require('yargs')
  .usage(`Usage: ${exe} [options]`)
  .strict()
  .wrap(78)
  .env(pkg.name.toUpperCase())

  .demand(0, 1)

  .option('port', {
    alias: 'p',
    type: 'number',
    describe: 'Set websocket port location'
  })

.option('workspace', {
    alias: 'p',
    type: 'string',
    describe: 'Load workspace'
  })
  
  .help('help')
  .version(pkg.version)

  .epilogue([
    'Environment Variables:',
    '  NODE_ENV  Set default environment'
  ].join('\n'))