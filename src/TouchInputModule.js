export default class TouchInputModule
{
  constructor()
  {
    this.left_mouse_button_pressed  = false;
    this.left_mouse_button_down     = false;
    this.left_mouse_button_released = false;

    this.pointers = [];

    this.previous_separation_distance = undefined;
    this.scroll_delta = 0;

    this.previous_primary_pointer_pos = { x: 0, y: 0 };
  }

  get pointer_pos()
  {
    let x = this.previous_primary_pointer_pos.x;
    let y = this.previous_primary_pointer_pos.y;

    const p = this.pointers.find(p => p.is_primary);

    if (p)
    {
      x = p.x;
      y = p.y;
    }

    return {
      x: x,
      y: y
    };
  }

  get pointer_pos_delta()
  {
    let x = 0;
    let y = 0;

    const p = this.pointers.find(p => p.is_primary);

    if (p)
    {
      x = p.x - this.previous_primary_pointer_pos.x;
      y = p.y - this.previous_primary_pointer_pos.y;
    }
    return {
      x: x,
      y: y
    };
  }

  get pointer_count()
  {
    return this.pointers.length;
  }

  get pointer_center()
  {
    let x = 0;
    let y = 0;

    for (let i = 0; i < this.pointers.length; i++)
    {
      x += this.pointers[i].x;
      y += this.pointers[i].y;
    }

    x /= Math.max(1, this.pointers.length);
    y /= Math.max(1, this.pointers.length);

    return {
      x: x,
      y: y
    };
  }

  get previous_pointer_center()
  {
    let x = 0;
    let y = 0;

    for (let i = 0; i < this.pointers.length; i++)
    {
      x += this.pointers[i].previous_x;
      y += this.pointers[i].previous_y;
    }

    x /= Math.max(1, this.pointers.length);
    y /= Math.max(1, this.pointers.length);

    return {
      x: x,
      y: y
    };
  }

  get pointer_center_delta()
  {
    const current_center = this.pointer_center;
    const prev_center = this.previous_pointer_center;

    return {
      x: current_center.x - prev_center.x,
      y: current_center.y - prev_center.y
    };
  }

  update_pointer_separation()
  {
    if (this.pointers.length === 2)
    {
      const x0 = this.pointers[0].x;
      const y0 = this.pointers[0].y;

      const x1 = this.pointers[1].x;
      const y1 = this.pointers[1].y;

      const distance = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));

      if (this.previous_separation_distance === undefined)
      {
        this.previous_separation_distance = distance;
      }

      const sensitivity = 0.15;
      this.scroll_delta = -(distance - this.previous_separation_distance) * sensitivity;
      this.previous_separation_distance = distance;
    }
    else
    {
      this.previous_separation_distance = undefined;
      this.scroll_delta = 0;
    }
  }

  update_pointer(pointer_id, x, y)
  {
    let p = this.pointers.find(p => p.id === pointer_id);

    if (p === undefined)
    {
      p = {
        id: pointer_id,
        x: x,
        y: y,
        previous_x: x,
        previous_y: y,
        is_primary: this.pointers.length === 0
      };

      this.pointers.push(p);
    }

    if (p.is_primary)
    {
      this.previous_primary_pointer_pos.x = p.x;
      this.previous_primary_pointer_pos.y = p.y;
    }

    p.previous_x = p.x;
    p.previous_y = p.y;

    p.x = x;
    p.y = y;

    this.update_pointer_separation();

    return p;
  }

  remove_pointer(pointer_id)
  {
    const index = this.pointers.findIndex(p => p.id === pointer_id);

    if (index !== undefined)
    {
      this.pointers.splice(index, 1);
    }
    this.update_pointer_separation();
  }

  pointer_down(event)
  {
    const touches = event.changedTouches;

    for (let i = 0; i < touches.length; i++)
    {
      const touch = touches[i];
      const p = this.update_pointer(touch.identifier, touch.clientX, touch.clientY);

      if (p.is_primary)
      {
        this.left_mouse_button_pressed = true;
        this.left_mouse_button_down    = true;
      }
    }
  }

  pointer_up(event)
  {
    const touches = event.changedTouches;

    for (let i = 0; i < touches.length; i++)
    {
      const touch = touches[i];
      const p = this.update_pointer(touch.identifier, touch.clientX, touch.clientY);

      if (p.is_primary)
      {
        this.left_mouse_button_released = true;
        this.left_mouse_button_down     = false;
      }
      this.remove_pointer(p.id);
    }
  }

  pointer_move(event)
  {
    const touches = event.changedTouches;

    for (let i = 0; i < touches.length; i++)
    {
      const touch = touches[i];
      this.update_pointer(touch.identifier, touch.clientX, touch.clientY);
    }
  }

  pointer_cancel(event)
  {
    this.pointer_out(event);
  }

  pointer_out(event)
  {
    const touches = event.changedTouches;

    for (let i = 0; i < touches.length; i++)
    {
      const touch = touches[i];
      const p = this.update_pointer(touch.identifier, touch.clientX, touch.clientY);

      if (this.left_mouse_button_down && p.is_primary)
      {
        this.left_mouse_button_down     = false;
        this.left_mouse_button_released = true;
      }

      this.remove_pointer(p.id);
    }
  }

  clear()
  {
    this.left_mouse_button_pressed  = false;
    this.left_mouse_button_released = false;
    this.scroll_delta = 0;
  }
}
