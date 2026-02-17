'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    Vector2.prototype.clone = function () {
        // @ts-expect-error TS(2351): This expression is not constructable.
        return new this.constructor(this.x, this.y);
    };
    Vector2.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    Vector2.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    Vector2.prototype.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    Vector2.prototype.multiplyScalar = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    };
    Vector2.prototype.divide = function (v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    };
    Vector2.prototype.divideScalar = function (scalar) {
        return this.multiplyScalar(1 / scalar);
    };
    Vector2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector2.prototype.cross = function (v) {
        return this.x * v.y - this.y * v.x;
    };
    Vector2.prototype.lengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    Vector2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2.prototype.normalize = function () {
        return this.divideScalar(this.length() || 1);
    };
    Vector2.prototype.angle = function () {
        // computes the angle in radians with respect to the positive x-axis
        var angle = Math.atan2(-this.y, -this.x) + Math.PI;
        return angle;
    };
    Vector2.prototype.distanceTo = function (v) {
        return Math.sqrt(this.distanceToSquared(v));
    };
    Vector2.prototype.distanceToSquared = function (v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        return dx * dx + dy * dy;
    };
    Vector2.prototype.lerp = function (v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        return this;
    };
    Vector2.isVector2 = true;
    return Vector2;
}());

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var LimitedStack = /** @class */ (function () {
    function LimitedStack(max_size) {
        if (max_size === void 0) { max_size = 1; }
        this.max_size = max_size;
        this.array = [];
    }
    LimitedStack.prototype.get_first = function () {
        return this.array[0];
    };
    LimitedStack.prototype.length = function () {
        return this.array.length();
    };
    LimitedStack.prototype.set_from_stack = function (stack) {
        for (var i = 0; i < this.array.length; i++) {
            this.array[i] = stack.array[i];
        }
    };
    LimitedStack.prototype.push = function (elem) {
        this.array.unshift(elem);
        if (this.array.length > this.max_size) {
            this.array.pop();
        }
    };
    return LimitedStack;
}());

var LimitedVector2Stack = /** @class */ (function (_super) {
    __extends(LimitedVector2Stack, _super);
    function LimitedVector2Stack(max_size) {
        if (max_size === void 0) { max_size = 1; }
        var _this = _super.call(this, max_size) || this;
        _this.average = new Vector2();
        return _this;
    }
    LimitedVector2Stack.prototype.set_from_stack = function (vector2_stack) {
        for (var i = 0; i < this.array.length; i++) {
            this.array[i].copy(vector2_stack.array[i]);
        }
        this.update_average();
    };
    LimitedVector2Stack.prototype.push = function (elem) {
        _super.prototype.push.call(this, elem);
        this.update_average();
    };
    LimitedVector2Stack.prototype.update_average = function () {
        this.average.set(0, 0);
        for (var i = 0; i < this.array.length; i++) {
            this.average.add(this.array[i]);
        }
        this.average.divideScalar(Math.max(1, this.array.length));
    };
    return LimitedVector2Stack;
}(LimitedStack));

