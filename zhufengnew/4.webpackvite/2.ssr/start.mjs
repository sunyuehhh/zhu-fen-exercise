// start.mjs
import { register } from 'ts-node/esm'
import { pathToFileURL } from 'url'

register('ts-node/esm', pathToFileURL('./'))

import('./ssr-entry.ts')
