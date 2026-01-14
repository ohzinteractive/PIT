declare class Pointer {
    down: any;
    id: any;
    position_array: any;
    pressed: any;
    previous_position_array: any;
    region: any;
    released: any;
    constructor(id: any, x: any, y: any, region: any);
    get position(): any;
    get position_delta(): any;
    get previous_position(): any;
    get NDC(): any;
    get NDC_delta(): any;
    distance_to(pointer: any): any;
    previous_distance_to(pointer: any): any;
    set_position(x: any, y: any): void;
    reset_previous_position(): void;
}
export { Pointer };
