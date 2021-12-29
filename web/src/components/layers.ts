import { LayerProps } from '@goongmaps/goong-map-react';


export const clusterLayer = {
  id: 'clusters',
  type: 'circle',
  source: 'FeatureCollection',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
  }
};

export const getColor = (type: string): string => {
  let color: string;
  switch (type) {
    case 'send': {
      color = '#96ceb4'
      break;
    }
    case 'receive': {
      color = '#FF6F69'
      break;
    }
    case 'charity_points': {
      color = '#f5f512'
      break;
    }
    default:
      color = '#f44336'
      break;
  }
  return color;
}

export const getClusterLayerByType = (type: string): LayerProps => {
  const color = getColor(type)
  return {
    id: `cluster-${type}`,
    type: 'circle',
    source: type,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': ['step', ['get', 'point_count'], color, 100, color, 750, color],
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
    }
  }
}

export const getClusterCountLayerByType = (type: string): LayerProps => {
  return {
    id: `cluster-count-${type}`,
    type: 'symbol',
    source: type,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Roboto Regular'],
      'text-size': 12
    },
    paint: {
    }
  }
}

export const getUnclusterPointLayer = (type: string): LayerProps => {
  const color = getColor(type)
  return {
    id: `unclustered-point-${type}`,
    type: 'circle',
    source: type,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': color,
      'circle-radius': 9,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  }
}

