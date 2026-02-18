import type { Vector2 } from "../index";
declare class LimitedStack {
    array: Vector2[];
    max_size: number;
    constructor(max_size?: number);
    get_first(): Vector2;
    length(): number;
    set_from_stack(stack: LimitedStack): void;
    push(elem: Vector2): void;
}
export { LimitedStack };
