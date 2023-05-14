class MathUtilities
{
  static clamp(value, min, max)
  {
    return Math.max(min, Math.min(max, value));
  }

  static is_int(n)
  {
    return Number(n) === n && n % 1 === 0;
  }
}

export { MathUtilities };
