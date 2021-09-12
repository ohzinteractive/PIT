import MouseInputModule from './MouseInputModule';
import TouchInputModule from './TouchInputModule';

export default class InputController
{
  init(dom_element, sub_region_element)
  {
    this.dom_element = dom_element;
    this.sub_region_element = sub_region_element === undefined? dom_element : sub_region_element;
    this.mouse_input_module = new MouseInputModule();
    this.touch_input_module = new TouchInputModule();

    this.active_input_module = this.mouse_input_module;

    this.region_bounds = {
      x: 0,
      y: 0,
      width: 1,
      height: 1
    };

    this.update_region_bounds();

    this.touch_cooldown = new Date() - 1000;

    let self = this;

    this.bind_events();
  }

  bind_events()
  {
    this.__binded_on_wheel = this.on_wheel.bind(this);
    this.dom_element.addEventListener('wheel', this.__binded_on_wheel);

    this.__binded_on_touchstart = this.on_touchstart.bind(this);
    this.dom_element.addEventListener('touchstart', this.__binded_on_touchstart, { passive: false });
    this.__binded_on_touchmove = this.on_touchmove.bind(this);
    this.dom_element.addEventListener('touchmove', this.__binded_on_touchmove, { passive: false });
    this.__binded_on_touchcancel = this.on_touchcancel.bind(this);
    this.dom_element.addEventListener('touchcancel', this.__binded_on_touchcancel, { passive: false });
    this.__binded_on_touchend = this.on_touchend.bind(this);
    this.dom_element.addEventListener('touchend', this.__binded_on_touchend, { passive: false });

    this.__binded_on_mousedown = this.on_mousedown.bind(this);
    this.dom_element.addEventListener('mousedown', this.__binded_on_mousedown, false);
    this.__binded_on_mousemove = this.on_mousemove.bind(this);
    this.dom_element.addEventListener('mousemove', this.__binded_on_mousemove, false);
    this.__binded_on_mouseup = this.on_mouseup.bind(this);
    this.dom_element.addEventListener('mouseup', this.__binded_on_mouseup, false);
    this.__binded_on_mouseleave = this.on_mouseleave.bind(this);
    this.dom_element.addEventListener('mouseleave', this.__binded_on_mouseleave, false);
  }

  unbind_events()
  {
    this.dom_element.removeEventListener('wheel', this.__binded_on_wheel);

    this.dom_element.removeEventListener('touchstart', this.__binded_on_touchstart, { passive: false });
    this.dom_element.removeEventListener('touchmove', this.__binded_on_touchmove, { passive: false });
    this.dom_element.removeEventListener('touchcancel', this.__binded_on_touchcancel, { passive: false });
    this.dom_element.removeEventListener('touchend', this.__binded_on_touchend, { passive: false });

    this.dom_element.removeEventListener('mousedown', this.__binded_on_mousedown, false);
    this.dom_element.removeEventListener('mousemove', this.__binded_on_mousemove, false);
    this.dom_element.removeEventListener('mouseup', this.__binded_on_mouseup, false);
    this.dom_element.removeEventListener('mouseleave', this.__binded_on_mouseleave, false);
  }

  on_wheel(event)
  {
    this.mouse_input_module.scroll(event);
    this.set_mouse_input_active();
  }

  on_touchstart(event)
  {
    this.touch_input_module.pointer_down(event);
    this.set_touch_input_active();
  }

  on_touchmove(event)
  {
    this.touch_input_module.pointer_move(event);
    this.set_touch_input_active();
  }

  on_touchcancel(event)
  {
    this.touch_input_module.pointer_cancel(event);
    this.set_touch_input_active();
  }

  on_touchend(event)
  {
    this.touch_input_module.pointer_up(event);
    this.set_touch_input_active();
  }

  on_mousedown(event)
  {
    if (this.mouse_input_allowed())
    {
      this.mouse_input_module.pointer_down(event);
      this.set_mouse_input_active();
    }
  }

