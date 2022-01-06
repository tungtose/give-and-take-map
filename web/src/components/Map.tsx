import React, { useState, useEffect, useRef, useMemo } from 'react';
import ActionLayout from './ActionLayout';
import ReactMapGL, {
  Source,
  Layer,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
} from '@goongmaps/goong-map-react';
import { MAP_API_KEY } from '../constants';
import {
  getClusterLayerByType,
  getUnclusterPointLayer,
  getClusterCountLayerByType
} from './layers';
import useLocs from '../hooks/useLocs';
import { locType } from '../helpers/utils';
import PostDetail from './Post';
import { Box } from '@chakra-ui/react';

const geolocateStyle = {
  bottom: 150,
  right: 0,
  padding: '10px'
};


const navStyle = {
  bottom: 56,
  right: 0,
  padding: '10px'
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: '10px'
};

function Map() {
  const [viewport, setViewport] = useState({
    latitude: 14.0583,
    longitude: 108.2772,
    zoom: 5,
    bearing: 0,
    pitch: 0,
    transitionDuration: 500,
  });

  const mapRef = useRef<any>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const { status, data, error, isFetching } = useLocs();
  const [oneLoc, setOneLoc] = useState<any>(null);

  const locByType = !!oneLoc ? oneLoc : data;



  const onClick = (event: any) => {
    const feature = event.features[0];
    const clusterId = feature.properties.cluster_id;
    const source = feature.source;

    if (feature.layer.id.startsWith("cluster")) {
      const mapboxSource = mapRef.current?.getMap().getSource(source);
      if (!mapboxSource) return;

      mapboxSource.getClusterExpansionZoom(
        clusterId,
        (err: any, zoom: number) => {
          if (err) {
            return;
          }

          const [long, lat] = feature.geometry.coordinates;
          const newZoom = zoom + 2;

          setViewport({
            ...viewport,
            longitude: long,
            latitude: lat,
            zoom: newZoom,
            transitionDuration: 400,
          });
        }
      );
      return;
    };

    const postId = feature?.properties?.postId;
    if (postId) {
      setPostId(postId)
    }
  };


  const interactiveLayerIds = useMemo(() => {
    const defaultIds = [...locType.map(type => `cluster-${type}`), ...locType.map(type => `unclustered-point-${type}`)];
    return !!oneLoc ?
      [`unclustered-point-${Object.keys(oneLoc)[0]}`] : defaultIds;
  }, [oneLoc])

  if (isFetching) return <Box> Loading.... </Box>
  return (
    <Box w="full" h="100%">
      <ActionLayout setOneLoc={setOneLoc} oneLoc={oneLoc} />
      <ReactMapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle="https://tiles.goong.io/assets/goong_map_dark.json"
        onViewportChange={setViewport}
        ref={mapRef}
        onClick={onClick}
        interactiveLayerIds={interactiveLayerIds}
        goongApiAccessToken={MAP_API_KEY}>
        {
          locType.map(type => {
            if (!locByType[type]) return null;
            const geoData = {
              type: "FeatureCollection",
              features: locByType[type]?.map((d: any) =>
                ({ type: 'Feature', geometry: d.loc, properties: { postId: d._id } })) as any
            } as any

            const clusterLayer = getClusterLayerByType(type)
            const clusterCountLayer = getClusterCountLayerByType(type)
            const pointLayer = getUnclusterPointLayer(type)

            return (
              <Source
                key={type}
                id={type}
                type="geojson"
                data={geoData}
                cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}
              >
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...pointLayer} />
              </Source>
            )
          })
        }
        <GeolocateControl style={geolocateStyle} />
        <NavigationControl style={navStyle} />
        <ScaleControl style={scaleControlStyle} />
      </ReactMapGL>
      {postId && <PostDetail postId={postId} setPostId={setPostId} />}
    </Box>
  );
}

export default Map;
