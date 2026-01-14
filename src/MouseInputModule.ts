import { Pointer } from './Pointer';
import { MathUtilities } from './utilities/MathUtilities';
import { OS } from './utilities/OS';

class MouseInputModule
{
  left_mouse_button_down: any;
  left_mouse_button_pressed: any;
  left_mouse_button_released: any;
  middle_mouse_button_down: any;
  middle_mouse_button_pressed: any;
  middle_mouse_button_released: any;
  pointer: any;
  pointer_pos: any;
  pointers: any;
  previous_pointer_pos: any;
  region: any;
  right_mouse_button_down: any;
  right_mouse_button_pressed: any;
  right_mouse_button_released: any;
  scroll_delta: any;

  constructor(region: any)
  {
    this.region = region;
    this.left_mouse_button_pressed  = false;
    this.left_mouse_button_down     = false;
    this.left_mouse_button_released = false;

    this.right_mouse_button_pressed  = false;
    this.right_mouse_button_down     = false;
    this.right_mouse_button_released = false;

    this.middle_mouse_button_pressed  = false;
    this.middle_mouse_button_down     = false;
    this.middle_mouse_button_released = false;

    this.pointer_pos = { x: 0, y: 0 };
    this.previous_pointer_pos = { x: 0, y: 0 };

    this.pointer = new Pointer(9999, 0, 0, region);
    this.pointer.pressed = false;
    this.pointer.down = false;
    this.pointer.released = false;

    this.pointers = [this.pointer];

    this.scroll_delta = 0;
  }

  get_primary_pointer()
  {
    return this.pointer;
  }

  get_pointer(index: any)
  {
    const pointer = new Pointer(index,
      this.pointer.position.x,
      this.pointer.position.y,
      this.pointer.region
    );

    pointer.position_array.set_from_stack(this.pointer.position_array);
    pointer.previous_position_array.set_from_stack(this.pointer.previous_position_array);

    if (index === 0)
    {
      pointer.pressed = this.left_mouse_button_pressed;
      pointer.down = this.left_mouse_button_down;
      pointer.released = this.left_mouse_button_released;
    }
    if (index === 1)
    {
      pointer.pressed  = this.right_mouse_button_pressed;
      pointer.down     = this.right_mouse_button_down;
      pointer.released = this.right_mouse_button_released;
    }
    if (index === 2)
    {
      pointer.pressed  = this.middle_mouse_button_pressed;
      pointer.down     = this.middle_mouse_button_down;
      pointer.released = this.middle_mouse_button_released;
    }
    return pointer;
  }

  get pointer_count()
  {
    return 1;
  }

  get is_touchscreen()
  {
    return false;
  }

  get pointer_center()
  {
    return this.pointer.position;
  }

  get pointer_center_NDC()
  {
    return this.pointer.NDC;
  }

  get pointer_center_NDC_delta()
  {
    return this.pointer.NDC_delta;
  }

  get pointer_center_delta()
  {
    return this.pointer.position_delta;
  }

  pointer_down(event: any)
  {
    // this.pointer_pos.x = event.clientX;
    // this.pointer_pos.y = event.clientY;
    this.pointer.set_position(event.clientX, event.clientY);

    // this.previous_pointer_pos.x = event.clientX;
    // this.previous_pointer_pos.y = event.clientY;

    switch (event.button)
    {
    case 0:
      this.left_mouse_button_pressed = true;
      this.left_mouse_button_down    = true;
      this.pointer.pressed = true;
      this.pointer.down = true;
      break;
    case 1:
      this.middle_mouse_button_pressed = true;
      this.middle_mouse_button_down    = true;
      break;
    case 2:
      this.right_mouse_button_pressed = true;
      this.right_mouse_button_down    = true;
      break;
    }
  }

  pointer_up(event: any)
  {
    switch (event.button)
    {
    case 0:
      this.left_mouse_button_released = true;
      this.left_mouse_button_down     = false;
      this.pointer.released = true;
      this.pointer.down = false;
      break;
    case 1:
      this.middle_mouse_button_released = true;
      this.middle_mouse_button_down     = false;
      break;
    case 2:
      this.right_mouse_button_released = true;
      this.right_mouse_button_down     = false;
      break;
    }
  }

  pointer_move(event: any)
  {
    this.pointer.set_position(event.clientX, event.clientY);
  }

  pointer_cancel(event: any)
  {
    this.pointer_out(event);
  }

  pointer_out(event: any)
  {
    if (this.left_mouse_button_down)
    {
      this.left_mouse_button_down     = false;
      this.left_mouse_button_released = true;
      this.pointer.down = false;
      this.pointer.released = true;
    }
    if (this.middle_mouse_button_down)
    {
      this.middle_mouse_button_down     = false;
      this.middle_mouse_button_released = true;
    }
    if (this.right_mouse_button_down)
    {
      this.right_mouse_button_down     = false;
      this.right_mouse_button_released = true;
    }
  }

  scroll(event: any)
  {
    this.pointer.set_position(event.clientX, event.clientY);
    if (OS.is_mac)
    {
      // User is pinching
      if (event.ctrlKey)
      {
        // Negative values means pinch in.
        // Positive values means pinch out.
        // console.log('Pinching with a touchpad', event.deltaY);
        // User is scrolling
      }
      else
      {
        // User is using the touchpad
        if (MathUtilities.is_int(event.deltaY))
        {
          // Negative values means scroll up
          // Positive values means scroll down
          // console.log("Scrolling with a touchpad", (event.deltaY))
          // 350 is aprox the maximum value of deltaY on touchpad scroll
          this.scroll_delta = MathUtilities.clamp(event.deltaY / 350, -1, 1) * -1;
        }
        else
        {
          // Negative values means scroll up
          // Positive values means scroll down
          // console.log("Scrolling with a mouse", event.deltaY)
          this.scroll_delta = event.deltaY / Math.abs(event.deltaY);
        }
      }
    }
    else
    {
      // probably windows
      if (Math.abs(event.deltaY) < 0.0001)
      {
        this.scroll_delta = 0;
      }
      else
      {
        this.scroll_delta = event.deltaY / Math.abs(event.deltaY);
      }
    }
  }

  get zoom_delta()
  {
    return this.scroll_delta;
  }

  clear()
  {
    this.left_mouse_button_pressed  = false;
    this.left_mouse_button_released = false;

    this.pointer.pressed = false;
    this.pointer.released = false;

    this.right_mouse_button_pressed  = false;
    this.right_mouse_button_released = false;

    this.middle_mouse_button_pressed  = false;
    this.middle_mouse_button_released = false;

    this.scroll_delta = 0;

    this.update_previous_pointer_pos();
  }

  get pointer_pos_delta()
  {
    return this.pointer.position_delta;
  }

  update_previous_pointer_pos()
  {
    this.pointer.reset_previous_position();
  }
}

export { MouseInputModule };
