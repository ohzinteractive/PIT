class MathUtilities
{
  static clamp(value: number, min: number, max: number)
  {
    return Math.max(min, Math.min(max, value));
  }

  static is_int(n: number)
  {
    return Number(n) === n && n % 1 === 0;
  }
}

export { MathUtilities };
