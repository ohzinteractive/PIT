import { Pointer } from './Pointer';
import type { Region } from './Region';
import { Vector2 } from './Vector2';
// import Logger from './utilities/Logger';

class TouchInputModule
{
  default_pointer: Pointer;
  left_mouse_button_down: boolean;
  left_mouse_button_pressed: boolean;
  left_mouse_button_released: boolean;
  pointers: Pointer[];
  previous_primary_pointer_pos: Vector2;
  previous_separation_distance: number | undefined;
  region: Region;
  zoom_delta: number;

  constructor(region: Region)
  {
    this.region = region;
    this.left_mouse_button_pressed  = false;
    this.left_mouse_button_down     = false;
    this.left_mouse_button_released = false;

    this.pointers = [];

    this.previous_separation_distance = undefined;
    this.zoom_delta = 0;

    this.previous_primary_pointer_pos = new Vector2();

    this.default_pointer = new Pointer(-5, 0, 0, region);
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
  }

  get_pointer(i: number)
  {
    if (this.pointers[i] !== undefined)
    {
      return this.pointers[i];
    }
    else
    {
      return this.default_pointer;
    }
  }

  get is_touchscreen()
  {
    return true;
  }

  get scroll_delta()
  {
    if (this.pointers.length > 0)
    {
      return this.get_primary_pointer().position_delta.y * 0.03;
    }
    return 0;
  }

  get_primary_pointer()
  {
    return this.get_pointer(0);
  }

  get pointer_pos_delta()
  {
    const position = new Vector2();

    for (let i = 0; i < this.pointers.length; i++)
    {
      position.add(this.pointers[i].position_delta());
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

  get pointer_center_NDC()
  {
    const center = this.pointer_center;
    return this.region.transform_pos_to_NDC(center);
  }

  get previous_pointer_center_NDC()
  {
    const center = this.previous_pointer_center;
    return this.region.transform_pos_to_NDC(center);
  }

  get pointer_center_delta()
  {
    const current_center = this.pointer_center;
    const prev_center = this.previous_pointer_center;

    return current_center.clone().sub(prev_center);
  }

  get pointer_center_NDC_delta()
  {
    const center = this.pointer_center_NDC;
    const prev_center = this.previous_pointer_center_NDC;

    return center.sub(prev_center);
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

  update_pointer(pointer_id: any, x: any, y: any)
  {
    let p = this.pointers.find((pointer: any) => pointer.id === pointer_id);
    if (p === undefined)
    {
      p = new Pointer(pointer_id, x, y, this.region);
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
    this.default_pointer.set_position(p.position.x, p.position.y);

    this.update_pointer_separation();

    // console.log(p)
    return p;
  }

  remove_pointer(pointer_id: any)
  {
    const index = this.pointers.findIndex((p: any) => p.id === pointer_id);

    if (index !== undefined)
    {
      this.pointers.splice(index, 1);
    }
    this.update_pointer_separation();
  }

  is_primary_pointer(pointer: any)
  {
    return this.pointers[0] === pointer;
  }

  pointer_down(event: TouchEvent)
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
      }
    }
  }

  pointer_up(event: TouchEvent)
  {
    const touches = event.changedTouches;

    for (let i = 0; i < touches.length; i++)
    {
      const touch = touches[i];
      const p = this.update_pointer(touch.identifier, touch.clientX, touch.clientY);
      p.released = true;

      if (this.is_primary_pointer(p))
      {
        this.left_mouse_button_released = true;
        this.left_mouse_button_down     = false;
      }
      this.remove_pointer(p.id);
    }
  }

  pointer_move(event: TouchEvent)
  {
    const touches = event.changedTouches;

    for (let i = 0; i < touches.length; i++)
    {
      const touch = touches[i];
      this.update_pointer(touch.identifier, touch.clientX, touch.clientY);
    }
  }

  pointer_cancel(event: TouchEvent)
  {
    this.pointer_out(event);
  }

  pointer_out(event: TouchEvent)
  {
    const touches = event.changedTouches;

    for (let i = 0; i < touches.length; i++)
    {
      const touch = touches[i];
      const p = this.update_pointer(touch.identifier, touch.clientX, touch.clientY);
      p.released = true;
      p.down = false;

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
      this.pointers[i].pressed = false;
    }
  }
}

export { TouchInputModule };
