import { Vector2 } from './Vector2';
// import Logger from './utilities/Logger';
import Pointer from './Pointer';

export default class TouchInputModule
{
  constructor()
  {
    this.left_mouse_button_pressed  = false;
    this.left_mouse_button_down     = false;
    this.left_mouse_button_released = false;

    this.pointers = [];

    this.previous_separation_distance = undefined;
    this.zoom_delta = 0;

    this.previous_primary_pointer_pos = { x: 0, y: 0 };

    // this.update_pointer(7, 5, 5)
    // this.update_pointer(6, 5, 5)
    // this.update_pointer(5, 5, 5)
    // console.log(this.pointer_pos_delta)
    // this.remove_pointer(7)
    // const p = this.pointers.find(p => this.is_primary_pointer(p));
    // console.log(p)
    // this.update_pointer(5, 10, 5)

    // this.update_pointer(6, 20, 20)
    // this.update_pointer(6, 25, 25)
    // this.pointers[0].distance_to(this.pointers[1])
    this.elapsed_time_since_pressed = 0;
    this.click_triggered = false;
  }

  get clicked()
  {
    return this.click_triggered;
  }

  get is_touchscreen()
  {
    return true;
  }

  get scroll_delta()
  {
    if (this.pointers.length === 1)
    {
      return this.pointers[0].get_position_delta().y * 0.03;
    }
    return 0;
  }

  get pointer_pos()
  {
    const position = new Vector2();
    position.x = this.previous_primary_pointer_pos.x;
    position.y = this.previous_primary_pointer_pos.y;

    if (this.pointers.length > 0)
    {
      position.set(0, 0);
      for (let i = 0; i < this.pointers.length; i++)
      {
        position.add(this.pointers[i].position);
      }
      position.divideScalar(Math.max(1, this.pointers.length));
    }

    return position;
  }

  get pointer_pos_delta()
  {
    const position = new Vector2();

    for (let i = 0; i < this.pointers.length; i++)
    {
      position.add(this.pointers[i].get_position_delta());
    }

    position.divideScalar(Math.max(1, this.pointers.length));
    return position;
  }

  get pointer_count()
  {
    return this.pointers.length;
  }

  get pointer_center()
  {
    const center = new Vector2();

    for (let i = 0; i < this.pointers.length; i++)
    {
      center.add(this.pointers[i].position);
    }

    center.divideScalar(Math.max(1, this.pointers.length));

    return center;
  }

  get previous_pointer_center()
  {
    const center = new Vector2();

    for (let i = 0; i < this.pointers.length; i++)
    {
      center.add(this.pointers[i].previous_position);
    }

    center.divideScalar(Math.max(1, this.pointers.length));

    return center;
  }

  get pointer_center_delta()
  {
    const current_center = this.pointer_center;
    const prev_center = this.previous_pointer_center;

    return current_center.clone().sub(prev_center);
  }

  update_pointer_separation()
  {
    if (this.pointers.length === 2)
    {
      const p0 = this.pointers[0];
      const p1 = this.pointers[1];

      const distance          = p0.distance_to(p1);
      const previous_distance = p0.previous_distance_to(p1);

      if (this.previous_separation_distance === undefined)
      {
        this.previous_separation_distance = distance;
      }

      const sensitivity = 0.1;
      this.zoom_delta = -(distance - previous_distance) * sensitivity;

      this.previous_separation_distance = distance;
    }
    else
    {
      this.previous_separation_distance = undefined;
      this.zoom_delta = 0;
    }
  }

  pointers_moving_away_from_each_other()
  {
    if (this.pointers.length !== 2)
    {
      return false;
    }
  }

  update_pointer(pointer_id, x, y)
  {
    let p = this.pointers.find(pointer => pointer.id === pointer_id);
    if (p === undefined)
    {
      // const is_primary = this.pointers.length === 0;
      p = new Pointer(pointer_id, x, y);
      this.pointers.push(p);
    }
    else
    {
      p.set_position(x, y);
    }

    if (this.is_primary_pointer(p))
    {
      this.previous_primary_pointer_pos.x = p.position.x;
      this.previous_primary_pointer_pos.y = p.position.y;
    }

    this.update_pointer_separation();

    // console.log(p)
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

  is_primary_pointer(pointer)
  {
    return this.pointers[0] === pointer;
  }

  pointer_down(event)
  {
    const touches = event.changedTouches;

    for (let i = 0; i < touches.length; i++)
    {
      const touch = touches[i];
      const p = this.update_pointer(touch.identifier, touch.clientX, touch.clientY);

      if (this.is_primary_pointer(p))
      {
        this.left_mouse_button_pressed = true;
        this.left_mouse_button_down    = true;
        this.elapsed_time_since_pressed = new Date();
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

      if (this.is_primary_pointer(p))
      {
        this.left_mouse_button_released = true;
        this.left_mouse_button_down     = false;
        this.click_triggered = (new Date() - this.elapsed_time_since_pressed) < 200;
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

      if (this.left_mouse_button_down && this.is_primary_pointer(p))
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
    this.zoom_delta = 0;

    for (let i = 0; i < this.pointers.length; i++)
    {
      this.pointers[i].reset_previous_position();
    }
    if (this.clicked)
    {
      this.elapsed_time_since_pressed = 0;
      this.click_triggered = false;
    }
  }
}
