class Vector2
{
  constructor(x = 0, y = 0)
  {
    this.x = x;
    this.y = y;
  }

  set(x, y)
  {
    this.x = x;
    this.y = y;

    return this;
  }

  clone()
  {
    return new this.constructor(this.x, this.y);
  }

  copy(v)
  {
    this.x = v.x;
    this.y = v.y;

    return this;
  }

  add(v)
  {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  sub(v)
  {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  multiplyScalar(scalar)
  {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  }

  divide(v)
  {
    this.x /= v.x;
    this.y /= v.y;

    return this;
  }

  divideScalar(scalar)
  {
    return this.multiplyScalar(1 / scalar);
  }

  dot(v)
  {
    return this.x * v.x + this.y * v.y;
  }

  cross(v)
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

  distanceTo(v)
  {
    return Math.sqrt(this.distanceToSquared(v));
  }

  distanceToSquared(v)
  {
    const dx = this.x - v.x; const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  lerp(v, alpha)
  {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;

    return this;
  }
}

Vector2.prototype.isVector2 = true;

export { Vector2 };
