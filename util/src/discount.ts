export function calcDiscount(price: number, clearPrice: number) {
  return Math.round(100 - (clearPrice / price) * 100);
}
