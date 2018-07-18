import { GameObject } from "../utils/gameObject";


export class Missile extends GameObject {
    public priority: number = 10;
    public tag: string = 'missile';

    public shape: p5.Vector[];

    private lifeTime: number = 100;
    private count: number = 0;

    constructor(
        public position: p5.Vector,
        public direction: p5.Vector,
    ) {
        super();
        this.shape = [new p5.Vector(this.position.x, this.position.y), new p5.Vector(this.position.x + 5, this.position.y + 5)];
    }

    public update(): void {
        if (this.lifeTime <= this.count) {
            this.onDestroy();
        }
        this.count++;
        this.direction.normalize();
        this.position.add(p5.Vector.mult(this.direction, 10))
        this.shape = [new p5.Vector(this.position.x, this.position.y), new p5.Vector(this.position.x + 10, this.position.y),
        new p5.Vector(this.position.x + 10, this.position.y), new p5.Vector(this.position.x + 10, this.position.y + 10)];
    }

    public draw(p: p5): void {
        p.push();
        p.fill('#ffffff');
        p.stroke('#ffffff');
        p.rect(this.position.x, this.position.y, 10, 10);

        p.pop();
    }

    public onCollision(_gameObject: GameObject): boolean {
        return true;
    }
}