// import Logger from './utilities/Logger';
var Pointer = /** @class */ (function () {
    function Pointer(id, x, y, region) {
        this.region = region;
        this.id = id;
        this.position_array = new LimitedVector2Stack(5);
        this.previous_position_array = new LimitedVector2Stack(5);
        this.position_array.push(new Vector2(x, y));
        this.previous_position_array.push(new Vector2(x, y));
        this.pressed = true;
        this.down = true;
        this.released = false;
    }
    Object.defineProperty(Pointer.prototype, "position", {
        get: function () {
            return this.position_array.get_first().clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pointer.prototype, "position_delta", {
        get: function () {
            return this.position.sub(this.previous_position);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pointer.prototype, "previous_position", {
        get: function () {
            return this.previous_position_array.get_first();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pointer.prototype, "NDC", {
        get: function () {
            return this.region.transform_pos_to_NDC(this.position);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pointer.prototype, "NDC_delta", {
        get: function () {
            var delta = this.region.transform_dir_to_NDC(this.position_delta);
            delta.y *= -1;
            return delta;
        },
        enumerable: false,
        configurable: true
    });
    Pointer.prototype.distance_to = function (pointer) {
        return this.position_array.average.distanceTo(pointer.position_array.average);
    };
    Pointer.prototype.previous_distance_to = function (pointer) {
        return this.previous_position_array.average.distanceTo(pointer.previous_position_array.average);
    };
    Pointer.prototype.set_position = function (x, y) {
        this.previous_position_array.push(this.position_array.get_first().clone());
        this.position_array.push(new Vector2(x, y));
    };
    Pointer.prototype.reset_previous_position = function () {
        this.previous_position_array.push(this.position_array.get_first().clone());
        this.position_array.push(this.position_array.get_first().clone());
    };
    return Pointer;
}());

var MathUtilities = /** @class */ (function () {
    function MathUtilities() {
    }
    MathUtilities.clamp = function (value, min, max) {
        return Math.max(min, Math.min(max, value));
    };
    MathUtilities.is_int = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return MathUtilities;
}());

var OS = /** @class */ (function () {
    function OS() {
    }
    OS.prototype.init = function () {
        this.operating_systems = {
            ANDROID: 'android',
            IOS: 'ios',
            LINUX: 'linux',
            MAC: 'mac',
            WINDOWS: 'windows'
        };
        this.is_mobile = !!(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/));
        this.is_ipad = !!(navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
        this.is_ios = !!navigator.userAgent.match(/(iPhone|iPod|iPad)/) || this.is_ipad;
        this.is_android = this.get_os() === this.operating_systems.ANDROID;
        this.is_linux = this.get_os() === this.operating_systems.LINUX;
        this.is_mac = this.get_os() === this.operating_systems.MAC;
        this.is_windows = this.get_os() === this.operating_systems.WINDOWS;
    };
    OS.prototype.get_os = function () {
        var userAgent = window.navigator.userAgent;
        var platform = window.navigator.platform;
        var macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
        var windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
        var iosPlatforms = ['iPhone', 'iPad', 'iPod'];
        var os = null;
        if (macosPlatforms.indexOf(platform) !== -1) {
            os = this.operating_systems.MAC;
        }
        else if (iosPlatforms.indexOf(platform) !== -1) {
            os = this.operating_systems.IOS;
        }
        else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = this.operating_systems.WINDOWS;
        }
        else if (/Android/.test(userAgent)) {
            os = this.operating_systems.ANDROID;
        }
        else if (!os && /Linux/.test(platform)) {
            os = this.operating_systems.LINUX;
        }
        return os;
    };
    return OS;
}());
var os = new OS();

var MouseInputModule = /** @class */ (function () {
    function MouseInputModule(region) {
        this.region = region;
        this.left_mouse_button_pressed = false;
        this.left_mouse_button_down = false;
        this.left_mouse_button_released = false;
        this.right_mouse_button_pressed = false;
        this.right_mouse_button_down = false;
        this.right_mouse_button_released = false;
        this.middle_mouse_button_pressed = false;
        this.middle_mouse_button_down = false;
        this.middle_mouse_button_released = false;
        this.pointer_pos = { x: 0, y: 0 };
        this.previous_pointer_pos = { x: 0, y: 0 };
        this.pointer = new Pointer(9999, 0, 0, region);
        this.pointer.pressed = false;
        this.pointer.down = false;
        this.pointer.released = false;
        this.pointers = [this.pointer];
        this.scroll_delta = 0;
    }
    MouseInputModule.prototype.get_primary_pointer = function () {
        return this.pointer;
    };
    MouseInputModule.prototype.get_pointer = function (index) {
        var pointer = new Pointer(index, this.pointer.position.x, this.pointer.position.y, this.pointer.region);
        pointer.position_array.set_from_stack(this.pointer.position_array);
        pointer.previous_position_array.set_from_stack(this.pointer.previous_position_array);
        if (index === 0) {
            pointer.pressed = this.left_mouse_button_pressed;
            pointer.down = this.left_mouse_button_down;
            pointer.released = this.left_mouse_button_released;
        }
        if (index === 1) {
            pointer.pressed = this.right_mouse_button_pressed;
            pointer.down = this.right_mouse_button_down;
            pointer.released = this.right_mouse_button_released;
        }
        if (index === 2) {
            pointer.pressed = this.middle_mouse_button_pressed;
            pointer.down = this.middle_mouse_button_down;
            pointer.released = this.middle_mouse_button_released;
        }
        return pointer;
    };
    Object.defineProperty(MouseInputModule.prototype, "pointer_count", {
        get: function () {
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MouseInputModule.prototype, "is_touchscreen", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MouseInputModule.prototype, "pointer_center", {
        get: function () {
            return this.pointer.position;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MouseInputModule.prototype, "pointer_center_NDC", {
        get: function () {
            return this.pointer.NDC;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MouseInputModule.prototype, "pointer_center_NDC_delta", {
        get: function () {
            return this.pointer.NDC_delta;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MouseInputModule.prototype, "pointer_center_delta", {
        get: function () {
            return this.pointer.position_delta;
        },
        enumerable: false,
        configurable: true
    });
    MouseInputModule.prototype.pointer_down = function (event) {
        // this.pointer_pos.x = event.clientX;
        // this.pointer_pos.y = event.clientY;
        this.pointer.set_position(event.clientX, event.clientY);
        // this.previous_pointer_pos.x = event.clientX;
        // this.previous_pointer_pos.y = event.clientY;
        switch (event.button) {
            case 0:
                this.left_mouse_button_pressed = true;
                this.left_mouse_button_down = true;
                this.pointer.pressed = true;
                this.pointer.down = true;
                break;
            case 1:
                this.middle_mouse_button_pressed = true;
                this.middle_mouse_button_down = true;
                break;
            case 2:
                this.right_mouse_button_pressed = true;
                this.right_mouse_button_down = true;
                break;
        }
    };
    MouseInputModule.prototype.pointer_up = function (event) {
        switch (event.button) {
            case 0:
                this.left_mouse_button_released = true;
                this.left_mouse_button_down = false;
                this.pointer.released = true;
                this.pointer.down = false;
                break;
            case 1:
                this.middle_mouse_button_released = true;
                this.middle_mouse_button_down = false;
                break;
            case 2:
                this.right_mouse_button_released = true;
                this.right_mouse_button_down = false;
                break;
        }
    };
    MouseInputModule.prototype.pointer_move = function (event) {
        this.pointer.set_position(event.clientX, event.clientY);
    };
    MouseInputModule.prototype.pointer_cancel = function (event) {
        this.pointer_out(event);
    };
    MouseInputModule.prototype.pointer_out = function (event) {
        if (this.left_mouse_button_down) {
            this.left_mouse_button_down = false;
            this.left_mouse_button_released = true;
            this.pointer.down = false;
            this.pointer.released = true;
        }
        if (this.middle_mouse_button_down) {
            this.middle_mouse_button_down = false;
            this.middle_mouse_button_released = true;
        }
        if (this.right_mouse_button_down) {
            this.right_mouse_button_down = false;
            this.right_mouse_button_released = true;
        }
    };
    MouseInputModule.prototype.scroll = function (event) {
        this.pointer.set_position(event.clientX, event.clientY);
        if (os.is_mac) {
            // User is pinching
            if (event.ctrlKey) ;
            else {
                // User is using the touchpad
                if (MathUtilities.is_int(event.deltaY)) {
                    // Negative values means scroll up
                    // Positive values means scroll down
                    // console.log("Scrolling with a touchpad", (event.deltaY))
                    // 350 is aprox the maximum value of deltaY on touchpad scroll
                    this.scroll_delta = MathUtilities.clamp(event.deltaY / 350, -1, 1) * -1;
                }
                else {
                    // Negative values means scroll up
                    // Positive values means scroll down
                    // console.log("Scrolling with a mouse", event.deltaY)
                    this.scroll_delta = event.deltaY / Math.abs(event.deltaY);
                }
            }
        }
        else {
            // probably windows
            if (Math.abs(event.deltaY) < 0.0001) {
                this.scroll_delta = 0;
            }
            else {
                this.scroll_delta = event.deltaY / Math.abs(event.deltaY);
            }
        }
    };
    Object.defineProperty(MouseInputModule.prototype, "zoom_delta", {
        get: function () {
            return this.scroll_delta;
        },
        enumerable: false,
        configurable: true
    });
    MouseInputModule.prototype.clear = function () {
        this.left_mouse_button_pressed = false;
        this.left_mouse_button_released = false;
        this.pointer.pressed = false;
        this.pointer.released = false;
        this.right_mouse_button_pressed = false;
        this.right_mouse_button_released = false;
        this.middle_mouse_button_pressed = false;
        this.middle_mouse_button_released = false;
        this.scroll_delta = 0;
        this.update_previous_pointer_pos();
    };
    Object.defineProperty(MouseInputModule.prototype, "pointer_pos_delta", {
        get: function () {
            return this.pointer.position_delta;
        },
        enumerable: false,
        configurable: true
    });
    MouseInputModule.prototype.update_previous_pointer_pos = function () {
        this.pointer.reset_previous_position();
    };
    return MouseInputModule;
}());

var Region = /** @class */ (function () {
    function Region(region_element) {
        var _this = this;
        this.region_element = region_element;
        this.bounds = {
            x: 0,
            y: 0,
            width: 1,
            height: 1
        };
        this.observer = new IntersectionObserver(function (entries) {
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var entry = entries_1[_i];
                var bounds = entry.boundingClientRect;
                _this.bounds.x = bounds.left;
                _this.bounds.y = bounds.top;
                _this.bounds.width = bounds.width;
                _this.bounds.height = bounds.height;
            }
            _this.observer.disconnect();
        });
    }
    Region.prototype.update = function () {
        this.observer.observe(this.region_element);
    };
    Region.prototype.check_for_legal_bounds = function () {
        if (this.bounds.width === 0 || this.bounds.height === 0) {
            console.error('Cannot get normalized mouse position for target element due to the element having 0 width or height', this.dom_element, this.bounds);
        }
    };
    Region.prototype.transform_pos_to_subregion = function (pos) {
        var vec = new Vector2();
        vec.copy(pos);
        vec.x -= this.bounds.x;
        vec.y -= this.bounds.y;
        return vec;
    };
    Region.prototype.transform_pos_to_NDC = function (pos) {
        this.check_for_legal_bounds();
        var vec = this.transform_pos_to_subregion(pos);
        vec.x = (vec.x / this.bounds.width) * 2 - 1;
        vec.y = (1 - (vec.y / this.bounds.height)) * 2 - 1;
        return vec;
    };
    Region.prototype.transform_dir_to_NDC = function (dir) {
        var vec = new Vector2();
        vec.copy(dir);
        dir.x /= this.bounds.width;
        dir.y /= this.bounds.height;
        return dir;
    };
    return Region;
}());

// import Logger from './utilities/Logger';
var TouchInputModule = /** @class */ (function () {
    function TouchInputModule(region) {
        this.region = region;
        this.left_mouse_button_pressed = false;
        this.left_mouse_button_down = false;
        this.left_mouse_button_released = false;
        this.pointers = [];
        this.previous_separation_distance = undefined;
        this.zoom_delta = 0;
        this.previous_primary_pointer_pos = new Vector2();
        this.default_pointer = new Pointer(-5, 0, 0, region);
        // this.update_pointer(7, 5, 5)
        // this.update_pointer(6, 5, 5)
        // this.update_pointer(5, 5, 5)
        // console.log(this.pointer_pos_delta)
        // this.remove_pointer(7)
        // const p = this.pointers.find(p => this.is_primary_pointer(p));
        // console.log(p)
        // this.update_pointer(5, 10, 5)
        // this.update_pointer(6, 20, 20)
        // this.update_pointer(6, 25, 25)
        // this.pointers[0].distance_to(this.pointers[1])
    }
    TouchInputModule.prototype.get_pointer = function (i) {
        if (this.pointers[i] !== undefined) {
            return this.pointers[i];
        }
        else {
            return this.default_pointer;
        }
    };
    Object.defineProperty(TouchInputModule.prototype, "is_touchscreen", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TouchInputModule.prototype, "scroll_delta", {
        get: function () {
            if (this.pointers.length > 0) {
                return this.get_primary_pointer().position_delta.y * 0.03;
            }
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    TouchInputModule.prototype.get_primary_pointer = function () {
        return this.get_pointer(0);
    };
    Object.defineProperty(TouchInputModule.prototype, "pointer_pos_delta", {
        get: function () {
            var position = new Vector2();
            for (var i = 0; i < this.pointers.length; i++) {
                position.add(this.pointers[i].position_delta());
            }
            position.divideScalar(Math.max(1, this.pointers.length));
            return position;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TouchInputModule.prototype, "pointer_count", {
        get: function () {
            return this.pointers.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TouchInputModule.prototype, "pointer_center", {
        get: function () {
            var center = new Vector2();
            for (var i = 0; i < this.pointers.length; i++) {
                center.add(this.pointers[i].position);
            }
            center.divideScalar(Math.max(1, this.pointers.length));
            return center;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TouchInputModule.prototype, "previous_pointer_center", {
        get: function () {
            var center = new Vector2();
            for (var i = 0; i < this.pointers.length; i++) {
                center.add(this.pointers[i].previous_position);
            }
            center.divideScalar(Math.max(1, this.pointers.length));
            return center;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TouchInputModule.prototype, "pointer_center_NDC", {
        get: function () {
            var center = this.pointer_center;
            return this.region.transform_pos_to_NDC(center);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TouchInputModule.prototype, "previous_pointer_center_NDC", {
        get: function () {
            var center = this.previous_pointer_center;
            return this.region.transform_pos_to_NDC(center);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TouchInputModule.prototype, "pointer_center_delta", {
        get: function () {
            var current_center = this.pointer_center;
            var prev_center = this.previous_pointer_center;
            return current_center.clone().sub(prev_center);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TouchInputModule.prototype, "pointer_center_NDC_delta", {
        get: function () {
            var center = this.pointer_center_NDC;
            var prev_center = this.previous_pointer_center_NDC;
            return center.sub(prev_center);
        },
        enumerable: false,
        configurable: true
    });
    TouchInputModule.prototype.update_pointer_separation = function () {
        if (this.pointers.length === 2) {
            var p0 = this.pointers[0];
            var p1 = this.pointers[1];
            var distance = p0.distance_to(p1);
            var previous_distance = p0.previous_distance_to(p1);
            if (this.previous_separation_distance === undefined) {
                this.previous_separation_distance = distance;
            }
            var sensitivity = 0.1;
            this.zoom_delta = -(distance - previous_distance) * sensitivity;
            this.previous_separation_distance = distance;
        }
        else {
            this.previous_separation_distance = undefined;
            this.zoom_delta = 0;
        }
    };
    TouchInputModule.prototype.pointers_moving_away_from_each_other = function () {
        if (this.pointers.length !== 2) {
            return false;
        }
    };
    TouchInputModule.prototype.update_pointer = function (pointer_id, x, y) {
        var p = this.pointers.find(function (pointer) { return pointer.id === pointer_id; });
        if (p === undefined) {
            p = new Pointer(pointer_id, x, y, this.region);
            this.pointers.push(p);
        }
        else {
            p.set_position(x, y);
        }
        if (this.is_primary_pointer(p)) {
            this.previous_primary_pointer_pos.x = p.position.x;
            this.previous_primary_pointer_pos.y = p.position.y;
        }
        this.default_pointer.set_position(p.position.x, p.position.y);
        this.update_pointer_separation();
        // console.log(p)
        return p;
    };
    TouchInputModule.prototype.remove_pointer = function (pointer_id) {
        var index = this.pointers.findIndex(function (p) { return p.id === pointer_id; });
        if (index !== undefined) {
            this.pointers.splice(index, 1);
        }
        this.update_pointer_separation();
    };
    TouchInputModule.prototype.is_primary_pointer = function (pointer) {
        return this.pointers[0] === pointer;
    };
    TouchInputModule.prototype.pointer_down = function (event) {
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            var p = this.update_pointer(touch.identifier, touch.clientX, touch.clientY);
            if (this.is_primary_pointer(p)) {
                this.left_mouse_button_pressed = true;
                this.left_mouse_button_down = true;
            }
        }
    };
    TouchInputModule.prototype.pointer_up = function (event) {
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            var p = this.update_pointer(touch.identifier, touch.clientX, touch.clientY);
            p.released = true;
            if (this.is_primary_pointer(p)) {
                this.left_mouse_button_released = true;
                this.left_mouse_button_down = false;
            }
            this.remove_pointer(p.id);
        }
    };
    TouchInputModule.prototype.pointer_move = function (event) {
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            this.update_pointer(touch.identifier, touch.clientX, touch.clientY);
        }
    };
    TouchInputModule.prototype.pointer_cancel = function (event) {
        this.pointer_out(event);
    };
    TouchInputModule.prototype.pointer_out = function (event) {
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            var p = this.update_pointer(touch.identifier, touch.clientX, touch.clientY);
            p.released = true;
            p.down = false;
            if (this.left_mouse_button_down && this.is_primary_pointer(p)) {
                this.left_mouse_button_down = false;
                this.left_mouse_button_released = true;
            }
            this.remove_pointer(p.id);
        }
    };
    TouchInputModule.prototype.clear = function () {
        this.left_mouse_button_pressed = false;
        this.left_mouse_button_released = false;
        this.zoom_delta = 0;
        for (var i = 0; i < this.pointers.length; i++) {
            this.pointers[i].reset_previous_position();
            this.pointers[i].pressed = false;
        }
    };
    return TouchInputModule;
}());

var InputController = /** @class */ (function () {
    function InputController() {
    }
    InputController.prototype.init = function (dom_element, sub_region_element) {
        this.dom_element = dom_element;
        this.sub_region_element = sub_region_element === undefined ? dom_element : sub_region_element;
        this.region = new Region(this.sub_region_element);
        this.mouse_input_module = new MouseInputModule(this.region);
        this.touch_input_module = new TouchInputModule(this.region);
        this.active_input_module = this.mouse_input_module;
        // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
        this.touch_cooldown = new Date() - 1000;
        os.init();
        this.bind_events();
    };
    InputController.prototype.bind_events = function () {
        this.__binded_on_wheel = this.on_wheel.bind(this);
        this.dom_element.addEventListener('wheel', this.__binded_on_wheel, { passive: true });
        this.__binded_on_touchstart = this.on_touchstart.bind(this);
        this.dom_element.addEventListener('touchstart', this.__binded_on_touchstart, { passive: true });
        this.__binded_on_touchmove = this.on_touchmove.bind(this);
        this.dom_element.addEventListener('touchmove', this.__binded_on_touchmove, { passive: true });
        this.__binded_on_touchcancel = this.on_touchcancel.bind(this);
        this.dom_element.addEventListener('touchcancel', this.__binded_on_touchcancel, { passive: true });
        this.__binded_on_touchend = this.on_touchend.bind(this);
        this.dom_element.addEventListener('touchend', this.__binded_on_touchend, { passive: true });
        this.__binded_on_mousedown = this.on_mousedown.bind(this);
        this.dom_element.addEventListener('mousedown', this.__binded_on_mousedown, false);
        this.__binded_on_mousemove = this.on_mousemove.bind(this);
        this.dom_element.addEventListener('mousemove', this.__binded_on_mousemove, false);
        this.__binded_on_mouseup = this.on_mouseup.bind(this);
        this.dom_element.addEventListener('mouseup', this.__binded_on_mouseup, false);
        this.__binded_on_mouseleave = this.on_mouseleave.bind(this);
        this.dom_element.addEventListener('mouseleave', this.__binded_on_mouseleave, false);
    };
    InputController.prototype.unbind_events = function () {
        this.dom_element.removeEventListener('wheel', this.__binded_on_wheel, { passive: true });
        this.dom_element.removeEventListener('touchstart', this.__binded_on_touchstart, { passive: true });
        this.dom_element.removeEventListener('touchmove', this.__binded_on_touchmove, { passive: true });
        this.dom_element.removeEventListener('touchcancel', this.__binded_on_touchcancel, { passive: true });
        this.dom_element.removeEventListener('touchend', this.__binded_on_touchend, { passive: true });
        this.dom_element.removeEventListener('mousedown', this.__binded_on_mousedown, false);
        this.dom_element.removeEventListener('mousemove', this.__binded_on_mousemove, false);
        this.dom_element.removeEventListener('mouseup', this.__binded_on_mouseup, false);
        this.dom_element.removeEventListener('mouseleave', this.__binded_on_mouseleave, false);
    };
    InputController.prototype.on_wheel = function (event) {
        this.mouse_input_module.scroll(event);
        this.set_mouse_input_active();
    };
    InputController.prototype.on_touchstart = function (event) {
        this.touch_input_module.pointer_down(event);
        this.set_touch_input_active();
    };
    InputController.prototype.on_touchmove = function (event) {
        this.touch_input_module.pointer_move(event);
        this.set_touch_input_active();
    };
    InputController.prototype.on_touchcancel = function (event) {
        this.touch_input_module.pointer_cancel(event);
        this.set_touch_input_active();
    };
    InputController.prototype.on_touchend = function (event) {
        this.touch_input_module.pointer_up(event);
        this.set_touch_input_active();
    };
    InputController.prototype.on_mousedown = function (event) {
        if (this.mouse_input_allowed()) {
            this.mouse_input_module.pointer_down(event);
            this.set_mouse_input_active();
        }
    };
    InputController.prototype.on_mousemove = function (event) {
        if (this.mouse_input_allowed()) {
            this.mouse_input_module.pointer_move(event);
            this.set_mouse_input_active();
        }
    };
    InputController.prototype.on_mouseup = function (event) {
        if (this.mouse_input_allowed()) {
            this.mouse_input_module.pointer_up(event);
            this.set_mouse_input_active();
        }
    };
    InputController.prototype.on_mouseleave = function (event) {
        this.mouse_input_module.pointer_out(event);
        this.set_mouse_input_active();
    };
    InputController.prototype.clear = function () {
        this.region.update();
        this.touch_input_module.clear();
        this.mouse_input_module.clear();
    };
    InputController.prototype.mouse_input_allowed = function () {
        // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
        return (new Date() - this.touch_cooldown) / 1000 > 0.75;
    };
    InputController.prototype.set_mouse_input_active = function () {
        this.active_input_module = this.mouse_input_module;
    };
    InputController.prototype.set_touch_input_active = function () {
        this.active_input_module = this.touch_input_module;
        this.touch_cooldown = new Date();
    };
    Object.defineProperty(InputController.prototype, "left_mouse_button_pressed", {
        get: function () {
            return this.active_input_module.left_mouse_button_pressed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "left_mouse_button_down", {
        get: function () {
            return this.active_input_module.left_mouse_button_down;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "left_mouse_button_released", {
        get: function () {
            return this.active_input_module.left_mouse_button_released;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "right_mouse_button_pressed", {
        get: function () {
            return this.mouse_input_module.right_mouse_button_pressed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "right_mouse_button_down", {
        get: function () {
            return this.mouse_input_module.right_mouse_button_down;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "right_mouse_button_released", {
        get: function () {
            return this.mouse_input_module.right_mouse_button_released;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "middle_mouse_button_pressed", {
        get: function () {
            return this.mouse_input_module.middle_mouse_button_pressed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "middle_mouse_button_down", {
        get: function () {
            return this.mouse_input_module.middle_mouse_button_down;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "middle_mouse_button_released", {
        get: function () {
            return this.mouse_input_module.middle_mouse_button_released;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "is_touchscreen", {
        get: function () {
            return this.active_input_module.is_touchscreen;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "scroll_delta", {
        get: function () {
            return this.active_input_module.scroll_delta;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "zoom_delta", {
        get: function () {
            return this.active_input_module.zoom_delta;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "pointer_count", {
        get: function () {
            return this.active_input_module.pointer_count;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "pointer_is_within_bounds", {
        get: function () {
            var ndc = this.NDC;
            return ndc.x >= -1 && ndc.x <= 1 &&
                ndc.y >= -1 && ndc.y <= 1;
        },
        enumerable: false,
        configurable: true
    });
    InputController.prototype.pointer_is_over_element = function (elem) {
        var rect = elem.getBoundingClientRect();
        var pos = this.pointer_pos;
        return pos.x > rect.left &&
            pos.x < rect.left + rect.width &&
            pos.y > rect.top &&
            pos.y < rect.top + rect.height;
    };
    Object.defineProperty(InputController.prototype, "pointers", {
        get: function () {
            return this.active_input_module.pointers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "pointer_pos", {
        get: function () {
            return this.get_pointer_pos(0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "pointer_pos_delta", {
        get: function () {
            return this.get_pointer_pos_delta(0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "NDC", {
        get: function () {
            return this.get_pointer_NDC(0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "NDC_delta", {
        get: function () {
            return this.get_pointer_NDC_delta(0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "pointer_center", {
        get: function () {
            return this.active_input_module.pointer_center;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "pointer_center_delta", {
        get: function () {
            return this.active_input_module.pointer_center_delta;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "pointer_center_NDC", {
        get: function () {
            return this.active_input_module.pointer_center_NDC;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputController.prototype, "pointer_center_NDC_delta", {
        get: function () {
            return this.active_input_module.pointer_center_NDC_delta;
        },
        enumerable: false,
        configurable: true
    });
    InputController.prototype.get_pointer_pos = function (index) {
        if (index === void 0) { index = 0; }
        return this.active_input_module.get_pointer(index).position;
    };
    InputController.prototype.get_pointer_pos_delta = function (index) {
        if (index === void 0) { index = 0; }
        return this.active_input_module.get_pointer(index).position_delta;
    };
    InputController.prototype.get_pointer_NDC = function (index) {
        if (index === void 0) { index = 0; }
        return this.active_input_module.get_pointer(index).NDC;
    };
    InputController.prototype.get_pointer_NDC_delta = function (index) {
        if (index === void 0) { index = 0; }
        return this.active_input_module.get_pointer(index).NDC_delta;
    };
    InputController.prototype.dispose = function () {
        this.unbind_events();
    };
    return InputController;
}());

exports.InputController = InputController;
exports.Vector2 = Vector2;
//# sourceMappingURL=PIT.js.map
