import { Vector2 } from "../services/Vector2";

export class Input {
    static mousePosition = new Vector2(0, 0);
    static mouseDelta = new Vector2(0, 0);
    static keys = new Set<string>();
    static buttons = new Set<number>();
    static wheelDelta = 0;
    static pressedButtons = new Set<any>();
    static releasedButtons = new Set<number>();

    static initialize() {
        window.addEventListener("mousemove", (event) => {
            this.mouseDelta = new Vector2(event.movementX, event.movementY);
            this.mousePosition = new Vector2(event.clientX, event.clientY);
        });

        window.addEventListener("keydown", (event) => {
            if (event.code === "Tab") {
                event.preventDefault();
            }

            if (event.code === "AltLeft") {
                event.preventDefault();
            }

            if (event.code === "Space") {
                event.preventDefault();
            }

            console.log(`Key down: ${event.code}`);

            this.keys.add(event.code);
            this.pressedButtons.add(event.code);
        });

        window.addEventListener("keyup", (event) => {
            this.keys.delete(event.code);
        });

        window.addEventListener("mousedown", (event) => {
            this.buttons.add(event.button);
            this.pressedButtons.add(event.button);
        });

        window.addEventListener("mouseup", (event) => {
            this.buttons.delete(event.button);
            this.releasedButtons.add(event.button);
        });

        window.addEventListener("wheel", (event) => {
            this.wheelDelta = event.deltaY;
        });

        window.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        window.addEventListener("mousemove", (event) => {
            const canvas = document.getElementById("canvas") as HTMLCanvasElement;

            if (!canvas) {
                return;
            }

            const rect = canvas.getBoundingClientRect();

            this.mousePosition =
                new Vector2(
                    event.clientX - rect.left,
                    event.clientY - rect.top
                );

            this.mouseDelta =
                new Vector2(
                    event.movementX,
                    event.movementY
                );
        });

        window.dispatchEvent(
            new Event("close-menu")
        );
    }

    static isKeyDown(key: string): boolean {
        return this.keys.has(key);
    }

    static isKeyPressed(key: string): boolean {
        return this.pressedButtons.has(key);
    }

    static isMouseDown(button: number): boolean {
        return this.buttons.has(button);
    }

    static isMousePressed(button: number): boolean {
        return this.pressedButtons.has(button);
    }

    static isMouseReleased(button: number): boolean {
        return this.releasedButtons.has(button);
    }

    static getKeysDown() {
        return this.keys
    }

    static isKeybindsPressed(keys: string[]): boolean {
        for (const key of keys) {
            if (this.isKeyPressed(key)) {
                return true;
            }
        }

        return false;
    }

    static isAllKeybindsPressed(keys: string[]): boolean {
        for (const key of keys) {
            if (!this.isKeyDown(key)) {
                return false;
            }
        }

        return true;
    }

    static endFrame() {
        this.wheelDelta = 0;
        this.pressedButtons.clear();
        this.releasedButtons.clear();
    }
}