import * as R from 'ramda';

export const locType = [
  //'warehouse',
  // 'point_of_sale',
  //  'hospital',
  // 'charity_points',
  'send',
  'receive',
];

export const groupByLocType = R.groupBy((data: any): string => {
  const type = data.type;
  for (const d of locType) {
    if (d === type) return d;
  }
  return 'not_found';
}) as any;
