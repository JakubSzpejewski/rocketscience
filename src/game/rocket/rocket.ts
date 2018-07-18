import { Missile } from "../missile/missile";
import { GameObject } from "../utils/gameObject";
import { game } from "../../index";


const PIXELS_FROM_POSITION: number = 20;

const LEFT_ARROW: number = 39;
const RIGHT_ARROW: number = 37;
const UP_ARROW: number = 38;
const X_KEY: number = 88;


const ANGLE_SPEED: number = 0.1;
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
    }

    public update(p: p5): void {
        this.processInput(p);
        if (this.speed < MIN_SPEED) {
            this.speed = MIN_SPEED;
        }
        this.direction = new p5.Vector(Math.sin(this.angle), -Math.cos(this.angle));
        this.direction.normalize();
        this.position.add(p5.Vector.mult(this.direction, this.speed));
        this.shape = [
            new p5.Vector(this.position.x, this.position.y),
            new p5.Vector(this.position.x - PIXELS_FROM_POSITION, this.position.y + PIXELS_FROM_POSITION * 2),
            new p5.Vector(this.position.x, this.position.y + PIXELS_FROM_POSITION * 1.5),
            new p5.Vector(this.position.x + PIXELS_FROM_POSITION, this.position.y + PIXELS_FROM_POSITION * 2)
        ];
    }

    public draw(p: p5): void {
        p.push();
        p.fill('#ffffff');
        p.translate(this.position.x, this.position.y);
        p.rotate(this.angle);
        p.translate(-this.position.x, -this.position.y);
        p.quad(this.shape[0].x, this.shape[0].y, this.shape[1].x, this.shape[1].y, this.shape[2].x, this.shape[2].y, this.shape[3].x, this.shape[3].y);
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

    public onCollision(gameObject: GameObject): boolean {
        switch (gameObject.tag) {
            case 'asteroid': {
                //TODO
                game.points = 0;
                break;
            }
        }
        return false;
    }
}