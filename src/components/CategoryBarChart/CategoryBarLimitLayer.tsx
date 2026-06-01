import { StyleSheet, View } from 'react-native';

export type CategoryBarLimitPalette = {
  guideBackground: string;
  guideBorder: string;
  guideStripe: string;
  overLimitBackground: string;
};

type CategoryBarLimitLayerProps = {
  limitPercent: number | null;
  baseBarHeightPercent: number;
  overLimitPercent: number;
  barRadius: number;
  palette: CategoryBarLimitPalette;
};

const LIMIT_STRIPE_COUNT = 22;
const LIMIT_STRIPE_STEP = 12;
const STACK_JOIN_OVERLAP = -4;

export function CategoryBarLimitLayer({
  limitPercent,
  baseBarHeightPercent,
  overLimitPercent,
  barRadius,
  palette,
}: CategoryBarLimitLayerProps) {
  const hasLimit = limitPercent !== null && limitPercent > 0;

  if (!hasLimit) {
    return null;
  }

  return (
    <>
      <View
        style={[
          styles.limitGuideZone,
          {
            bottom: 0,
            height: `${limitPercent}%`,
            borderRadius: barRadius,
            backgroundColor: palette.guideBackground,
            borderColor: palette.guideBorder,
          },
        ]}
      >
        <View style={styles.limitGuideStripesLayer}>
          {Array.from({ length: LIMIT_STRIPE_COUNT }, (_, index) => (
            <View
              key={`limit-stripe-${index}`}
              style={[
                styles.limitGuideStripe,
                {
                  left: index * LIMIT_STRIPE_STEP,
                  backgroundColor: palette.guideStripe,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {overLimitPercent > 0 ? (
        <View
          style={[
            styles.overLimitStack,
            {
              bottom: `${baseBarHeightPercent}%`,
              height: `${overLimitPercent}%`,
              borderTopLeftRadius: barRadius,
              borderTopRightRadius: barRadius,
              backgroundColor: palette.overLimitBackground,
            },
          ]}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  overLimitStack: {
    position: 'absolute',
    left: 0,
    right: 0,
    marginBottom: STACK_JOIN_OVERLAP,
    overflow: 'hidden',
    zIndex: 2,
  },
  limitGuideZone: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderWidth: 1,
    zIndex: 1,
  },
  limitGuideStripesLayer: {
    position: 'absolute',
    top: -64,
    bottom: -64,
    left: -76,
    right: -76,
    transform: [{ rotate: '30deg' }],
  },
  limitGuideStripe: {
    position: 'absolute',
    top: -120,
    bottom: -120,
    width: 2,
  },
});
