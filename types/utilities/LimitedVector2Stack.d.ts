import { LimitedStack } from './LimitedStack';
declare class LimitedVector2Stack extends LimitedStack {
    average: any;
    constructor(max_size?: number);
    set_from_stack(vector2_stack: any): void;
    push(elem: any): void;
    update_average(): void;
}
export { LimitedVector2Stack };
