import { useWindowDimensions } from 'react-native';
import { TABLET_BREAKPOINT } from '../constants/layout';

/**
 * Returns true when the shortest screen dimension exceeds the tablet threshold.
 * Works correctly regardless of orientation.
 */
export function useIsTablet(): boolean {
  const { width, height } = useWindowDimensions();
  const shortSide = Math.min(width, height);
  return shortSide >= TABLET_BREAKPOINT;
}
