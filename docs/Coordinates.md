# Coordinates

Where the pointer is, in pixels and in normalized device coordinates (NDC), relative to a subregion of the page. On desktop the pointer is the mouse. On touch it's the first finger, or the last touch position when no finger is down.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `pointer_pos` | `Vector2` | Pixels in viewport coordinates (`clientX`, `clientY`). Origin at the top left, y down. |
| `pointer_pos_delta` | `Vector2` | Pixels moved since the previous frame. |
| `NDC` | `Vector2` | Position in the subregion, from -1 to 1 on each axis. Origin at the center, y up. |
| `NDC_delta` | `Vector2` | Movement since the previous frame as a fraction of the subregion size: `(dx / width, -dy / height)`. This is half the change in `NDC`; see Notes. |
| `pointer_is_within_bounds` | `boolean` | `true` when `NDC` is inside [-1, 1] on both axes, so the pointer is over the subregion. |

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `pointer_is_over_element(elem)` | `boolean` | `true` when `pointer_pos` is inside `elem.getBoundingClientRect()`. The edges count as outside. |
| `get_pointer_pos(index = 0)` | `Vector2` | `pointer_pos` for one finger. |
| `get_pointer_pos_delta(index = 0)` | `Vector2` | `pointer_pos_delta` for one finger. |
| `get_pointer_NDC(index = 0)` | `Vector2` | `NDC` for one finger. |
| `get_pointer_NDC_delta(index = 0)` | `Vector2` | `NDC_delta` for one finger. |

`index` is a position in [`pointers`](Pointers.md), not a touch id. With the mouse, every index returns the mouse. On touch, an index with no finger returns the position from the last touch event, whichever finger it came from.

## Subregion

By default, NDC is computed over the element you listen on. Pass a second element to `init()` to compute it over that element instead:

```ts
const canvas_container = document.querySelector('.canvas-container');
input.init(document.body, canvas_container);
```

Events still come from the first element, so you keep getting input when the pointer leaves the subregion. `NDC` then goes outside [-1, 1]; check `pointer_is_within_bounds`.

The subregion bounds are read with an `IntersectionObserver` every time you call `clear()`. The observer answers asynchronously, so NDC uses bounds from about a frame earlier.

## Example

```ts
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();

function update()
{
  if (input.left_mouse_button_pressed && input.pointer_is_within_bounds)
  {
    raycaster.setFromCamera(input.NDC, camera);
    const hits = raycaster.intersectObjects(scene.children);
  }

  input.clear();
}
```

## Notes

- Until the observer first answers after the first `clear()`, the bounds are a 1 × 1 rect at (0, 0), so `NDC` is wrong for the first frame or two.
- If the subregion has zero width or height, every `NDC` read logs an error.
- `NDC` spans 2 units per axis, but `NDC_delta` divides by the size once. A drag across the whole subregion changes `NDC.x` by 2 and adds up to 1 in `NDC_delta.x`. On touch, [`pointer_center_NDC_delta`](Pointers.md) uses the full change instead.
- Deltas compare the position with the one before the last move event, not with the position at the last `clear()`. Browsers usually send one move event per frame, so the two match; when several arrive in one frame, only the last one counts.
- On touch with no finger down, `clear()` doesn't reset `pointer_pos_delta` and `NDC_delta`. After a multi-finger gesture they keep the distance between the last two fingers that lifted. Check `pointer_count > 0` before using them on touch.
- Each read returns a new `Vector2`, so you can change it safely. With the mouse, each read also creates a temporary `Pointer`. In hot code, read once per frame and keep the value.
