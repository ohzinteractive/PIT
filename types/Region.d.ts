import type { Rect } from './Rect';
import { Vector2 } from './Vector2';
declare class Region {
    bounds: Rect;
    dom_element: HTMLElement;
    observer: IntersectionObserver;
    region_element: HTMLElement;
    constructor(region_element: HTMLElement);
    update(): void;
    check_for_legal_bounds(): void;
    transform_pos_to_subregion(pos: Vector2): Vector2;
    transform_pos_to_NDC(pos: Vector2): Vector2;
    transform_dir_to_NDC(dir: Vector2): Vector2;
}
export { Region };
