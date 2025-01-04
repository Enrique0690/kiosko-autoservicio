/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';

export function useThemeColor(
  props: { default?: string },
  colorName: keyof typeof Colors
) {
  const colorFromProps = props.default;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[colorName];
  }
}
