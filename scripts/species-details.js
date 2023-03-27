#!/usr/bin/env node

import {
  SPECIES,
  SPECIES_DATA,
  SPECIES_MEDIA,
  SUPPORTED_LANGUAGES
} from './constants.js'
import fs from 'fs'
const speciesList = JSON.parse(fs.readFileSync(SPECIES, 'utf-8'))

const SPECIES_META_MANUAL = {
  Abies_alba: {
    conifer: true,
  },
  "Aria_edulis": {
    "alias": "Sorbus_aria"
  },
  "Borkhausenia_intermedia": {
    "alias": "Sorbus_intermedia"
  },
  "Cormus_domestica": {
    "alias": "Sorbus_domestica"
  },
  Cupressus_sempervirens: {
    conifer: true,
  },
  Juniperus_thurifera: {
    conifer: true,
  },
  Larix_decidua: {
    conifer: true,
  },
  Picea_abies: {
    conifer: true,
  },
  Pinus_brutia: {
    conifer: true,
  },
  Pinus_cembra: {
    conifer: true,
  },
  Pinus_halepensis: {
    conifer: true,
  },
  Pinus_nigra: {
    conifer: true,
  },
  Pinus_pinaster: {
    conifer: true,
  },
  Pinus_pinea: {
    conifer: true,
  },
  Pinus_sylvestris: {
    conifer: true,
  },
  Taxus_baccata: {
    conifer: true,
  },
  "Torminalis_glaberrima": {
    "alias": "Sorbus_torminalis"
  }
}



const allSpeciesData = {}
const allSpeciesMedia = {}

speciesList.forEach((currentSpeciesId) => {
  let aliasId
  if (
    SPECIES_META_MANUAL[currentSpeciesId] &&
    SPECIES_META_MANUAL[currentSpeciesId].alias
  ) {
    aliasId = SPECIES_META_MANUAL[currentSpeciesId].alias
  }
  const id = aliasId || currentSpeciesId

  fetch(
    `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&continue=0&search=${id}`
  )
    .then((r) => r.json())
    .then((data) => {
      const mainResult = data.search[0]
      const wdId = mainResult.id
      console.log(currentSpeciesId, id)

      const summariesUrls = SUPPORTED_LANGUAGES.map(lang => `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${id}`)

      Promise.all(
        [
          `https://www.wikidata.org/wiki/Special:EntityData/${wdId}.json`,
          `https://en.wikipedia.org/api/rest_v1/page/media-list/${id}`,
          ...summariesUrls
        ].map((url) => fetch(url).then((resp) => resp.json()))
      ).then(([wd, wikiMedia, ...summaries]) => {
        allSpeciesData[currentSpeciesId] = {
          labels: Object.fromEntries(SUPPORTED_LANGUAGES.map((lang) => [lang, {}]))
        }

        allSpeciesMedia[currentSpeciesId] = wikiMedia

        const wdData = wd.entities[wdId]

        SUPPORTED_LANGUAGES.forEach((lang, langIndex) => {
          if (wdData.aliases[lang]) {
            allSpeciesData[currentSpeciesId].labels[lang].aliases =
              wdData.aliases[lang].map((a) => a.value)
          }
          allSpeciesData[currentSpeciesId].labels[lang].extract = summaries[langIndex].extract
        })

        allSpeciesData[currentSpeciesId].thumbnail = summaries[0].thumbnail
        allSpeciesData[currentSpeciesId].originalimage = summaries[0].originalimage
        // currentSpeciesDetail.media = wikiMedia.items

        if (SPECIES_META_MANUAL[currentSpeciesId]) {
          allSpeciesData[currentSpeciesId] = {
            ...allSpeciesData[currentSpeciesId],
            ...SPECIES_META_MANUAL[currentSpeciesId]
          }
        }

        const sorted = Object.entries(allSpeciesData)
        sorted.sort(([keyA], [keyB]) => {
          return keyA.localeCompare(keyB)
        })
        const sortedMedia = Object.entries(allSpeciesMedia)
        sortedMedia.sort(([keyA], [keyB]) => {
          return keyA.localeCompare(keyB)
        })

        fs.writeFileSync(
          SPECIES_DATA,
          JSON.stringify(Object.fromEntries(sorted))
        )
        fs.writeFileSync(
          SPECIES_MEDIA,
          JSON.stringify(Object.fromEntries(sortedMedia))
        )
      })
      .catch(err => console.log(err))
    })
})

