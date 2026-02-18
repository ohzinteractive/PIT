import { Vector2 } from '../Vector2';
import { LimitedStack } from './LimitedStack';
declare class LimitedVector2Stack extends LimitedStack {
    average: Vector2;
    constructor(max_size?: number);
    set_from_stack(vector2_stack: LimitedVector2Stack): void;
    push(elem: Vector2): void;
    update_average(): void;
}
export { LimitedVector2Stack };
