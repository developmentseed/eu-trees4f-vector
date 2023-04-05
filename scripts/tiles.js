#!/usr/bin/env node
import fs from 'fs'
import {
  SPECIES,
  GRIDS,
  // SPECIES_WHITELIST,
} from './constants.js'
import { execSync } from 'child_process'

const speciesList = JSON.parse(fs.readFileSync(SPECIES, 'utf-8'))

const TYPES = ['points', 'hex']

speciesList.forEach((species) => {
  // if (!SPECIES_WHITELIST.includes(species)) return
  const pbfPaths = {
    'points': `./data/points/tiles/${species}`,
    'hex': `./data/hex/tiles/${species}`,
  }
  execSync(`rm -rf ${pbfPaths.points}/* || true`)
  execSync(`rm -rf ${pbfPaths.points} || true`)
  execSync(`rm -rf ${pbfPaths.hex}/* || true`)
  execSync(`rm -rf ${pbfPaths.hex} || true`)

  TYPES.forEach((type) => {
    console.log(pbfPaths[type])
    execSync(`mkdir ${pbfPaths[type]}`)
    GRIDS.forEach((grid) => {
      const appendedType = type === 'hex' ? '_hex' : '';
      execSync(
        `tippecanoe --force --no-tile-size-limit --no-feature-limit --base-zoom=${grid.minZoom} --minimum-zoom=${grid.minZoom} --maximum-zoom=${grid.maxZoom} --output-to-directory ${pbfPaths[type]}/${grid.res} ./data/${type}/geojson/${species}_${grid.res}${appendedType}.geojson`
      )
    })
  })
  // GRIDS.forEach((grid) => {
  //   execSync(`mv ${pbfPath}/${grid.res}/* ${pbfPath}`)
  //   execSync(`rm -rf ${pbfPath}/${grid.res}`)
  // })
})
