// responsive.ts
import {Dimensions, PixelRatio} from 'react-native';

// Get current device screen size
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Base screen size (iPhone 11 / XR => 414 x 896)
const BASE_WIDTH = 414;
const BASE_HEIGHT = 896;

// Scale values based on width
export const width = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

// Scale values based on height
export const height = (size: number) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;

// Scale font size
export const font = (size: number) => {
  const newSize = width(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export {SCREEN_WIDTH, SCREEN_HEIGHT};
