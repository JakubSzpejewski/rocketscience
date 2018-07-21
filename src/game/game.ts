import { GameObject } from "./utils/gameObject";
import { Rocket } from "./rocket/rocket";
import { Asteroid } from "./asteroid/asteroid";
import { collidePolyPoly } from "./utils/collisions";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../index";
import { AiRocket } from "../ai/rocket/rocket";
import { GeneticUnit } from "../ai/genetic/population";

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

    private onStartFunctions: (() => void)[] = [];
    private onDrawFunctions: ((p: p5) => void)[] = [];
    private onUpdateFunctions: ((p: p5) => void)[] = [];
    private onGameOverFunctions: (() => void)[] = [];

    constructor(
        private geneticUnit?: GeneticUnit,
    ) {
        if (geneticUnit) {
            (<any>Math).seedrandom(geneticUnit.randomSeed);
        }

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

    public registerOnStart(...functions: (() => void)[]): void {
        this.onStartFunctions.push(...functions);
    }
    public registerOnDraw(...functions: ((p: p5) => void)[]): void {
        this.onDrawFunctions.push(...functions);
    }
    public registerOnUpdate(...functions: ((p: p5) => void)[]): void {
        this.onUpdateFunctions.push(...functions);
    }
    public registerOnGameOver(...functions: (() => void)[]): void {
        this.onGameOverFunctions.push(...functions);
    }

    public startGame(): void {
        if (this.state === GameState.running) {
            throw new Error('Game already running');
        }
        this.points = 0;
        this.state = GameState.running;

        if (!this.geneticUnit) {
            new Rocket(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        } else {
            new AiRocket(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, this.geneticUnit);
        }

        for (const fn of this.onStartFunctions) {
            fn();
        }
    }

    public gameOver(): void {
        for (const fn of this.onGameOverFunctions) {
            fn();
        }
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
        for (const fn of this.onUpdateFunctions) {
            fn(p);
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
        for (const fn of this.onDrawFunctions) {
            fn(p);
        }
    }
}