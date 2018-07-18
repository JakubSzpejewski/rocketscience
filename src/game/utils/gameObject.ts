import { game } from "../../index";

let id = 0;
const getId = (): number => {
    return id++;
}

export abstract class GameObject {
    public id: number = getId();
    public abstract tag: string;

    public abstract position: p5.Vector;
    public abstract direction: p5.Vector;

    public abstract priority: number;

    public abstract shape: p5.Vector[];

    constructor() {
        game.gameObjects.push(this);
    }

    public abstract update(p?: p5): void;
    public abstract draw(p: p5): void;
    public onDestroy(): void {
        const index = game.gameObjects.map(v => v.id).indexOf(this.id);
        if (index !== -1) {
            game.gameObjects.splice(index, 1);
        }
    }

    public abstract onCollision(gameObject: GameObject): boolean;
}