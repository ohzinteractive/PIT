import LimitedStack from './LimitedStack';
import { Vector2 } from '../Vector2';

export default class LimitedVector2Stack extends LimitedStack
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
