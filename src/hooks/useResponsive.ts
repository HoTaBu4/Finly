import { useWindowDimensions } from 'react-native';
import { TABLET_BREAKPOINT, TABLET_SCALE } from '../constants/layout';

/**
 * Returns a scale multiplier for tablet-responsive sizing.
 * On phones returns 1 (no change), on tablets returns TABLET_SCALE.
 * Use: `fontSize: sp(14)` or `height: sp(300)`
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const shortSide = Math.min(width, height);
  const isTablet = shortSide >= TABLET_BREAKPOINT;
  const scale = isTablet ? TABLET_SCALE : 1;

  /** Scale a value for tablet. Rounds to avoid sub-pixel issues. */
  function sp(value: number): number {
    return Math.round(value * scale);
  }

  return { isTablet, scale, sp };
}
