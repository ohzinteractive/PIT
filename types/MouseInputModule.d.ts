import { Pointer } from './Pointer';
import type { Region } from './Region';
import { Vector2 } from './Vector2';
declare class MouseInputModule {
    left_mouse_button_down: boolean;
    left_mouse_button_pressed: boolean;
    left_mouse_button_released: boolean;
    middle_mouse_button_down: boolean;
    middle_mouse_button_pressed: boolean;
    middle_mouse_button_released: boolean;
    pointer: Pointer;
    pointer_pos: {
        x: number;
        y: number;
    };
    pointers: Pointer[];
    previous_pointer_pos: {
        x: number;
        y: number;
    };
    region: any;
    right_mouse_button_down: boolean;
    right_mouse_button_pressed: boolean;
    right_mouse_button_released: boolean;
    scroll_delta: number;
    constructor(region: Region);
    get_primary_pointer(): Pointer;
    get_pointer(index: number): Pointer;
    get pointer_count(): number;
    get is_touchscreen(): boolean;
    get pointer_center(): Vector2;
    get pointer_center_NDC(): Vector2;
    get pointer_center_NDC_delta(): Vector2;
    get pointer_center_delta(): Vector2;
    pointer_down(event: MouseEvent): void;
    pointer_up(event: MouseEvent): void;
    pointer_move(event: MouseEvent): void;
    pointer_cancel(event: MouseEvent): void;
    pointer_out(event: MouseEvent): void;
    scroll(event: WheelEvent): void;
    get zoom_delta(): number;
    clear(): void;
    get pointer_pos_delta(): Vector2;
    update_previous_pointer_pos(): void;
}
export { MouseInputModule };
