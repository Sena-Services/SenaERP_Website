/**
 * Responsive height-based scaling utility.
 * Shared across IntroSection, BuilderTabbed, and JoinUsSection.
 *
 * Scales values based on viewport height relative to a base screen height:
 * - <= 600px: aggressive 0.4x scale
 * - 600-1200px: gradual 0.4x to 1x
 * - > 1200px: proportional scale-up
 */
export function getResponsiveValue(
  viewportHeight: number,
  baseValue: number,
  baseScreenHeight = 1200
): number {
  if (viewportHeight <= 600) {
    return baseValue * 0.4;
  }
  if (viewportHeight <= baseScreenHeight) {
    const scaleFactor =
      0.4 + ((viewportHeight - 600) / (baseScreenHeight - 600)) * 0.6;
    return baseValue * scaleFactor;
  }
  return baseValue * (viewportHeight / baseScreenHeight);
}
