import React, { useState, useEffect, useRef } from 'react';
import ActionLayout from './ActionLayout';
import ReactMapGL, { Source, Layer, SourceProps, LayerProps } from '@goongmaps/goong-map-react';
import { features } from '../.data/loc';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from './layers'

const MAP_API_KEY = 'Yr2zjV2URT3LSo0IXQUMOpwSC7X4yuu7H9NHQbeC'

console.log(features)

const geojson = {
  type: 'FeatureCollection',
  features,
} as any;

const layerStyle = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf'
  }
} as LayerProps;


function Map() {
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: 14.0583,
    longitude: 108.2772,
    zoom: 5,
    bearing: 0,
    pitch: 0,
    transitionDuration: 500
  });

  const mapRef = useRef<any>(null);

  const onClick = (event: any) => {
    const feature = event.features[0];
    const clusterId = feature.properties.cluster_id;

    const mapboxSource = mapRef.current?.getMap().getSource('my-data');
    console.log(mapboxSource)
    if (!mapboxSource) return;

    mapboxSource.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
      if (err) {
        return;
      }

      setViewport({
        ...viewport,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom,
        transitionDuration: 200
      });
    });
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ActionLayout />
      <ReactMapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle="https://tiles.goong.io/assets/goong_map_web.json"
        onViewportChange={setViewport}
        ref={mapRef}
        onClick={onClick}
        interactiveLayerIds={['clusters']}
        goongApiAccessToken={MAP_API_KEY}
      >
        <Source id="my-data" type="geojson" data={geojson} cluster={true} clusterMaxZoom={14} clusterRadius={50}>
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>

      </ReactMapGL>
    </div>
  )
}

export default Map;
