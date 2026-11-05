# Pointers

Every active pointer as an object: one per finger on touch, one for the mouse. Use them for multi-touch: count the fingers, follow one by id, or read their center.

## Properties

| Property | Type | Mouse | Touch |
|----------|------|-------|-------|
| `pointers` | `Pointer[]` | One item, the mouse. | One per finger on the screen, oldest first. Empty with no finger. |
| `pointer_count` | `number` | Always `1`, even with no button held. | Number of fingers on the screen. |
| `pointer_center` | `Vector2` | Same as `pointer_pos`. | Average position of the fingers, in pixels. `(0, 0)` with no finger. |
| `pointer_center_delta` | `Vector2` | Same as `pointer_pos_delta`. | Pixels the center moved since the previous frame. |
| `pointer_center_NDC` | `Vector2` | Same as `NDC`. | The center in NDC. |
| `pointer_center_NDC_delta` | `Vector2` | Same as `NDC_delta`. | Change in the center's NDC since the previous frame. Twice `NDC_delta` for the same movement; see Notes. |

## Pointer

`Pointer` isn't exported from `pit-js`. You get instances from `input.pointers`.

| Member | Type | Description |
|--------|------|-------------|
| `id` | `number` | The touch `identifier`. `9999` for the mouse. |
| `pressed` | `boolean` | `true` on the first frame of the finger. For the mouse, follows the left button. |
| `down` | `boolean` | `true` while the finger is on the screen. For the mouse, follows the left button. |
| `released` | `boolean` | For the mouse, follows the left button. On touch, see Notes. |
| `position` | `Vector2` | Pixels in viewport coordinates, y down. |
| `position_delta` | `Vector2` | Pixels moved since the previous frame. |
| `previous_position` | `Vector2` | Position at the previous frame. Not a copy, so don't change it. |
| `NDC` | `Vector2` | Position in the subregion, from -1 to 1, y up. |
| `NDC_delta` | `Vector2` | Same scale as `input.NDC_delta`. |
| `distance_to(pointer)` | `number` | Pixels to another pointer, using each one's average over its last 5 positions. |

The other members are used internally.

## Order and ids

`pointers` keeps fingers in the order they touched the screen. Lifting one doesn't change the order of the others:

| Action | `pointers` |
|--------|------------|
| Place A, then B, then C | `[A, B, C]` |
| Lift A | `[B, C]` |
| Lift B instead | `[A, C]` |

So `pointers[0]` isn't always the same finger. Keep `pointer.id` to follow one finger across frames.

## Example

```ts
let tracked_id = undefined;

function update()
{
  // Two-finger pan
  if (input.pointer_count === 2)
  {
    pan.add(input.pointer_center_NDC_delta);
  }

  // Follow the first finger that lands, until it lifts
  if (tracked_id === undefined)
  {
    tracked_id = input.pointers.find((p) => p.pressed)?.id;
  }

  const tracked = input.pointers.find((p) => p.id === tracked_id);
  if (tracked)
  {
    offset.add(tracked.position_delta);
  }
  else
  {
    tracked_id = undefined;
  }

  input.clear();
}
```

## Notes

- A touch pointer is removed from `pointers` in the same event that releases it, so you never see `released` as `true` there. Only a reference kept from an earlier frame shows it, and after a `touchend` its `down` stays `true`. Use the disappearance of the id instead.
- On touch, `pointer_center_NDC_delta` is the real change in NDC, while `NDC_delta` is half of it ([Coordinates](Coordinates.md#notes)). With the mouse both are the same, so one drag gives twice the value on touch.
- `left_mouse_button_*` follows the first finger only. See [InputController](InputController.md#buttons).
