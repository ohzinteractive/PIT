class Vector2
{
  x: number;
  y: number;
  
  static isVector2: boolean = true;
  
  constructor(x = 0, y = 0)
  {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number)
  {
    this.x = x;
    this.y = y;

    return this;
  }

  clone()
  {
    return new Vector2(this.x, this.y);
  }

  copy(v: { x: number; y: number })
  {
    this.x = v.x;
    this.y = v.y;

    return this;
  }

  add(v: { x: number; y: number })
  {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  sub(v: { x: number; y: number })
  {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  multiplyScalar(scalar: number)
  {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  }

  divide(v: { x: number; y: number })
  {
    this.x /= v.x;
    this.y /= v.y;

    return this;
  }

  divideScalar(scalar: number)
  {
    return this.multiplyScalar(1 / scalar);
  }

  dot(v: { x: number; y: number })
  {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: { x: number; y: number })
  {
    return this.x * v.y - this.y * v.x;
  }

  lengthSq()
  {
    return this.x * this.x + this.y * this.y;
  }

  length()
  {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize()
  {
    return this.divideScalar(this.length() || 1);
  }

  angle()
  {
    // computes the angle in radians with respect to the positive x-axis

    const angle = Math.atan2(-this.y, -this.x) + Math.PI;

    return angle;
  }

  distanceTo(v: { x: number; y: number })
  {
    return Math.sqrt(this.distanceToSquared(v));
  }

  distanceToSquared(v: { x: number; y: number })
  {
    const dx = this.x - v.x; const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  lerp(v: { x: number; y: number }, alpha: number)
  {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;

    return this;
  }
}

export { Vector2 };
