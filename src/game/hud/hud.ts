import { game } from "../../index";



export class Hud {

    public draw(p: p5): void {
        p.fill('#ffffff')
        p.textSize(32);
        p.text(`Points: ${game.points}`, 10, 50);
    }
}