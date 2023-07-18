
export { };

declare global {
  interface Number {
    roundTo(decimalPlaces?: number): string;
  }
}
