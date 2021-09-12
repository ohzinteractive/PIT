class t{static clamp(t,e,i){return Math.max(e,Math.min(i,t))}static is_int(t){return Number(t)===t&&t%1==0}}var e=new class{constructor(){this.operating_systems={ANDROID:"android",IOS:"ios",LINUX:"linux",MAC:"mac",WINDOWS:"windows"}}get_os(){let t=window.navigator.userAgent,e=window.navigator.platform,i=null;return-1!==["Macintosh","MacIntel","MacPPC","Mac68K"].indexOf(e)?i=this.operating_systems.MAC:-1!==["iPhone","iPad","iPod"].indexOf(e)?i=this.operating_systems.IOS:-1!==["Win32","Win64","Windows","WinCE"].indexOf(e)?i=this.operating_systems.WINDOWS:/Android/.test(t)?i=this.operating_systems.ANDROID:!i&&/Linux/.test(e)&&(i=this.operating_systems.LINUX),i}get is_android(){return this.get_os()===this.operating_systems.ANDROID}get is_ios(){return navigator.userAgent.match(/(iPhone|iPod|iPad)/)}get is_ipad(){return navigator.userAgent.match(/(iPad)/)}get is_mobile(){return!!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/)}get is_linux(){return this.get_os()===this.operating_systems.LINUX}get is_mac(){return this.get_os()===this.operating_systems.MAC}get is_windows(){return this.get_os()===this.operating_systems.WINDOWS}};class i{constructor(){this.left_mouse_button_pressed=!1,this.left_mouse_button_down=!1,this.left_mouse_button_released=!1,this.right_mouse_button_pressed=!1,this.right_mouse_button_down=!1,this.right_mouse_button_released=!1,this.middle_mouse_button_pressed=!1,this.middle_mouse_button_down=!1,this.middle_mouse_button_released=!1,this.pointer_pos={x:0,y:0},this.previous_pointer_pos={x:0,y:0},this.scroll_delta=0}get pointer_count(){return this.left_mouse_button_down||this.right_mouse_button_down||this.middle_mouse_button_down?1:0}pointer_down(t){switch(this.pointer_pos.x=t.clientX,this.pointer_pos.y=t.clientY,this.previous_pointer_pos.x=t.clientX,this.previous_pointer_pos.y=t.clientY,t.button){case 0:this.left_mouse_button_pressed=!0,this.left_mouse_button_down=!0;break;case 1:this.middle_mouse_button_pressed=!0,this.middle_mouse_button_down=!0;break;case 2:this.right_mouse_button_pressed=!0,this.right_mouse_button_down=!0}}pointer_up(t){switch(t.button){case 0:this.left_mouse_button_released=!0,this.left_mouse_button_down=!1;break;case 1:this.middle_mouse_button_released=!0,this.middle_mouse_button_down=!1;break;case 2:this.right_mouse_button_released=!0,this.right_mouse_button_down=!1}}pointer_move(t){this.pointer_pos.x=t.clientX,this.pointer_pos.y=t.clientY}pointer_cancel(t){this.pointer_out(t)}pointer_out(t){this.left_mouse_button_down&&(this.left_mouse_button_down=!1,this.left_mouse_button_released=!0),this.middle_mouse_button_down&&(this.middle_mouse_button_down=!1,this.middle_mouse_button_released=!0),this.right_mouse_button_down&&(this.right_mouse_button_down=!1,this.right_mouse_button_released=!0)}scroll(i){this.pointer_pos.x=i.clientX,this.pointer_pos.y=i.clientY,e.is_mac?i.ctrlKey||(t.is_int(i.deltaY)?this.scroll_delta=-1*t.clamp(i.deltaY/350,-1,1):this.scroll_delta=i.deltaY/Math.abs(i.deltaY)):Math.abs(i.deltaY)<1e-4?this.scroll_delta=0:this.scroll_delta=i.deltaY/Math.abs(i.deltaY)}clear(){this.left_mouse_button_pressed=!1,this.left_mouse_button_released=!1,this.right_mouse_button_pressed=!1,this.right_mouse_button_released=!1,this.middle_mouse_button_pressed=!1,this.middle_mouse_button_released=!1,this.scroll_delta=0,this.update_previous_pointer_pos()}get pointer_pos_delta(){return{x:this.pointer_pos.x-this.previous_pointer_pos.x,y:this.pointer_pos.y-this.previous_pointer_pos.y}}get pointer_center(){return this.pointer_pos}get pointer_center_delta(){return this.pointer_pos_delta}update_previous_pointer_pos(){this.previous_pointer_pos.x=this.pointer_pos.x,this.previous_pointer_pos.y=this.pointer_pos.y}}class s{constructor(){this.left_mouse_button_pressed=!1,this.left_mouse_button_down=!1,this.left_mouse_button_released=!1,this.pointers=[],this.previous_separation_distance=void 0,this.scroll_delta=0}get pointer_pos(){let t=0,e=0,i=this.pointers.find((t=>t.is_primary));return i&&(t=i.x,e=i.y),{x:t,y:e}}get pointer_pos_delta(){let t=0,e=0,i=this.pointers.find((t=>t.is_primary));return i&&(t=i.x-i.previous_x,e=i.y-i.previous_y),{x:t,y:e}}get pointer_count(){return this.pointers.length}get pointer_center(){let t=0,e=0;for(let i=0;i<this.pointers.length;i++)t+=this.pointers[i].x,e+=this.pointers[i].y;return t/=Math.max(1,this.pointers.length),e/=Math.max(1,this.pointers.length),{x:t,y:e}}get previous_pointer_center(){let t=0,e=0;for(let i=0;i<this.pointers.length;i++)t+=this.pointers[i].previous_x,e+=this.pointers[i].previous_y;return t/=Math.max(1,this.pointers.length),e/=Math.max(1,this.pointers.length),{x:t,y:e}}get pointer_center_delta(){let t=this.pointer_center,e=this.previous_pointer_center;return{x:t.x-e.x,y:t.y-e.y}}update_pointer_separation(){if(2===this.pointers.length){let t=this.pointers[0].x,e=this.pointers[0].y,i=this.pointers[1].x,s=this.pointers[1].y,o=Math.sqrt(Math.pow(t-i,2)+Math.pow(e-s,2));void 0===this.previous_separation_distance&&(this.previous_separation_distance=o);let _=.15;this.scroll_delta=-(o-this.previous_separation_distance)*_,this.previous_separation_distance=o}else this.previous_separation_distance=void 0,this.scroll_delta=0}update_pointer(t,e,i){let s=this.pointers.find((e=>e.id===t));return void 0===s&&(s={id:t,x:e,y:i,previous_x:e,previous_y:i,is_primary:0===this.pointers.length},this.pointers.push(s)),s.previous_x=s.x,s.previous_y=s.y,s.x=e,s.y=i,this.update_pointer_separation(),s}remove_pointer(t){let e=this.pointers.findIndex((e=>e.id===t));void 0!==e&&this.pointers.splice(e,1),this.update_pointer_separation()}pointer_down(t){t.scale&&1!==t.scale&&t.preventDefault();let e=t.changedTouches;for(let t=0;t<e.length;t++){let i=e[t];this.update_pointer(i.identifier,i.clientX,i.clientY).is_primary&&(this.left_mouse_button_pressed=!0,this.left_mouse_button_down=!0)}}pointer_up(t){t.scale&&1!==t.scale&&t.preventDefault();let e=t.changedTouches;for(let t=0;t<e.length;t++){let i=e[t],s=this.update_pointer(i.identifier,i.clientX,i.clientY);s.is_primary&&(this.left_mouse_button_released=!0,this.left_mouse_button_down=!1),this.remove_pointer(s.id)}}pointer_move(t){t.scale&&1!==t.scale&&t.preventDefault();let e=t.changedTouches;for(let t=0;t<e.length;t++){let i=e[t];this.update_pointer(i.identifier,i.clientX,i.clientY)}}pointer_cancel(t){this.pointer_out(t)}pointer_out(t){let e=t.changedTouches;for(let t=0;t<e.length;t++){let i=e[t],s=this.update_pointer(i.identifier,i.clientX,i.clientY);this.left_mouse_button_down&&s.is_primary&&(this.left_mouse_button_down=!1,this.left_mouse_button_released=!0),this.remove_pointer(s.id)}}clear(){this.left_mouse_button_pressed=!1,this.left_mouse_button_released=!1,this.scroll_delta=0}}export class InputController{init(t,e){this.dom_element=t,this.sub_region_element=void 0===e?t:e,this.mouse_input_module=new i,this.touch_input_module=new s,this.active_input_module=this.mouse_input_module,this.region_bounds={x:0,y:0,width:1,height:1},this.update_region_bounds(),this.touch_cooldown=new Date-1e3;this.bind_events()}bind_events(){this.__binded_on_wheel=this.on_wheel.bind(this),this.dom_element.addEventListener("wheel",this.__binded_on_wheel),this.__binded_on_touchstart=this.on_touchstart.bind(this),this.dom_element.addEventListener("touchstart",this.__binded_on_touchstart,{passive:!1}),this.__binded_on_touchmove=this.on_touchmove.bind(this),this.dom_element.addEventListener("touchmove",this.__binded_on_touchmove,{passive:!1}),this.__binded_on_touchcancel=this.on_touchcancel.bind(this),this.dom_element.addEventListener("touchcancel",this.__binded_on_touchcancel,{passive:!1}),this.__binded_on_touchend=this.on_touchend.bind(this),this.dom_element.addEventListener("touchend",this.__binded_on_touchend,{passive:!1}),this.__binded_on_mousedown=this.on_mousedown.bind(this),this.dom_element.addEventListener("mousedown",this.__binded_on_mousedown,!1),this.__binded_on_mousemove=this.on_mousemove.bind(this),this.dom_element.addEventListener("mousemove",this.__binded_on_mousemove,!1),this.__binded_on_mouseup=this.on_mouseup.bind(this),this.dom_element.addEventListener("mouseup",this.__binded_on_mouseup,!1),this.__binded_on_mouseleave=this.on_mouseleave.bind(this),this.dom_element.addEventListener("mouseleave",this.__binded_on_mouseleave,!1)}unbind_events(){this.dom_element.removeEventListener("wheel",this.__binded_on_wheel),this.dom_element.removeEventListener("touchstart",this.__binded_on_touchstart,{passive:!1}),this.dom_element.removeEventListener("touchmove",this.__binded_on_touchmove,{passive:!1}),this.dom_element.removeEventListener("touchcancel",this.__binded_on_touchcancel,{passive:!1}),this.dom_element.removeEventListener("touchend",this.__binded_on_touchend,{passive:!1}),this.dom_element.removeEventListener("mousedown",this.__binded_on_mousedown,!1),this.dom_element.removeEventListener("mousemove",this.__binded_on_mousemove,!1),this.dom_element.removeEventListener("mouseup",this.__binded_on_mouseup,!1),this.dom_element.removeEventListener("mouseleave",this.__binded_on_mouseleave,!1)}on_wheel(t){this.mouse_input_module.scroll(t),this.set_mouse_input_active()}on_touchstart(t){this.touch_input_module.pointer_down(t),this.set_touch_input_active()}on_touchmove(t){this.touch_input_module.pointer_move(t),this.set_touch_input_active()}on_touchcancel(t){this.touch_input_module.pointer_cancel(t),this.set_touch_input_active()}on_touchend(t){this.touch_input_module.pointer_up(t),this.set_touch_input_active()}on_mousedown(t){this.mouse_input_allowed()&&(this.mouse_input_module.pointer_down(t),this.set_mouse_input_active())}on_mousemove(t){this.mouse_input_allowed()&&(this.mouse_input_module.pointer_move(t),this.set_mouse_input_active())}on_mouseup(t){this.mouse_input_allowed()&&(this.mouse_input_module.pointer_up(t),this.set_mouse_input_active())}on_mouseleave(t){this.mouse_input_module.pointer_out(t),this.set_mouse_input_active()}clear(){this.touch_input_module.clear(),this.mouse_input_module.clear(),this.update_region_bounds()}update_region_bounds(){let t=this.sub_region_element.getBoundingClientRect();this.region_bounds.x=t.left,this.region_bounds.y=t.top,this.region_bounds.width=t.width,this.region_bounds.height=t.height}mouse_input_allowed(){return(new Date-this.touch_cooldown)/1e3>.75}set_mouse_input_active(){this.active_input_module=this.mouse_input_module}set_touch_input_active(){this.active_input_module=this.touch_input_module,this.touch_cooldown=new Date}get left_mouse_button_pressed(){return this.active_input_module.left_mouse_button_pressed}get left_mouse_button_down(){return this.active_input_module.left_mouse_button_down}get left_mouse_button_released(){return this.active_input_module.left_mouse_button_released}get right_mouse_button_pressed(){return this.mouse_input_module.right_mouse_button_pressed}get right_mouse_button_down(){return this.mouse_input_module.right_mouse_button_down}get right_mouse_button_released(){return this.mouse_input_module.right_mouse_button_released}get middle_mouse_button_pressed(){return this.mouse_input_module.middle_mouse_button_pressed}get middle_mouse_button_down(){return this.mouse_input_module.middle_mouse_button_down}get middle_mouse_button_released(){return this.mouse_input_module.middle_mouse_button_released}check_for_legal_bounds(){0!==this.region_bounds.width&&0!==this.region_bounds.height||console.error("Cannot get normalized mouse position for target element due to the element having 0 width or height",this.dom_element,this.region_bounds)}transform_pos_to_subregion(t){return{x:t.x-this.region_bounds.x,y:this.region_bounds.height-(t.y-this.region_bounds.y)}}transform_pos_to_NDC(t){return this.check_for_legal_bounds(),{x:t.x/this.region_bounds.width*2-1,y:t.y/this.region_bounds.height*2-1}}get scroll_delta(){return this.active_input_module.scroll_delta}get pointer_count(){return this.active_input_module.pointer_count}get pointer_is_within_bounds(){let t=this.NDC;return t.x>=-1&&t.x<=1&&t.y>=-1&&t.y<=1}pointer_is_over_element(t){let e=t.getBoundingClientRect(),i=this.html_pointer_pos;return i.x>e.left&&i.x<e.left+e.width&&i.y>e.top&&i.y<e.top+e.height}get pointer_pos(){return this.transform_pos_to_subregion(this.active_input_module.pointer_pos)}get html_pointer_pos(){return{x:this.active_input_module.pointer_pos.x,y:this.active_input_module.pointer_pos.y}}get pointer_pos_delta(){let t=this.active_input_module.pointer_pos_delta;return{x:t.x,y:-1*t.y}}get NDC(){return this.transform_pos_to_NDC(this.pointer_pos)}get NDC_delta(){return this.check_for_legal_bounds(),{x:this.pointer_pos_delta.x/this.region_bounds.width,y:this.pointer_pos_delta.y/this.region_bounds.height}}get pointer_center(){return this.transform_pos_to_subregion(this.active_input_module.pointer_center)}get pointer_center_delta(){let t=this.active_input_module.pointer_center_delta;return{x:t.x,y:-1*t.y}}get pointer_center_NDC(){return this.transform_pos_to_NDC(this.pointer_center)}get pointer_center_NDC_delta(){this.check_for_legal_bounds();let t=this.pointer_center_delta;return{x:t.x/this.region_bounds.width,y:t.y/this.region_bounds.height}}dispose(){this.unbind_events()}}
//# sourceMappingURL=PIT.js.map
