import MouseInputModule from './MouseInputModule';
import TouchInputModule from './TouchInputModule';

export default class InputController
{
  constructor(dom_element)
  {
    this.dom_element = dom_element;

    this.mouse_input_module = new MouseInputModule();
    this.touch_input_module = new TouchInputModule();

    this.active_input_module = this.mouse_input_module;

    this.element_bounds = {
      x: 0,
      y: 0,
      width: 1,
      height: 1
    };

    this.update_element_bounds();

    this.touch_cooldown = new Date() - 1000;

    let self = this;

    dom_element.addEventListener('wheel', (event) =>
    {
      self.mouse_input_module.scroll(event);
      self.set_mouse_input_active();
    });

    dom_element.addEventListener('touchstart', (event) =>
    {
      self.touch_input_module.pointer_down(event);
      self.set_touch_input_active();
    }, { passive: false });

    dom_element.addEventListener('touchmove', (event) =>
    {
      self.touch_input_module.pointer_move(event);
      self.set_touch_input_active();
    }, { passive: false });

    dom_element.addEventListener('touchcancel', (event) =>
    {
      self.touch_input_module.pointer_cancel(event);
      self.set_touch_input_active();
    }, { passive: false });

    dom_element.addEventListener('touchend', (event) =>
    {
      self.touch_input_module.pointer_up(event);
      self.set_touch_input_active();
    }, { passive: false });

    dom_element.addEventListener('mousedown', (event) =>
    {
      if (self.mouse_input_allowed())
      {
        self.mouse_input_module.pointer_down(event);
        self.set_mouse_input_active()
      }
    }, false);

    dom_element.addEventListener('mousemove', (event) =>
    {
      if (self.mouse_input_allowed())
      {
        self.mouse_input_module.pointer_move(event);
        self.set_mouse_input_active()
      }
    }, false);

    dom_element.addEventListener('mouseup', (event) =>
    {
      if (self.mouse_input_allowed())
      {
        self.mouse_input_module.pointer_up(event);
        self.set_mouse_input_active()
      }
    }, false);

    dom_element.addEventListener('mouseleave', (event) =>
    {
      self.mouse_input_module.pointer_out(event);
      self.set_mouse_input_active()
    }, false);
  }

  clear()
  {
    this.touch_input_module.clear();
    this.mouse_input_module.clear();

  }

  update_element_bounds()
  {
    let element_bounds = this.dom_element.getBoundingClientRect();
    this.element_bounds.x = element_bounds.x;
    this.element_bounds.y = element_bounds.y;
    this.element_bounds.width = element_bounds.width;
    this.element_bounds.height = element_bounds.height;
  }

  mouse_input_allowed()
  {
    return (new Date() - this.touch_cooldown) / 1000 > 0.75;
  }

  set_mouse_input_active()
  {
    this.active_input_module = this.mouse_input_module;
  }
  set_touch_input_active()
  {
    this.active_input_module = this.touch_input_module;
    this.touch_cooldown = new Date();
  }

  get left_mouse_button_pressed()
  {
    return this.active_input_module.left_mouse_button_pressed;
  }

  get left_mouse_button_down()
  {
    return this.active_input_module.left_mouse_button_down;
  }

  get left_mouse_button_released()
  {
    return this.active_input_module.left_mouse_button_released;
  }

  get right_mouse_button_pressed()
  {
    return this.mouse_input_module.right_mouse_button_pressed;
  }

  get right_mouse_button_down()
  {
    return this.mouse_input_module.right_mouse_button_down;
  }

  get right_mouse_button_released()
  {
    return this.mouse_input_module.right_mouse_button_released;
  }
  get middle_mouse_button_pressed()
  {
    return this.mouse_input_module.middle_mouse_button_pressed;
  }

  get middle_mouse_button_down()
  {
    return this.mouse_input_module.middle_mouse_button_down;
  }

  get middle_mouse_button_released()
  {
    return this.mouse_input_module.middle_mouse_button_released;
  }
















  get mouse_pos()
  {
    return {
      x: this.active_input_module.pointer_pos.x,
      y: this.element_bounds.height - this.active_input_module.pointer_pos.y
    };
  }

  get mouse_pos_delta()
  {
    let pos_delta =  this.active_input_module.pointer_pos_delta;
    pos_delta.y *= -1;
    return pos_delta;
  }

  get NDC()
  {
    this.check_for_legal_bounds(this.mouse_pos);

    return {
      x: (this.mouse_pos.x / this.element_bounds.width) * 2 - 1,
      y: (this.mouse_pos.y / this.element_bounds.height) * 2 - 1
    };
  }

  get NDC_delta()
  {
    this.check_for_legal_bounds(this.mouse_pos);
    return {
      x: this.mouse_pos_delta.x / this.element_bounds.width,
      y: this.mouse_pos_delta.y / this.element_bounds.height
    }
  }

  check_for_legal_bounds()
  {
    if(this.element_bounds.width === 0 || this.element_bounds.height === 0)
    {
      console.error("Cannot get normalized mouse position for target element due to the element having 0 width or height", this.dom_element, this.element_bounds)
    }
  }

  get scroll_delta()
  {
    return this.active_input_module.scroll_delta;
  }

  get pointer_count()
  {
    return this.active_input_module.pointer_count;
  }
}
