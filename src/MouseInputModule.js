import { Pointer } from './Pointer';
import { MathUtilities } from './utilities/MathUtilities';
import { OS } from './utilities/OS';

class MouseInputModule
{
  constructor(region)
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

  get pointer_count()
  {
    return 1;
  }

  get is_touchscreen()
  {
    return false;
  }

  pointer_down(event)
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

  pointer_up(event)
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

  pointer_move(event)
  {
    this.pointer.set_position(event.clientX, event.clientY);
  }

  pointer_cancel(event)
  {
    this.pointer_out(event);
  }

  pointer_out(event)
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

  scroll(event)
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
    return this.pointer.get_position_delta();
  }

  get pointer_center()
  {
    return this.pointer.position;
  }

  get pointer_center_delta()
  {
    return this.pointer.get_position_delta();
  }

  update_previous_pointer_pos()
  {
    this.pointer.reset_previous_position();
  }

  get_primary_pointer_position()
  {
    return this.pointer.position;
  }

  get_primary_html_pointer_position()
  {
    return this.pointer.html_position;
  }

  get_primary_pointer_NDC()
  {
    return this.pointer.NDC;
  }

  get_primary_pointer_html_NDC()
  {
    return this.pointer.html_NDC;
  }
}

export { MouseInputModule };
