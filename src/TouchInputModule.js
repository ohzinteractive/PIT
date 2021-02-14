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
  }

  get pointer_pos()
  {
    let x = 0;
    let y = 0;


    let p = this.pointers.find( p => p.is_primary );

    if(p)
    {
      x = p.x;
      y = p.y;
    }

    return {
      x: x,
      y: y
    }
  }

  get pointer_pos_delta()
  {
    let x = 0;
    let y = 0;

    let p = this.pointers.find( p => p.is_primary );

    if(p)
    {
      x = p.x - p.previous_x
      y = p.y - p.previous_y
    }
 
    return {
      x: x,
      y: y
    }  
  }

  get pointer_count()
  {
    return this.pointers.length;
  }

  get pointer_center()
  {
    let x = 0;
    let y = 0;


    for(let i=0; i< this.pointers.length; i++)
    {
      x += this.pointers[i].x;
      y += this.pointers[i].y;
    }

    x /= Math.max(1, this.pointers.length);
    y /= Math.max(1, this.pointers.length);

    return {
      x: x,
      y: y
    }
  }

  update_pointer_separation()
  {
    if(this.pointers.length === 2)
    {
      let x0 = this.pointers[0].x;
      let y0 = this.pointers[0].y;

      let x1 = this.pointers[1].x;
      let y1 = this.pointers[1].y;

      let distance = Math.sqrt(Math.pow(x0 - x1,2) + Math.pow(y0 - y1, 2));
      
      if(this.previous_separation_distance === undefined)
        this.previous_separation_distance = distance;

      let sensitivity = 0.15;
      this.scroll_delta = - (distance - this.previous_separation_distance) * sensitivity;
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
    let p = this.pointers.find( p => p.id === pointer_id );
    if(p === undefined)
    {
      p = {
        id: pointer_id,
        x: x,
        y: y,
        previous_x: x,
        previous_y: y,
        is_primary: this.pointers.length === 0
      }
      this.pointers.push(p)
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
    let index = this.pointers.findIndex( p => p.id === pointer_id );
    if(index !== undefined)
    {
      this.pointers.splice(index, 1);
    }
    this.update_pointer_separation();
  }

  pointer_down(event)
  {
    if (event.scale !== 1) { event.preventDefault(); }

    let touches = event.changedTouches;
    for(let i=0; i< touches.length; i++)
    {
      let touch = touches[i];
      let p = this.update_pointer(touch.identifier, touch.clientX, touch.clientY);
      if(p.is_primary)
      {
        this.left_mouse_button_pressed = true;
        this.left_mouse_button_down    = true;
      }
    } 
    
  }

  pointer_up(event)
  {
    if (event.scale !== 1) { event.preventDefault(); }

    let touches = event.changedTouches;
    for(let i=0; i< touches.length; i++)
    {
      let touch = touches[i];
      let p = this.update_pointer(touch.identifier, touch.clientX, touch.clientY);

      if(p.is_primary)
      {
        this.left_mouse_button_released = true;
        this.left_mouse_button_down     = false;
      }
      this.remove_pointer(p.id);
    }

    
  }

  pointer_move(event)
  {
    if (event.scale !== 1) { event.preventDefault(); }
    
    let touches = event.changedTouches;
    for(let i=0; i< touches.length; i++)
    {
      let touch = touches[i];
      this.update_pointer(touch.identifier, touch.clientX, touch.clientY)
    }
  }

  pointer_cancel(event)
  {
    this.pointer_out(event);
  }
  pointer_out(event)
  {
    
    let touches = event.changedTouches;
    for(let i=0; i< touches.length; i++)
    {
      let touch = touches[i];
      let p = this.update_pointer(touch.identifier, touch.clientX, touch.clientY)
      if(this.left_mouse_button_down && p.is_primary)
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