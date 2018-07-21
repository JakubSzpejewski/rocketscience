import { Missile } from "../missile/missile";
import { GameObject } from "../utils/gameObject";
import { game, CANVAS_HEIGHT, CANVAS_WIDTH } from "../../index";
import { collidePolyPoly } from "../utils/collisions";


export const PIXELS_FROM_POSITION: number = 20;

// const LEFT_ARROW: number = 39;
// const RIGHT_ARROW: number = 37;
// const UP_ARROW: number = 38;
// const X_KEY: number = 88;


export const ANGLE_SPEED: number = 0.1;
const ACCELERATION: number = 0.1;
const MAX_SPEED: number = 6;
const MIN_SPEED: number = 0;

const SHOOT_INTERVAL: number = 500;



export class Rocket extends GameObject {
    public priority: number = 0;
    public tag: string = 'rocket';
    public shape: p5.Vector[];

    public position: p5.Vector;
    public direction: p5.Vector;
    private angle: number = 0;

    private speed: number = 0;

    constructor(x: number, y: number) {
        super();
        this.position = new p5.Vector(x, y);
        this.direction = new p5.Vector(0, 0);
        this.shape = [
            new p5.Vector(this.position.x, this.position.y).add(0, - PIXELS_FROM_POSITION * 2),
            new p5.Vector(this.position.x - PIXELS_FROM_POSITION, this.position.y + PIXELS_FROM_POSITION * 2).add(0, - PIXELS_FROM_POSITION * 2),
            new p5.Vector(this.position.x, this.position.y + PIXELS_FROM_POSITION * 1.5).add(0, - PIXELS_FROM_POSITION * 2),
            new p5.Vector(this.position.x + PIXELS_FROM_POSITION, this.position.y + PIXELS_FROM_POSITION * 2).add(0, - PIXELS_FROM_POSITION * 2),
        ];
    }

    public update(p: p5): void {
        this.processInput(p);
        if (!this.checkWindowBoundaries()) {
            this.onDestroy();
        }
        if (this.speed < MIN_SPEED) {
            this.speed = MIN_SPEED;
        }
        this.direction = new p5.Vector(Math.sin(this.angle), -Math.cos(this.angle));
        this.direction.normalize();
        this.position.add(p5.Vector.mult(this.direction, this.speed));
        this.shape = [
            new p5.Vector(this.position.x, this.position.y).add(0, - PIXELS_FROM_POSITION * 2),
            new p5.Vector(this.position.x - PIXELS_FROM_POSITION, this.position.y + PIXELS_FROM_POSITION * 2).add(0, - PIXELS_FROM_POSITION * 2),
            new p5.Vector(this.position.x, this.position.y + PIXELS_FROM_POSITION * 1.5).add(0, - PIXELS_FROM_POSITION * 2),
            new p5.Vector(this.position.x + PIXELS_FROM_POSITION, this.position.y + PIXELS_FROM_POSITION * 2).add(0, - PIXELS_FROM_POSITION * 2),
        ];
    }

    public draw(p: p5): void {
        p.push();
        p.translate(this.position.x, this.position.y - PIXELS_FROM_POSITION);
        p.fill('#ff0000')
        p.stroke('#ffffff');
        p.ellipse(0, 0, 4);
        p.rotate(this.angle);
        p.translate(-this.position.x, -this.position.y - PIXELS_FROM_POSITION);
        p.fill('#ffffff');
        p.quad(this.position.x, this.position.y, this.position.x - PIXELS_FROM_POSITION, this.position.y + PIXELS_FROM_POSITION * 2,
            this.position.x, this.position.y + PIXELS_FROM_POSITION * 1.5, this.position.x + PIXELS_FROM_POSITION, this.position.y + PIXELS_FROM_POSITION * 2);

        p.pop();
    }

    private checkWindowBoundaries(): boolean {
        return collidePolyPoly([new p5.Vector(0, 0), new p5.Vector(CANVAS_WIDTH, 0), new p5.Vector(CANVAS_WIDTH, CANVAS_HEIGHT), new p5.Vector(0, CANVAS_HEIGHT)],
            this.shape, true);
    }

    private lastShotTime: number = 0;

    private processInput(_p: p5): void {
        // if (p.keyIsDown(RIGHT_ARROW)) {
        //     this.changeAngle(-ANGLE_SPEED);
        // }
        // if (p.keyIsDown(LEFT_ARROW)) {
        //     this.changeAngle(ANGLE_SPEED);
        // }


        // if (p.keyIsDown(UP_ARROW)) {
        //     this.accelerate();
        // } else {
        //     this.decelerate();
        // }


        // if (p.keyIsDown(X_KEY)) {
        //     this.shoot(p);
        // }
    }

    public accelerate(): void {
        if (this.speed < MAX_SPEED) {
            this.speed += ACCELERATION;
        }
    }

    public decelerate(): void {
        if (this.speed > MIN_SPEED) {
            this.speed -= ACCELERATION;
        }
    }

    public changeAngle(diff: number): void {
        this.angle += diff;
    }

    public shoot(p: p5): void {
        if (this.lastShotTime + SHOOT_INTERVAL < p.millis()) {
            this.lastShotTime = p.millis();
            new Missile(new p5.Vector(this.position.x, this.position.y - PIXELS_FROM_POSITION), this.direction.copy());
        }
    }

    public onDestroy(): void {
        game.gameOver();
    }

    public onCollision(gameObject: GameObject): boolean {
        switch (gameObject.tag) {
            case 'asteroid': {
                this.onDestroy();
                break;
            }
        }
        return false;
    }
}