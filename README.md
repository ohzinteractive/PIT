# PIT

PIT (Pollable InpuT) is a small library to read mouse and touch input from an update loop. Instead of handling DOM events, you check the input state every frame: whether a button was pressed, where the pointer is, how much the user scrolled or pinched.

It's made for [WebGL](https://www.khronos.org/webgl/) and [WebGPU](https://webgpu.org/) apps and has no dependencies. [ohzi-core](https://github.com/ohzinteractive/core) and the [OHZI Boilerplate](https://github.com/ohzinteractive/boilerplate) use it, but it works on its own.

## Features

- Mouse and touch behind one interface: the left mouse button and the first finger are the same thing.
- Pressed, down and released state for the left, right and middle buttons.
- Pointer position in pixels and in normalized device coordinates (NDC, from -1 to 1).
- Coordinates relative to a subregion of the page.
- Scroll from the mouse wheel or a one-finger drag, and zoom from the mouse wheel or a two-finger pinch.
- Multi-touch: every finger on the screen, their count and their center.

## Installation

```sh
npm install pit-js
```

## Usage

```ts
import { InputController } from 'pit-js';

const input = new InputController();
input.init(document.body); // The element to listen on

function animate()
{
  if (input.left_mouse_button_pressed) // Left button or first finger
  {
    console.log('Pressed at', input.pointer_pos, input.NDC);
  }

  input.clear(); // Once per frame, after all reads
  requestAnimationFrame(animate);
}

animate();
```

## Documentation

- [InputController](docs/InputController.md) — Setup, the per-frame `clear()`, button state, and how mouse and touch share one interface.
- [Coordinates](docs/Coordinates.md) — Pointer position in pixels and NDC, deltas, the subregion, and bounds checks.
- [Pointers](docs/Pointers.md) — Multi-touch: the `Pointer` objects, their order and ids, the pointer count and center.
- [ScrollAndZoom](docs/ScrollAndZoom.md) — `scroll_delta` and `zoom_delta` from the wheel, trackpad, drag and pinch.
- [Vector2](docs/Vector2.md) — The 2D vector returned by every position getter.

## Examples

`examples/index.html` is a test page that logs `input.NDC_delta` every frame. Other checks are in the file, commented out. Build the library, then serve the folder:

```sh
yarn build
npx http-server examples
```

## License

MIT
