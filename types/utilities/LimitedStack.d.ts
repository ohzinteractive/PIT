declare class LimitedStack {
    array: any;
    max_size: any;
    constructor(max_size?: number);
    get_first(): any;
    length(): any;
    set_from_stack(stack: any): void;
    push(elem: any): void;
}
export { LimitedStack };
