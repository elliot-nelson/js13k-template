export class KeyboardInput {
  map: Array<string>;
  pressed: { [key:string]: boolean };

  constructor() {
    this.map = [];
    this.pressed = {};
    this.map[38] = 'K_UP';       // UpArrow
    this.map[40] = 'K_DOWN';     // DownArrow
    this.map[37] = 'K_LEFT';     // LeftArrow
    this.map[39] = 'K_RIGHT';    // RightArrow
    this.map[27] = 'K_ESCAPE';   // Escape
  }

  async init() {
    document.addEventListener('keydown', event => {
      let k = this.map[event.keyCode];
      console.log([k, event.keyCode]);
      if (k) {
        this.pressed[k] = true;
      }
    });

    document.addEventListener('keyup', event => {
      let k = this.map[event.keyCode];
      if (k) {
        this.pressed[k] = undefined;
      }
    });
  }
}
