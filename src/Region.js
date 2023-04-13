import { Vector2 } from './Vector2';

class Region
{
  constructor(region_element)
  {
    this.region_element = region_element;
    this.region_bounds = {
      x: 0,
      y: 0,
      width: 1,
      height: 1
    };

    this.resize_observer = new ResizeObserver(this.update_region_bounds.bind(this));
    this.resize_observer.observe(this.region_element);
  }

  update_region_bounds()
  {
    const region_bounds = this.region_element.getBoundingClientRect();

    this.region_bounds.x = region_bounds.left;
    this.region_bounds.y = region_bounds.top;
    this.region_bounds.width = region_bounds.width;
    this.region_bounds.height = region_bounds.height;
  }

  check_for_legal_bounds()
  {
    if (this.region_bounds.width === 0 || this.region_bounds.height === 0)
    {
      console.error('Cannot get normalized mouse position for target element due to the element having 0 width or height', this.dom_element, this.region_bounds);
    }
  }

  invert_y(pos)
  {
    const vec = new Vector2();
    vec.copy(pos);
    vec.y = this.region_bounds.height - vec.y;
    return vec;
  }

  transform_pos_to_subregion(pos)
  {
    const vec = new Vector2();
    vec.copy(pos);

    vec.x -= this.region_bounds.x;
    vec.y -= this.region_bounds.y;

    return vec;
  }

  transform_pos_to_NDC(pos)
  {
    this.check_for_legal_bounds();

    const vec = this.transform_pos_to_subregion(pos);

    vec.x = (vec.x / this.region_bounds.width) * 2 - 1;
    vec.y = (vec.y / this.region_bounds.height) * 2 - 1;
    return vec;
  }

  transform_dir_to_NDC(dir)
  {
    const vec = new Vector2();
    vec.copy(dir);
    dir.x /= this.region_bounds.width;
    dir.y /= this.region_bounds.height;

    return dir;
  }
}

export { Region };
