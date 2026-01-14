class MathUtilities
{
  static clamp(value: any, min: any, max: any)
  {
    return Math.max(min, Math.min(max, value));
  }

  static is_int(n: any)
  {
    return Number(n) === n && n % 1 === 0;
  }
}

export { MathUtilities };
