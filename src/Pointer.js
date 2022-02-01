import { Vector2 } from './Vector2';
// import Logger from './utilities/Logger';
import LimitedVector2Stack from './utilities/LimitedVector2Stack';

export default class Pointer
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
