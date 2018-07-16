import { GameObject } from "../utils/gameObject";


export class Missile extends GameObject {
    public tag: string = 'missile';

    constructor(
        public position: p5.Vector,
        public direction: p5.Vector,
    ) {
        super();
    }

    public update(): void {
        this.direction.normalize();
        this.position.add(p5.Vector.mult(this.direction, 10))
    }

    public draw(p: p5): void {
        p.push();
        p.fill('#ffffff');
        p.ellipse(this.position.x, this.position.y, 10);

        p.pop();
    }
}