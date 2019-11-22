import { Injectable } from '@angular/core';
import { Vector as VectorSource, ImageWMS, TileWMS } from 'ol/source';
import { Image as ImageLayer, Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Stroke, Style, Fill, Text } from 'ol/style.js';
import { GeoJSON } from 'ol/format';

export interface LayerOptions {
  url: string;
  params?: any;
  serverType?: any;
}
const WMS_DEFAULT_OPTIONS = {
  serverType: 'mapserver'
};
const WFS_DEFAULT_OPTIONS = {
  serverType: 'mapserver',
  format: new GeoJSON()
};

export function createVectorLayer(options: LayerOptions) {
  const _options = {...WFS_DEFAULT_OPTIONS, ...options};
  const vectorSource = new VectorSource(_options);
  // the vector layer uses the source
  return new VectorLayer({
    source: vectorSource
  });
}

export function createTileLayer(options: LayerOptions) {
  // the raster source
  const _options = { ...WMS_DEFAULT_OPTIONS, ...options };
  const tileSource = new TileWMS(_options);
  this.pickupLayer = new TileLayer({
    source: tileSource,
    preload: Infinity
  });
}

export function createRasterLayer(options: LayerOptions) {
  // the raster source
  const _options = { ...WMS_DEFAULT_OPTIONS, ...options };
  const rasterSource = new ImageWMS(_options);
  // the raster layer uses the source
  return new ImageLayer({
    source: rasterSource
  });
}

export function paramsToQuery(params: any) {
  return Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
}
