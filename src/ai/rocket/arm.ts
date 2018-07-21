import { GameObject } from "../../game/utils/gameObject";
import { collideLinePolyWithIntersectionPoint } from "../../game/utils/collisions";

export const ARM_LENGTH = 400;

export class Arm {

    private shape: p5.Vector[] = [];

    public distance: number;

    private pointOfCollision: { x: number, y: number } | undefined;

    constructor(
        private angle: number
    ) {

    }

    public update(position: p5.Vector): void {
        this.shape = [
            position,
            new p5.Vector(
                position.x + ARM_LENGTH * Math.cos(this.angle),
                position.y + ARM_LENGTH * Math.sin(this.angle),
            ),
        ];
    }

    public draw(p: p5): void {
        p.push();
        p.stroke('#00ff00');
        p.line(this.shape[0].x, this.shape[0].y, this.shape[1].x, this.shape[1].y);
        if (this.pointOfCollision) {
            p.stroke('#ff0000');
            p.line(this.shape[1].x, this.shape[1].y, this.pointOfCollision.x, this.pointOfCollision.y);
        }
        p.pop();
    }

    public collisions(gameObjects: GameObject[]): void {
        for (const gameObject of gameObjects) {
            if (gameObject.tag === 'rocket' || gameObject.tag === 'missile') continue;

            this.pointOfCollision = collideLinePolyWithIntersectionPoint(this.shape[0].x, this.shape[0].y, this.shape[1].x, this.shape[1].y, gameObject.shape);

            if (this.pointOfCollision) {
                this.distance = p5.Vector.dist(this.shape[0], new p5.Vector(this.pointOfCollision.x, this.pointOfCollision.y));
                break;
            } else {
                this.distance = 0;
            }
        }
    }

    public checkOutOfBounds(screenBounds: p5.Vector[]): void {
        this.pointOfCollision = collideLinePolyWithIntersectionPoint(this.shape[0].x, this.shape[0].y, this.shape[1].x, this.shape[1].y, screenBounds);
        if (this.pointOfCollision) {
            this.distance = p5.Vector.dist(this.shape[0], new p5.Vector(this.pointOfCollision.x, this.pointOfCollision.y));
        }
    }

}