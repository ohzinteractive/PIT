# Pollable InpuT



PIT is a tiny javascript library that allows you to check for input in a pollable manner. 

It is common in websites to handle input in an event-based way, but sometimes for highly interactive applications that have an update loop running every frame it is a lot easier to check for input instead of juggling around with the events. 

Currently PIT supports the following:

  - Mouse and touch support through a (mostly) unified interface
  - Query mouse/touch position
  - Query mouse/touch normalized position (the position in the range [-1..1])
  - Check for mouse buttons (left right middle)
  - Mouse scroll and touch pinch to zoom merged into the same variable
  - Query amount of active pointers (for mouse always 1 if any button is pressed)



### Dependencies

PIT has no external dependencies

### Installation

```sh
$ npm install pit-js --save
```


### Usage

```sh
import {InputController} from 'pit-js'

let input = new InputController(document.body); //element to listen events on

let animate = function () {

  if(input.left_mouse_button_pressed) // on mobile left mouse button represents the primary touch
    console.log('pressed')

  if(input.left_mouse_button_down)
    console.log('down')

  if(input.left_mouse_button_released)
    console.log('released')

  console.log("mouse_pos", input.mouse_pos) // on mobile this will represent the center of all active touches  
  console.log("normalized mouse pos", input.NDC) // NDC stands for normalized device coordinates


  input.clear(); // call this to prepare for next frame
  requestAnimationFrame( animate ); // must be after the .clear()

};

animate();
```

### Features

The API provides the following accesible properties

```sh
input.left_mouse_button_pressed       //boolean, works for left mouse button or first touch on the screen (primary touch)
input.left_mouse_button_down          //boolean, works for left mouse button or first touch on the screen (primary touch)
input.left_mouse_button_released      //boolean, works for left mouse button or first touch on the screen (primary touch)

input.right_mouse_button_pressed      //boolean, mouse only
input.right_mouse_button_down         //boolean, mouse only
input.right_mouse_button_released     //boolean, mouse only

input.middle_mouse_button_pressed     //boolean, mouse only
input.middle_mouse_button_down        //boolean, mouse only
input.middle_mouse_button_released    //boolean, mouse only

input.mouse_pos                       //{x,y} screen coordinates of the mouse position, or the center of all active touches
input.mouse_pos_delta                 //{x,y} difference between previous position and current position.
input.NDC                             //{x,y} [-1..1] normalized device coordinates for mouse or center of all active touches
input.NDC_delta                       //{x,y} [-1..1] difference between previous normalized position and current normalized position

input.scroll_delta                    //float - this is equivalent to the mouse wheel (-1, 0, 1) or to pinching on the screen [-1..1]
input.pointer_count                   //int - returns 1 if any mouse button is down, or return the amount of active touches 
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



