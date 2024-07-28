# Pollable InpuT



PIT is a tiny javascript library (made mainly to be used with WebGL applications) that allows you to check for input in a pollable manner.

It is common in websites to handle input in an event-based way, but sometimes for highly interactive applications that have an update loop running every frame it is a lot easier to check for input instead of juggling around with the events.

Currently PIT supports the following:

  - Mouse and touch support through a (mostly) unified interface
  - Query mouse/touch position
  - Query mouse/touch normalized position (the position in the range [-1..1])
  - Check for mouse buttons (left right middle)
  - Scroll for mouse and touch (mapped to wheel mouse and one finger drag respectively)
  - Zoom for mouse and touch (mapped to wheel mouse and two finger pinch respectively)
  - Query amount of active pointers (for mouse always 1 if any button is pressed)
  - Allows to define a subregion that will be used to compute position coordinates


### Dependencies

PIT has no external dependencies

### Installation

```sh
$ npm install pit-js --save
```


### Usage

```sh
import {InputController} from 'pit-js'

let input = new InputController();
input.init(document.body); //element to listen events on

let animate = function () {

  if(input.left_mouse_button_pressed) // on mobile left mouse button represents the primary touch
    console.log('pressed')

  if(input.left_mouse_button_down)
    console.log('down')

  if(input.left_mouse_button_released)
    console.log('released')

  console.log("pointer_pos", input.pointer_pos) // on desktop this is mouse position, on mobile this will represent the primary touch position
  console.log("normalized pointer pos", input.NDC) // NDC stands for normalized device coordinates


  input.clear(); // call this to prepare for next frame
  requestAnimationFrame( animate ); // must be after the .clear()

};

animate();
```

### Features

The API provides the following accesible properties

```sh
let input = new InputController(dom_element, subregion_dom_element)
// dom_element will be the main element onto which the events will be hooked into.
// If a subregion_dom_element is provided, then the NDC coordinates will be reported relative to
// that space. This will allow you to keep moving the mouse outside the area of interest
// while still receiving events of the parent element. Notice that if the mouse goes outside
// of the subregion, the NDC coordinates will also be outside the [-1..1] range.


input.left_mouse_button_pressed       //boolean, works for left mouse button or first touch on the screen (primary touch)
input.left_mouse_button_down          //boolean, works for left mouse button or first touch on the screen (primary touch)
input.left_mouse_button_released      //boolean, works for left mouse button or first touch on the screen (primary touch)

input.right_mouse_button_pressed      //boolean, mouse only
input.right_mouse_button_down         //boolean, mouse only
input.right_mouse_button_released     //boolean, mouse only

input.middle_mouse_button_pressed     //boolean, mouse only
input.middle_mouse_button_down        //boolean, mouse only
input.middle_mouse_button_released    //boolean, mouse only

input.pointer_pos                     //{x,y} screen coordinates of the mouse (or primary touch) position
input.pointer_pos_delta               //{x,y} difference between previous position and current position.
input.NDC                             //{x,y} [-1..1] normalized device coordinates for mouse or primary touch
input.NDC_delta                       //{x,y} [-1..1] difference between previous normalized position and current normalized position

input.pointer_center                  //{x,y} the center of all active touches. If using mouse, this is the same as pointer_pos
input.pointer_center_delta            //{x,y} the center of all active touches. If using mouse, this is the same as pointer_pos
input.pointer_center_NDC              //{x,y} [-1..1] the center of all active touches. If using mouse, this is the same as pointer_pos
input.pointer_center_NDC_delta        //{x,y} [-1..1] difference between previous normalized center and current one


input.scroll_delta                    //float - this is equivalent to the mouse wheel (-1, 0, 1) or dragging with one finger [-x..x] measured in pixels
input.zoom_delta                      // float - this is equivalent to the mouse wheel (-1, 0, 1) or pinching with two fingers [-x..x] measured in pixels
input.pointer_count                   //int - returns 1 if any mouse button is down, or return the amount of active touches
input.pointers                        //Pointer - Returns a pointer object, for advanced pointer handling

input.pointer_is_within_bounds        //boolean, true if the mouse or primary touch is contained within the bounds of the subregion
input.pointer_is_over_element(html_element) //boolean, true if the pointer is over an html element


// these 4 methods are the same as the above but you can choose the pointer index
input.get_pointer_pos(pointer_index)                  
input.get_pointer_pos_delta(pointer_index)        
input.get_pointer_NDC(pointer_index)          
input.get_pointer_NDC_delta(pointer_index)

```


When a button is pressed on the mouse, or the first finger is put on the screen, the following actions will occur:

```sh
// On the first frame the button was pressed
input.left_mouse_button_pressed  // true
input.left_mouse_button_down     // true
input.left_mouse_button_released // false

// On the following frames, while the button is kept pressed
input.left_mouse_button_pressed  // false
input.left_mouse_button_down     // true
input.left_mouse_button_released // false

// On the last frame, when the button is released
input.left_mouse_button_pressed  // false
input.left_mouse_button_down     // false
input.left_mouse_button_released // true
```

As you can see the button_pressed and button_released will only be true on exactly one frame.


### Using Pointers

When using input.pointers you get an array of Pointers. The Pointer class has the following useful properties an methods:
```
  id : integer
  pressed  : boolean  //called once when the pointer has been created (finger touching the screen)
  down     : boolean  //called each frame the pointer is active (finger kept on the screen)
  released : boolean  //called once when the pointer has been released (finger leaving the screen)

  position       : vec2  // position in pixels, relative to viewport
  position_delta : vec2  // position delta per frame in pixels, relative to viewport
  NDC            : vec2  // normalized position, relative to subregion
  NDC_delta      : vec2  // normalized position delta, relative to subregion

  distance_to(pointer) : float  // distance in pixels from pointer to pointer, relative to viewport

```
In desktop, the mouse is represented as a pointer as well, and thus input.pointers will always return an array of 1 pointer object.

Keep in mind that input.pointers is sorted so that the first elements are the oldest pointers in the array.
Here is an example for fingers A,B,C:

place finger A

place finger B

place finger C

```input.pointers will have [A,B,C]```

if then you release A

```input.pointers will have [B,C]```

but if instead you release B

```input.pointers will have [A,C]```

So you can't assume that input.pointers[0] will always be finger A. You need to use pointer.id if you need to keep track of pointers.


### Running the examples
You can check out the examples folder, all you need to do is set up an http server for it to work, using something like `http-server` package.

```sh
npm install -g http-server
cd examples
http-server -p 80
```
 This will mount an http server on the examples folder on port 80

License
----

MIT
