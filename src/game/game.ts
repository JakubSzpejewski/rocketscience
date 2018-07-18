import { GameObject } from "./utils/gameObject";
import { Rocket } from "./rocket/rocket";
import { Asteroid } from "./asteroid/asteroid";
import { collidePolyPoly } from "./utils/collisions";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../index";

const ASTEROID_COUNT: number = 30;

export enum GameState {
    notRunning,
    running,
    over,
}
export class Game {

    public gameObjects: GameObject[] = [];

    public points: number = 0;

    private debug = false;

    public state: GameState = GameState.notRunning;

    constructor() {

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

    public startGame(): void {
        this.points = 0;
        this.state = GameState.running;
        setTimeout(() => {
            new Rocket(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
        }, 0);
    }

    public gameOver(): void {
        this.gameObjects = [];
        this.state = GameState.over;
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
            if (this.debug) {
                p.noFill();
                p.strokeWeight(3);
                p.beginShape();
                p.stroke('#00ff00')
                for (const vertix of gameObject.shape) {
                    p.vertex(vertix.x, vertix.y);
                }
                p.endShape(p.CLOSE);
            }
            gameObject.draw(p);

        }
    }
}