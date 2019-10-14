import { Injectable } from '@angular/core';
import { Vector as VectorSource, ImageWMS } from 'ol/source';
import ImageLayer from 'ol/layer/Image.js';
import VectorLayer from 'ol/layer/Vector';
import { Stroke, Style, Fill, Text } from 'ol/style.js';
import { GeoJSON } from 'ol/format';

declare let Object;

export interface LayerOptions {
  url: string;
  params?: any;
  serverType?: any;
}
const RASTER_DEFAULT_OPTIONS = {
  serverType: 'mapserver'
};
const LAYER_DEFAULT_OPTIONS = {
  serverType: 'mapserver',
  format: new GeoJSON()
};

export function createVectorLayer(options: LayerOptions) {
  const _options = Object.assign({}, LAYER_DEFAULT_OPTIONS, options);
  const vectorSource = new VectorSource(_options);
  // the vector layer uses the source
  return new VectorLayer({
    source: vectorSource
  });
}

export function createRasterLayer(options: LayerOptions) {
  // the raster source from mapserver
  const _options = Object.assign({}, RASTER_DEFAULT_OPTIONS, options);
  const rasterSource = new ImageWMS(_options);
  // the raster layer uses the source
  return new ImageLayer({
    source: rasterSource
  });
}
