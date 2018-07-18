import { GameObject } from "./utils/gameObject";
import { Rocket } from "./rocket/rocket";
import { Asteroid } from "./asteroid/asteroid";
import { collidePolyPoly } from "./utils/collisions";

const ASTEROID_COUNT: number = 30;

export enum GameState {
    running,
    over,
}
export class Game {

    public gameObjects: GameObject[] = [];

    public points: number = 0;

    constructor() {
        setTimeout(() => {
            new Rocket(200, 200)
        }, 0);
    }

    public checkCollisions(): void {
        //TODO: quadtree?
        this.gameObjects = this.gameObjects.sort((a: GameObject, b: GameObject) => {
            if (a.priority > b.priority) return 1
            if (a.priority < b.priority) return -1;
            return 0;
        });

        for (let i = 0; i < this.gameObjects.length; i++) {
            for (let j = 0; j < this.gameObjects.length; j++) {
                if (i === j || !this.gameObjects[i] || !this.gameObjects[j] || this.gameObjects[i].tag === this.gameObjects[j].tag) {
                    continue;
                }

                if (collidePolyPoly(this.gameObjects[i].shape, this.gameObjects[j].shape)) {
                    this.gameObjects[i].onCollision(this.gameObjects[j]);
                }
            }
        }


    }

    public update(p: p5): void {
        this.checkCollisions();
        if (this.gameObjects.filter(v => v.tag === 'asteroid').reduce((prev, curr) => prev += (<Asteroid>curr).size, 0) < ASTEROID_COUNT) {
            new Asteroid(Math.floor(Math.random() * (4 - 1) + 1));
        }
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