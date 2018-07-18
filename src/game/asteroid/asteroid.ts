import { GameObject } from "../utils/gameObject";
import { CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_OFFSET, game } from "../../index";
import { collidePolyPoly } from "../utils/collisions";

const DEFAULT_SIZE: number = 15;
const DEFAULT_SPEED: number = 4;


export class Asteroid extends GameObject {
    public priority: number = 1000;
    public tag: string = 'asteroid';
    public position: p5.Vector;
    public direction: p5.Vector;

    public shape: p5.Vector[] = [];

    private readonly vertices: p5.Vector[] = this.rollShape();

    constructor(
        public size: number,
        position?: p5.Vector,
    ) {
        super();


        this.position = position || this.rollStartPosition();

        const target = new p5.Vector(this.random(0, CANVAS_WIDTH), this.random(0, CANVAS_HEIGHT));
        this.direction = p5.Vector.sub(target, this.position).normalize();


        for (const vertix of this.vertices) {
            this.shape.push(p5.Vector.add(this.position, vertix));
        }
    }

    private random(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    private rollStartPosition(): p5.Vector {
        let x: number;
        let y: number;
        // true - top/bottom, false - right/left
        if (Math.round(Math.random())) {
            x = this.random(-CANVAS_OFFSET, CANVAS_WIDTH + CANVAS_OFFSET);
            // true - top, false - bottom
            if (Math.round(Math.random())) {
                y = this.random(-CANVAS_OFFSET, 0);
            } else {
                y = this.random(CANVAS_HEIGHT, CANVAS_HEIGHT + CANVAS_OFFSET);
            }
        } else {
            y = this.random(-CANVAS_OFFSET, CANVAS_HEIGHT + CANVAS_OFFSET);
            // true - left, false - right
            if (Math.round(Math.random())) {
                x = this.random(-CANVAS_OFFSET, 0);
            } else {
                x = this.random(CANVAS_WIDTH, CANVAS_WIDTH + CANVAS_OFFSET);
            }
        }
        return new p5.Vector(x, y);
    }

    public update(): void {
        if (this.checkOutOfBounds()) {
            this.onDestroy();
        }
        this.direction.normalize();
        this.position.add(p5.Vector.mult(this.direction, DEFAULT_SPEED - this.size));

        this.shape = [];
        for (const vertix of this.vertices) {
            this.shape.push(p5.Vector.add(this.position, vertix));
        }
    }

    public draw(p: p5): void {
        p.push();
        p.noFill();
        p.beginShape();
        for (const point of this.shape) {
            p.vertex(point.x, point.y);
        }
        p.endShape(p.CLOSE);
        p.pop();
    }

    private split(): Asteroid[] {
        return [
            new Asteroid(this.size - 1, this.position.copy()),
            new Asteroid(this.size - 1, this.position.copy()),
        ];
    }

    private rollShape(): p5.Vector[] {
        let defaultPointsQuantity: number = 10;
        defaultPointsQuantity += Math.floor(this.random(-2, 2));

        const vertices: p5.Vector[] = [];

        const angles: number[] = (<any>Array).from({ length: defaultPointsQuantity }, () => this.random(0, 360)).sort((x: number, y: number) => x - y);

        for (let i = 0; i < defaultPointsQuantity; i++) {
            const length = this.random((this.size * DEFAULT_SIZE), (this.size * DEFAULT_SIZE) * 2);
            vertices.push(new p5.Vector(length * Math.cos(this.toRadians(angles[i])), length * Math.sin(this.toRadians(angles[i]))));
        }
        return vertices;
    }

    private toRadians(angle: number): number {
        return angle * (Math.PI / 180);
    }

    private checkOutOfBounds(): boolean {
        const screenBounds = [
            new p5.Vector(-CANVAS_OFFSET, -CANVAS_OFFSET),
            new p5.Vector(-CANVAS_OFFSET, CANVAS_HEIGHT + CANVAS_OFFSET),
            new p5.Vector(CANVAS_WIDTH + CANVAS_OFFSET, CANVAS_HEIGHT + CANVAS_OFFSET),
            new p5.Vector(CANVAS_WIDTH + CANVAS_OFFSET, -CANVAS_OFFSET),
        ];
        return collidePolyPoly(
            this.shape,
            screenBounds,
            true,
        );
    }

    public onCollision(gameObject: GameObject): boolean {
        console.log(gameObject);
        switch (gameObject.tag) {
            case 'missile': {
                this.onDestroy();
                gameObject.onDestroy();
                if (this.size > 1) {
                    this.split();
                }
                // size 3 == 10 points
                // size 2 == 30 points
                // size 1 == 100 points
                game.points += (25 * (this.size - 2) - 20) * (this.size - 3) + 10;
                return true;
            }
            default: {
                break;
            }
        }
        return false;
    }

}