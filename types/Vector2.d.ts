declare class Vector2 {
    x: any;
    y: any;
    static isVector2: boolean;
    constructor(x?: number, y?: number);
    set(x: any, y: any): this;
    clone(): any;
    copy(v: any): this;
    add(v: any): this;
    sub(v: any): this;
    multiplyScalar(scalar: any): this;
    divide(v: any): this;
    divideScalar(scalar: any): this;
    dot(v: any): number;
    cross(v: any): number;
    lengthSq(): number;
    length(): number;
    normalize(): this;
    angle(): number;
    distanceTo(v: any): number;
    distanceToSquared(v: any): number;
    lerp(v: any, alpha: any): this;
}
export { Vector2 };
