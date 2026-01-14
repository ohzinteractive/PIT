class Vector2
{
  x: any;
  y: any;
  
  static isVector2: boolean = true;
  
  constructor(x = 0, y = 0)
  {
    this.x = x;
    this.y = y;
  }

  set(x: any, y: any)
  {
    this.x = x;
    this.y = y;

    return this;
  }

  clone()
  {
    // @ts-expect-error TS(2351): This expression is not constructable.
    return new this.constructor(this.x, this.y);
  }

  copy(v: any)
  {
    this.x = v.x;
    this.y = v.y;

    return this;
  }

  add(v: any)
  {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  sub(v: any)
  {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  multiplyScalar(scalar: any)
  {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  }

  divide(v: any)
  {
    this.x /= v.x;
    this.y /= v.y;

    return this;
  }

  divideScalar(scalar: any)
  {
    return this.multiplyScalar(1 / scalar);
  }

  dot(v: any)
  {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: any)
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

  distanceTo(v: any)
  {
    return Math.sqrt(this.distanceToSquared(v));
  }

  distanceToSquared(v: any)
  {
    const dx = this.x - v.x; const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  lerp(v: any, alpha: any)
  {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;

    return this;
  }
}

export { Vector2 };
