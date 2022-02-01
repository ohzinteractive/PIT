class MathUtilities
{
  static clamp(value, min, max)
  {
    return Math.max(min, Math.min(max, value));
  }

  static is_int(n)
  {
    return Number(n) === n && n % 1 === 0;
  }
}

class OS
{
  init()
  {
    this.operating_systems = {
      ANDROID: 'android',
      IOS: 'ios',
      LINUX: 'linux',
      MAC: 'mac',
      WINDOWS: 'windows'
    };

    this.is_mobile = !!(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/));
    this.is_ipad = !!(navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    this.is_ios = !!navigator.userAgent.match(/(iPhone|iPod|iPad)/) || this.is_ipad;

    this.is_android = this.get_os() === this.operating_systems.ANDROID;
    this.is_linux = this.get_os() === this.operating_systems.LINUX;
    this.is_mac = this.get_os() === this.operating_systems.MAC;
    this.is_windows = this.get_os() === this.operating_systems.WINDOWS;
  }

  get_os()
  {
    let userAgent = window.navigator.userAgent;
    let platform = window.navigator.platform;
    let macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    let windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    let iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;

    if (macosPlatforms.indexOf(platform) !== -1)
    {
      os = this.operating_systems.MAC;
    }
    else if (iosPlatforms.indexOf(platform) !== -1)
    {
      os = this.operating_systems.IOS;
    }
    else if (windowsPlatforms.indexOf(platform) !== -1)
    {
      os = this.operating_systems.WINDOWS;
    }
    else if (/Android/.test(userAgent))
    {
      os = this.operating_systems.ANDROID;
    }
    else if (!os && /Linux/.test(platform))
    {
      os = this.operating_systems.LINUX;
    }

    return os;
  }
}

let OS$1 = new OS();

