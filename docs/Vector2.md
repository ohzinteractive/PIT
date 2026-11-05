# Vector2

A small 2D vector, returned by every position getter in PIT. Its methods match three.js's `Vector2`, so you can pass PIT vectors to three.js functions that only read `x` and `y`, like `Raycaster.setFromCamera()`.

## Export

```ts
import { Vector2 } from 'pit-js';
```

## Constructor

`new Vector2(x = 0, y = 0)`

## Methods

Methods that change the vector return `this`, so they can be chained. `v` can be any object with `x` and `y`, including a three.js `Vector2`.

| Method | Returns | Description |
|--------|---------|-------------|
| `set(x, y)` | `this` | Sets both components. |
| `clone()` | `Vector2` | A new vector with the same values. |
| `copy(v)` | `this` | Copies `v.x` and `v.y`. |
| `add(v)` | `this` | Adds `v`. |
| `sub(v)` | `this` | Subtracts `v`. |
| `multiplyScalar(s)` | `this` | Multiplies both components by `s`. |
| `divide(v)` | `this` | Divides each component by the one in `v`. |
| `divideScalar(s)` | `this` | Divides both components by `s`. |
| `dot(v)` | `number` | Dot product. |
| `cross(v)` | `number` | 2D cross product, `x * v.y - y * v.x`. |
| `length()` | `number` | Length. |
| `lengthSq()` | `number` | Squared length. Cheaper than `length()` for comparisons. |
| `normalize()` | `this` | Scales to length 1. A zero vector stays zero. |
| `angle()` | `number` | Angle from the positive x axis, in radians, from 0 to 2π. |
| `distanceTo(v)` | `number` | Distance to `v`. |
| `distanceToSquared(v)` | `number` | Squared distance to `v`. |
| `lerp(v, alpha)` | `this` | Moves toward `v` by `alpha`, from 0 (no change) to 1 (equal to `v`). |

## Example

```ts
const delta = input.pointer_pos_delta;

if (delta.length() > 20)
{
  const direction = delta.clone().normalize();
}
```

## Notes

- `isVector2` is static (`Vector2.isVector2`), while in three.js it's on each instance. Code that checks `v.isVector2` won't recognize a PIT vector; copy it into a three.js vector first with `new THREE.Vector2().copy(v)`.
- It's a subset of three.js's `Vector2`. Copy it into a three.js vector for anything not listed here.
