import { GameObject } from "./utils/gameObject";
import { Rocket } from "./rocket/rocket";


export class Game {

    public gameObjects: GameObject[] = [];

    constructor() {
        setTimeout(() => new Rocket(200, 200), 0);
    }

    public update(p: p5): void {
        for (const gameObject of this.gameObjects) {
            gameObject.update(p);
        }
    }

    public draw(p: p5): void {
        for (const gameObject of this.gameObjects) {
            gameObject.draw(p);
        }
    }
}