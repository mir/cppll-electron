export function rem(x, base) {
  let result = Math.abs(x);
  while (result >= base) {
    result -= base;
  }
  return result;
}

export function solveSquare(a, b, c) {
  return (-b + Math.sqrt((b * b) - (4 * a * c))) / (2 * a);
}
