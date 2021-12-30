import MathUtilities from './utilities/MathUtilities';
import OS from './utilities/OS';
export default class MouseInputModule
{
  constructor()
  {
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

    this.scroll_delta = 0;

    this.elapsed_time_since_pressed = 0;
    this.click_triggered = false;
  }

  get pointer_count()
  {
    if (this.left_mouse_button_down  ||
       this.right_mouse_button_down ||
       this.middle_mouse_button_down)
    {
      return 1;
    }
    else
    {
      return 0;
    }
  }

  get clicked()
  {
    return this.click_triggered;
  }

  get is_touchscreen()
  {
    return false;
  }

  pointer_down(event)
  {
    this.pointer_pos.x = event.clientX;
    this.pointer_pos.y = event.clientY;

    this.previous_pointer_pos.x = event.clientX;
    this.previous_pointer_pos.y = event.clientY;

    switch (event.button)
    {
    case 0:
      this.left_mouse_button_pressed = true;
      this.left_mouse_button_down    = true;
      this.elapsed_time_since_pressed = new Date();
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
      this.click_triggered = (new Date() - this.elapsed_time_since_pressed) < 200
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
    this.pointer_pos.x = event.clientX;
    this.pointer_pos.y = event.clientY;
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
    this.pointer_pos.x = event.clientX;
    this.pointer_pos.y = event.clientY;

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

    this.right_mouse_button_pressed  = false;
    this.right_mouse_button_released = false;

    this.middle_mouse_button_pressed  = false;
    this.middle_mouse_button_released = false;

    this.scroll_delta = 0;

    this.update_previous_pointer_pos();

    if(this.clicked)
    {
      this.elapsed_time_since_pressed = 0;
      this.click_triggered = false;
    }
  }

  get pointer_pos_delta()
  {
    return {
      x: this.pointer_pos.x - this.previous_pointer_pos.x,
      y: this.pointer_pos.y - this.previous_pointer_pos.y
    };
  }

  get pointer_center()
  {
    return this.pointer_pos;
  }

  get pointer_center_delta()
  {
    return this.pointer_pos_delta;
  }

  update_previous_pointer_pos()
  {
    this.previous_pointer_pos.x = this.pointer_pos.x;
    this.previous_pointer_pos.y = this.pointer_pos.y;
  }
}
