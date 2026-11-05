# InputController

The class you poll for input. It listens to mouse, wheel and touch events on one element and exposes the result as properties you read every frame. Call `clear()` at the end of each frame so the one-frame signals reset.

## Export

```ts
import { InputController } from 'pit-js';
```

Not a singleton. The constructor takes no arguments; pass the elements to `init()`.

## Setup

| Method | Description |
|--------|-------------|
| `init(dom_element, sub_region_element?)` | Adds the event listeners to `dom_element`. NDC is computed over `sub_region_element`, or over `dom_element` when it's omitted. See [Coordinates](Coordinates.md#subregion). |
| `clear()` | Resets the one-frame signals (`*_pressed`, `*_released`, `scroll_delta`, `zoom_delta`) and the position deltas, and refreshes the subregion bounds. Call it once per frame, after all reads. |
| `dispose()` | Removes the event listeners. |

## The frame loop

1. Events arrive between frames and update the state.
2. Your update code reads it.
3. `clear()` resets the one-frame signals for the next frame.

```ts
function update()
{
  if (input.left_mouse_button_pressed)
  {
    // First frame of the press
  }
  if (input.left_mouse_button_down)
  {
    // Every frame while held
  }
  if (input.left_mouse_button_released)
  {
    // First frame after the release
  }

  input.clear();
}
```

## Buttons

Each button has three flags. `pressed` and `released` are `true` for one frame, `down` is `true` while the button is held.

| Frame | `pressed` | `down` | `released` |
|-------|-----------|--------|------------|
| Button goes down | `true` | `true` | `false` |
| Button held | `false` | `true` | `false` |
| Button goes up | `false` | `false` | `true` |

| Properties | Source |
|------------|--------|
| `left_mouse_button_pressed`, `left_mouse_button_down`, `left_mouse_button_released` | Left mouse button, or the first finger on the screen. |
| `right_mouse_button_pressed`, `right_mouse_button_down`, `right_mouse_button_released` | Right mouse button. Mouse only. |
| `middle_mouse_button_pressed`, `middle_mouse_button_down`, `middle_mouse_button_released` | Middle mouse button. Mouse only. |

- A quick click can start and end between two frames. You then get `pressed` and `released` in the same frame, with `down` already `false`. Check `pressed` or `released` to catch clicks, not `down`.
- If the mouse leaves `dom_element` while a button is held, that button is released.
- On touch, the left button follows the first finger only. If it lifts while another finger stays, the left button is released and the other finger doesn't press it again. When that finger lifts, `left_mouse_button_released` fires a second time. Use [Pointers](Pointers.md) for multi-finger logic.

## Mouse and touch

PIT has a mouse module and a touch module, and the last input event decides which one answers.

| Property | Type | Description |
|----------|------|-------------|
| `is_touchscreen` | `boolean` | `true` when the last input came from touch. It describes the last event, not the device: it's `false` until the first touch and goes back to `false` on mouse input. |

- After a touch, browsers send emulated mouse events. PIT ignores `mousedown`, `mousemove` and `mouseup` for 0.75 s after the last touch event, so a tap isn't counted twice.
- `wheel` and `mouseleave` aren't filtered, and switch back to the mouse right away.

## Properties by topic

| Topic | Properties | Doc |
|-------|------------|-----|
| Position | `pointer_pos`, `pointer_pos_delta`, `NDC`, `NDC_delta`, `get_pointer_pos(index)`, `get_pointer_pos_delta(index)`, `get_pointer_NDC(index)`, `get_pointer_NDC_delta(index)`, `pointer_is_within_bounds`, `pointer_is_over_element(elem)` | [Coordinates](Coordinates.md) |
| Multi-touch | `pointers`, `pointer_count`, `pointer_center`, `pointer_center_delta`, `pointer_center_NDC`, `pointer_center_NDC_delta` | [Pointers](Pointers.md) |
| Scroll and zoom | `scroll_delta`, `zoom_delta` | [ScrollAndZoom](ScrollAndZoom.md) |

## In the OHZI Boilerplate

- `app/js/components/Input.ts` exports `Input`, a singleton that extends `InputController`. It adds keyboard input (ohzi-core `KeyboardInput`), `over_ui`, and `clicked` and `swiped_*` flags.
- `Input.init(container, keyboard_input_container)` has its own signature: the second argument is the keyboard element, so there's no subregion.
- ohzi-core's `RenderLoop` calls `input.clear()` at the end of every frame. Don't call it yourself.

## Notes

- `init()` adds listeners without removing old ones. Call `dispose()` before calling `init()` again.
- The wheel and touch listeners are passive, so PIT can't stop the page from scrolling or zooming. Set CSS `touch-action: none` on the element to stop touch gestures from doing that.
- PIT doesn't block the context menu. If you use the right button, call `preventDefault()` on `contextmenu` yourself.
- `mouse_input_module`, `touch_input_module`, `active_input_module` and `region` are public fields but not part of the documented API.
