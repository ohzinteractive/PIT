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

export { LimitedStack };
