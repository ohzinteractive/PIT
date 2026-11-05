# ScrollAndZoom

Two per-frame values for scroll and zoom gestures. Both are `0` on frames with no gesture, and `clear()` resets them.

## Properties

| Property | Type | Mouse and trackpad | Touch |
|----------|------|--------------------|-------|
| `scroll_delta` | `number` | From the wheel; see the table below. | The first finger's vertical movement × 0.03, so 33 px gives 1. |
| `zoom_delta` | `number` | Same value as `scroll_delta`. | Change in distance between two fingers × -0.1, so 10 px gives 1. Only with exactly two fingers; `0` otherwise. |

### Wheel values

PIT treats a whole-number `deltaY` on macOS as a trackpad, and a fractional one as a mouse.

| Platform | Input | `scroll_delta` |
|----------|-------|----------------|
| Not macOS | Any wheel | `1` scrolling down, `-1` scrolling up, `0` with no vertical movement. |
| macOS | Mouse wheel | `1` scrolling down, `-1` scrolling up. |
| macOS | Trackpad | `-deltaY / 350`, clamped to [-1, 1]. The sign is opposite to the mouse. |
| macOS | Trackpad pinch (`ctrlKey`) | `0`. Ignored. |

### Signs

| Gesture | Value |
|---------|-------|
| Wheel down (not a macOS trackpad) | Positive |
| Finger moves down | Positive `scroll_delta` |
| Two fingers move closer | Positive `zoom_delta` |
| Two fingers move apart | Negative `zoom_delta` |

## Example

```ts
function update()
{
  // Zoom the camera with the wheel or a pinch
  distance = Math.min(Math.max(distance + input.zoom_delta * 0.5, 2), 20);

  // Scroll with the wheel or a one-finger drag
  if (input.pointer_count === 1)
  {
    scroll += input.scroll_delta;
  }

  input.clear();
}
```

## Notes

- With a mouse, scroll and zoom are the same wheel value, so one wheel turn drives both.
- On touch, `scroll_delta` also changes during a pinch, because the first finger moves. With the mouse `pointer_count` is always `1`, so checking `pointer_count === 1` keeps the wheel and skips pinches.
- Several wheel events in one frame don't add up: the last one wins. Touch zoom works the same way.
- Touch zoom uses each finger's average over its last 5 positions, so it's smooth but lags a little.
- Horizontal wheel movement (`deltaX`) is ignored.
- A wheel event also moves `pointer_pos` to where the wheel turned.
