#!/usr/bin/env node

import mapshaper from 'mapshaper';

mapshaper.runCommands('-i data/extents/geojson/*.geojson -o data/extents/topojson/ format=topojson');

