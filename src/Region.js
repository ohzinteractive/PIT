import { Vector2 } from './Vector2';

class Region
{
  constructor(region_element)
  {
    this.region_element = region_element;
    this.bounds = {
      x: 0,
      y: 0,
      width: 1,
      height: 1
    };

    this.observer = new IntersectionObserver((entries) =>
    {
      for (const entry of entries)
      {
        const bounds = entry.boundingClientRect;
        this.bounds.x =      bounds.left;
        this.bounds.y =      bounds.top;
        this.bounds.width =  bounds.width;
        this.bounds.height = bounds.height;
      }
      this.observer.disconnect();
    });
  }

  update()
  {
    this.observer.observe(this.region_element);
  }

  check_for_legal_bounds()
  {
    if (this.bounds.width === 0 || this.bounds.height === 0)
    {
      console.error('Cannot get normalized mouse position for target element due to the element having 0 width or height', this.dom_element, this.bounds);
    }
  }

  transform_pos_to_subregion(pos)
  {
    const vec = new Vector2();
    vec.copy(pos);

    vec.x -= this.bounds.x;
    vec.y -= this.bounds.y;

    return vec;
  }

  transform_pos_to_NDC(pos)
  {
    this.check_for_legal_bounds();
    const vec = this.transform_pos_to_subregion(pos);

    vec.x = (vec.x / this.bounds.width) * 2 - 1;
    vec.y = (1 - (vec.y / this.bounds.height)) * 2 - 1;
    console.log(vec.y);
    return vec;
  }

  transform_dir_to_NDC(dir)
  {
    const vec = new Vector2();
    vec.copy(dir);
    dir.x /= this.bounds.width;
    dir.y /= this.bounds.height;

    return dir;
  }
}

export { Region };
