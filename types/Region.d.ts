import { Vector2 } from './Vector2';
declare class Region {
    bounds: any;
    dom_element: any;
    observer: any;
    region_element: any;
    constructor(region_element: any);
    update(): void;
    check_for_legal_bounds(): void;
    transform_pos_to_subregion(pos: any): Vector2;
    transform_pos_to_NDC(pos: any): Vector2;
    transform_dir_to_NDC(dir: any): any;
}
export { Region };