  on_mousemove(event)
  {
    if (this.mouse_input_allowed())
    {
      this.mouse_input_module.pointer_move(event);
      this.set_mouse_input_active();
    }
  }

  on_mouseup(event)
  {
    if (this.mouse_input_allowed())
    {
      this.mouse_input_module.pointer_up(event);
      this.set_mouse_input_active();
    }
  }

  on_mouseleave(event)
  {
    this.mouse_input_module.pointer_out(event);
    this.set_mouse_input_active();
  }

  clear()
  {
    this.touch_input_module.clear();
    this.mouse_input_module.clear();
    this.update_region_bounds();
  }

  update_region_bounds()
  {
    let region_bounds = this.sub_region_element.getBoundingClientRect();
    this.region_bounds.x = region_bounds.left;
    this.region_bounds.y = region_bounds.top;
    this.region_bounds.width = region_bounds.width;
    this.region_bounds.height = region_bounds.height;
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

  check_for_legal_bounds()
  {
    if(this.region_bounds.width === 0 || this.region_bounds.height === 0)
    {
      console.error("Cannot get normalized mouse position for target element due to the element having 0 width or height", this.dom_element, this.region_bounds)
    }
  }

  transform_pos_to_subregion(pos)
  {
    return {
      x: pos.x - this.region_bounds.x,
      y: this.region_bounds.height - (pos.y - this.region_bounds.y )
    };
  }
  transform_pos_to_NDC(pos)
  {
    this.check_for_legal_bounds();

    return {
      x: (pos.x / this.region_bounds.width) * 2 - 1,
      y: (pos.y / this.region_bounds.height) * 2 - 1
    };
  }

  get scroll_delta()
  {
    return this.active_input_module.scroll_delta;
  }

  get pointer_count()
  {
    return this.active_input_module.pointer_count;
  }

  get pointer_is_within_bounds()
  {
    let ndc = this.NDC;
    return  ndc.x >= -1 && ndc.x <= 1 &&
            ndc.y >= -1 && ndc.y <= 1
  }

  pointer_is_over_element(elem) {

    let rect = elem.getBoundingClientRect();
    let pos = this.html_pointer_pos;

    return  pos.x > rect.left &&
            pos.x < rect.left + rect.width &&
            pos.y > rect.top &&
            pos.y < rect.top + rect.height;
 }

  get pointer_pos()
  {
    return this.transform_pos_to_subregion(this.active_input_module.pointer_pos);
  }

  get html_pointer_pos()
  {
    return {
      x: this.active_input_module.pointer_pos.x,
      y: this.active_input_module.pointer_pos.y
    }
  }

  get pointer_pos_delta()
  {
    let pos_delta = this.active_input_module.pointer_pos_delta;
    return {
      x: pos_delta.x,
      y: pos_delta.y * -1
    };
  }

  get NDC()
  {
    return this.transform_pos_to_NDC(this.pointer_pos);
  }

  get NDC_delta()
  {
    this.check_for_legal_bounds();
    return {
      x: this.pointer_pos_delta.x / this.region_bounds.width,
      y: this.pointer_pos_delta.y / this.region_bounds.height
    }
  }

  get pointer_center(){
    return this.transform_pos_to_subregion(this.active_input_module.pointer_center);
  }

  get pointer_center_delta(){
    let center_delta = this.active_input_module.pointer_center_delta;
    return {
      x: center_delta.x,
      y: center_delta.y * -1
    };
  }

  get pointer_center_NDC(){
    return this.transform_pos_to_NDC(this.pointer_center);
  }

  get pointer_center_NDC_delta(){
    this.check_for_legal_bounds();

    let center_delta = this.pointer_center_delta;
    return {
      x: center_delta.x / this.region_bounds.width,
      y: center_delta.y / this.region_bounds.height
    }
  }

  dispose()
  {
    this.unbind_events();
  }
}
