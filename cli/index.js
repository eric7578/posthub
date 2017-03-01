#!/usr/bin/env node
const yargs = require('yargs')

yargs
  .commandDir(__dirname)
  .demandCommand(1)
  .help()
  .argv
