class Game {
    async init() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        await Asset.init();
    }

    start() {
        this.framems = performance.now();
        window.requestAnimationFrame(() => this.onFrame());
        this.frame = 0;
    }

    onFrame(currentms) {
        this.update();
        this.resize();
        this.draw();
        window.requestAnimationFrame(() => this.onFrame());
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
        if (canvas.width !== width || canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
    }
}
