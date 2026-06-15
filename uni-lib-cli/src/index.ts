#!/usr/bin/env node

import { assertNodeVersion } from './utils/check-node.js'

assertNodeVersion()

const { startCli } = await import('./cli.js')
startCli()
