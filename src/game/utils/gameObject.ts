import { game } from "../../index";

export abstract class GameObject {
    public abstract tag: string;

    public abstract position: p5.Vector;
    public abstract direction: p5.Vector;

    constructor() {
        game.gameObjects.push(this);
    }

    public abstract update(p?: p5): void;
    public abstract draw(p: p5): void;
    public onDestroy(): void {
        game.gameObjects.splice(game.gameObjects.indexOf(this), 1);
    }
}