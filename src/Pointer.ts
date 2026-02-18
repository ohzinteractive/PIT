import type { Region } from './Region';
import { Vector2 } from './Vector2';
import { LimitedVector2Stack } from './utilities/LimitedVector2Stack';
// import Logger from './utilities/Logger';

class Pointer
{
  down: boolean;
  id: number;
  position_array: LimitedVector2Stack;
  pressed: boolean;
  previous_position_array: LimitedVector2Stack;
  region: Region;
  released: boolean;

  constructor(id: number, x: number, y: number, region: Region)
  {
    this.region = region;
    this.id = id;

    this.position_array          = new LimitedVector2Stack(5);
    this.previous_position_array = new LimitedVector2Stack(5);

    this.position_array.push(new Vector2(x, y));
    this.previous_position_array.push(new Vector2(x, y));

    this.pressed = true;
    this.down = true;
    this.released = false;
  }

  get position()
  {
    return this.position_array.get_first().clone();
  }

  get position_delta()
  {
    return this.position.sub(this.previous_position);
  }

  get previous_position()
  {
    return this.previous_position_array.get_first();
  }

  get NDC()
  {
    return this.region.transform_pos_to_NDC(this.position);
  }

  get NDC_delta()
  {
    const delta = this.region.transform_dir_to_NDC(this.position_delta);
    delta.y *= -1;
    return delta;
  }

  distance_to(pointer: Pointer)
  {
    return this.position_array.average.distanceTo(pointer.position_array.average);
  }

  previous_distance_to(pointer: Pointer)
  {
    return this.previous_position_array.average.distanceTo(pointer.previous_position_array.average);
  }

  set_position(x: number, y: number)
  {
    this.previous_position_array.push(this.position_array.get_first().clone());
    this.position_array.push(new Vector2(x, y));
  }

  reset_previous_position()
  {
    this.previous_position_array.push(this.position_array.get_first().clone());
    this.position_array.push(this.position_array.get_first().clone());
  }
}

export { Pointer };