class MouseInputModule
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
      this.click_triggered = (new Date() - this.elapsed_time_since_pressed) < 200;
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

    if (OS$1.is_mac)
    {
      // User is pinching
      if (event.ctrlKey)
        ;
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

    if (this.clicked)
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

class Vector2
{
  constructor(x = 0, y = 0)
  {
    this.x = x;
    this.y = y;
  }

  set(x, y)
  {
    this.x = x;
    this.y = y;

    return this;
  }

  clone()
  {
    return new this.constructor(this.x, this.y);
  }

  copy(v)
  {
    this.x = v.x;
    this.y = v.y;

    return this;
  }

  add(v)
  {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  sub(v)
  {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  multiplyScalar(scalar)
  {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  }

  divide(v)
  {
    this.x /= v.x;
    this.y /= v.y;

    return this;
  }

  divideScalar(scalar)
  {
    return this.multiplyScalar(1 / scalar);
  }

  dot(v)
  {
    return this.x * v.x + this.y * v.y;
  }

  cross(v)
  {
    return this.x * v.y - this.y * v.x;
  }

  lengthSq()
  {
    return this.x * this.x + this.y * this.y;
  }

  length()
  {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize()
  {
    return this.divideScalar(this.length() || 1);
  }

  angle()
  {
    // computes the angle in radians with respect to the positive x-axis

    const angle = Math.atan2(-this.y, -this.x) + Math.PI;

    return angle;
  }

  distanceTo(v)
  {
    return Math.sqrt(this.distanceToSquared(v));
  }

  distanceToSquared(v)
  {
    const dx = this.x - v.x; const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  lerp(v, alpha)
  {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;

    return this;
  }
}

Vector2.prototype.isVector2 = true;

class LimitedStack
{
  constructor(max_size = 1)
  {
    this.max_size = max_size;

    this.array = [];
  }

  get_first()
  {
    return this.array[0];
  }

  length()
  {
    return this.array.length();
  }

  set_from_stack(stack)
  {
    for (let i = 0; i < this.array.length; i++)
    {
      this.array[i] = stack.array[i];
    }
  }

  push(elem)
  {
    this.array.unshift(elem);
    if (this.array.length > this.max_size)
    {
      this.array.pop();
    }
  }
}

class LimitedVector2Stack extends LimitedStack
{
  constructor(max_size = 1)
  {
    super(max_size);

    this.average = new Vector2();
  }

  set_from_stack(vector2_stack)
  {
    for (let i = 0; i < this.array.length; i++)
    {
      this.array[i].copy(vector2_stack.array[i]);
    }
    this.update_average();
  }

  push(elem)
  {
    super.push(elem);

    this.update_average();
  }

  update_average()
  {
    this.average.set(0, 0);
    for (let i = 0; i < this.array.length; i++)
    {
      this.average.add(this.array[i]);
    }

    this.average.divideScalar(Math.max(1, this.array.length));
  }
}

class Pointer
{
  constructor(id, x, y)
  {
    this.id = id;

    this.position_array          = new LimitedVector2Stack(5);
    this.previous_position_array = new LimitedVector2Stack(5);

    this.position_array.push(new Vector2(x, y));
    this.previous_position_array.push(new Vector2(x, y));
  }

  get position()
  {
    return this.position_array.get_first();
  }

  get previous_position()
  {
    return this.previous_position_array.get_first();
  }

  distance_to(pointer)
  {
    return this.position_array.average.distanceTo(pointer.position_array.average);
  }

  previous_distance_to(pointer)
  {
    return this.previous_position_array.average.distanceTo(pointer.previous_position_array.average);
  }

  set_position(x, y)
  {
    this.previous_position_array.push(this.position_array.get_first());
    this.position_array.push(new Vector2(x, y));
  }

  reset_previous_position()
  {
    this.previous_position_array.push(this.position_array.get_first().clone());
    this.position_array.push(this.position_array.get_first().clone());
  }

  get_position_delta()
  {
    return this.position.clone().sub(this.previous_position);
  }
}

class TouchInputModule
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

// import Logger from './utilities/Logger';

class InputController
{
  init(dom_element, sub_region_element)
  {
    this.dom_element = dom_element;
    this.sub_region_element = sub_region_element === undefined ? dom_element : sub_region_element;
    this.mouse_input_module = new MouseInputModule();
    this.touch_input_module = new TouchInputModule();

    this.active_input_module = this.mouse_input_module;

    this.region_bounds = {
      x: 0,
      y: 0,
      width: 1,
      height: 1
    };

    this.touch_cooldown = new Date() - 1000;

    this.bind_events();

    this.resize_observer = new ResizeObserver(this.update_region_bounds.bind(this));
    this.resize_observer.observe(this.sub_region_element);
  }

  bind_events()
  {
    this.__binded_on_wheel = this.on_wheel.bind(this);
    this.dom_element.addEventListener('wheel', this.__binded_on_wheel, { passive: true });

    this.__binded_on_touchstart = this.on_touchstart.bind(this);
    this.dom_element.addEventListener('touchstart', this.__binded_on_touchstart, { passive: true });
    this.__binded_on_touchmove = this.on_touchmove.bind(this);
    this.dom_element.addEventListener('touchmove', this.__binded_on_touchmove, { passive: true });
    this.__binded_on_touchcancel = this.on_touchcancel.bind(this);
    this.dom_element.addEventListener('touchcancel', this.__binded_on_touchcancel, { passive: true });
    this.__binded_on_touchend = this.on_touchend.bind(this);
    this.dom_element.addEventListener('touchend', this.__binded_on_touchend, { passive: true });

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
    this.dom_element.removeEventListener('wheel', this.__binded_on_wheel, { passive: true });

    this.dom_element.removeEventListener('touchstart', this.__binded_on_touchstart, { passive: true });
    this.dom_element.removeEventListener('touchmove', this.__binded_on_touchmove, { passive: true });
    this.dom_element.removeEventListener('touchcancel', this.__binded_on_touchcancel, { passive: true });
    this.dom_element.removeEventListener('touchend', this.__binded_on_touchend, { passive: true });

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
  }

  update_region_bounds(entries)
  {
    for (let entry of entries)
    {
      this.region_bounds.x = entry.contentRect.x;
      this.region_bounds.y = entry.contentRect.y;
      this.region_bounds.width = entry.contentRect.width;
      this.region_bounds.height = entry.contentRect.height;
    }
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

  get clicked()
  {
    return this.active_input_module.clicked;
  }

  get is_touchscreen()
  {
    return this.active_input_module.is_touchscreen;
  }

  check_for_legal_bounds()
  {
    if (this.region_bounds.width === 0 || this.region_bounds.height === 0)
    {
      console.error('Cannot get normalized mouse position for target element due to the element having 0 width or height', this.dom_element, this.region_bounds);
    }
  }

  transform_pos_to_subregion(pos)
  {
    return {
      x: pos.x - this.region_bounds.x,
      y: this.region_bounds.height - (pos.y - this.region_bounds.y)
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

  get zoom_delta()
  {
    return this.active_input_module.zoom_delta;
  }

  get pointer_count()
  {
    return this.active_input_module.pointer_count;
  }

  get pointer_is_within_bounds()
  {
    const ndc = this.NDC;

    return  ndc.x >= -1 && ndc.x <= 1 &&
            ndc.y >= -1 && ndc.y <= 1;
  }

  pointer_is_over_element(elem)
  {
    const rect = elem.getBoundingClientRect();
    const pos = this.html_pointer_pos;

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
    };
  }

  get pointer_pos_delta()
  {
    const pos_delta = this.active_input_module.pointer_pos_delta;

    return {
      x: pos_delta.x,
      y: pos_delta.y * -1
    };
  }

  get NDC()
  {
    return this.transform_pos_to_NDC(this.pointer_pos);
  }

  get html_NDC()
  {
    return this.transform_pos_to_NDC(this.html_pointer_pos);
  }

  get NDC_delta()
  {
    this.check_for_legal_bounds();
    return {
      x: this.pointer_pos_delta.x / this.region_bounds.width,
      y: this.pointer_pos_delta.y / this.region_bounds.height
    };
  }

  get pointer_center()
  {
    return this.transform_pos_to_subregion(this.active_input_module.pointer_center);
  }

  get pointer_center_delta()
  {
    const center_delta = this.active_input_module.pointer_center_delta;

    return {
      x: center_delta.x,
      y: center_delta.y * -1
    };
  }

  get pointer_center_NDC()
  {
    return this.transform_pos_to_NDC(this.pointer_center);
  }

  get pointer_center_NDC_delta()
  {
    this.check_for_legal_bounds();

    const center_delta = this.pointer_center_delta;

    return {
      x: center_delta.x / this.region_bounds.width,
      y: center_delta.y / this.region_bounds.height
    };
  }

  dispose()
  {
    this.unbind_events();
  }
}

export { InputController };
// # sourceMappingURL=PIT.module.js.map
