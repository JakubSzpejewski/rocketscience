import { Missile } from "../missile/missile";
import { GameObject } from "../utils/gameObject";


const PIXELS_FROM_POSITION: number = 20;

const LEFT_ARROW: number = 39;
const RIGHT_ARROW: number = 37;
const UP_ARROW: number = 38;
const X_KEY: number = 88;


const ANGLE_SPEED: number = 0.1;
const ACCELERATION: number = 0.1;
const MAX_SPEED: number = 6;
const MIN_SPEED: number = 0;

const SHOOT_INTERVAL: number = 1000;

export class Rocket extends GameObject {
    public tag: string = 'rocket';

    public position: p5.Vector;
    public direction: p5.Vector;
    private angle: number = 0;

    private speed: number = 0;

    constructor(x: number, y: number) {
        super();
        this.position = new p5.Vector(x, y);
        this.direction = new p5.Vector(0, 0);
    }

    public update(p: p5): void {
        this.processInput(p);
        if (this.speed < MIN_SPEED) {
            this.speed = MIN_SPEED;
        }
        this.direction = new p5.Vector(Math.sin(this.angle), -Math.cos(this.angle));
        this.direction.normalize();
        this.position.add(p5.Vector.mult(this.direction, this.speed));
    }

    public draw(p: p5): void {
        p.fill('#ffffff');
        p.push();
        p.translate(this.position.x, this.position.y);
        p.rotate(this.angle);
        p.translate(-this.position.x, -this.position.y);
        p.quad(this.position.x, this.position.y, this.position.x - PIXELS_FROM_POSITION, this.position.y + PIXELS_FROM_POSITION * 2, this.position.x,
            this.position.y + PIXELS_FROM_POSITION * 1.5, this.position.x + PIXELS_FROM_POSITION, this.position.y + PIXELS_FROM_POSITION * 2);
        p.pop();
    }

    private lastShotTime: number = 0;

    private processInput(p: p5): void {
        if (p.keyIsDown(RIGHT_ARROW)) {
            this.angle -= ANGLE_SPEED;
        }
        if (p.keyIsDown(LEFT_ARROW)) {
            this.angle += ANGLE_SPEED;
        }



        if (p.keyIsDown(UP_ARROW)) {
            if (this.speed < MAX_SPEED) {
                this.speed += ACCELERATION;
            }
        } else {
            if (this.speed > MIN_SPEED) {
                this.speed -= ACCELERATION;
            }
        }


        if (p.keyIsDown(X_KEY) && this.lastShotTime + SHOOT_INTERVAL < p.millis()) {
            this.lastShotTime = p.millis();
            this.shoot();
        }
    }

    private shoot(): void {
        new Missile(new p5.Vector(this.position.x, this.position.y), this.direction.copy());
    }
}