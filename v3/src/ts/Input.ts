import { KeyboardInput } from './KeyboardInput';

export class Input {
    keyboard: KeyboardInput;

    async init() {
        this.keyboard = new KeyboardInput();
        await this.keyboard.init();
    }
}
