import { Input } from './input';

/**
 * Game state.
 */
export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    input: Input;

    async init() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');

        this.input = new Input();
        //await Asset.init();
    }

    start() {
        //this.framems = performance.now();
        //window.requestAnimationFrame(() => this.onFrame());
        //this.frame = 0;
        /// #if DEBUG
        //console.log('Starting game.');
        /// #endif
    }

    onFrame(currentms : number) {
        this.update();
        this.resize();
        this.draw();
        window.requestAnimationFrame(() => this.onFrame(currentms));
    }

    update() {
    }

    draw() {
        this.ctx.fillStyle = 'lime';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resize() {
        let width = this.canvas.clientWidth;
        let height = this.canvas.clientHeight;
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
    }
}
