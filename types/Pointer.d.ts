import type { Region } from './Region';
import { Vector2 } from './Vector2';
import { LimitedVector2Stack } from './utilities/LimitedVector2Stack';
declare class Pointer {
    down: boolean;
    id: number;
    position_array: LimitedVector2Stack;
    pressed: boolean;
    previous_position_array: LimitedVector2Stack;
    region: Region;
    released: boolean;
    constructor(id: number, x: number, y: number, region: Region);
    get position(): Vector2;
    get position_delta(): Vector2;
    get previous_position(): Vector2;
    get NDC(): Vector2;
    get NDC_delta(): Vector2;
    distance_to(pointer: Pointer): number;
    previous_distance_to(pointer: Pointer): number;
    set_position(x: number, y: number): void;
    reset_previous_position(): void;
}
export { Pointer };
