import { game, CANVAS_WIDTH, CANVAS_HEIGHT } from "../../index";



export class Hud {
    public drawPoints(p: p5): void {
        p.push();
        p.fill('#ffffff');
        p.textSize(32);
        p.text(`Points: ${game.points}`, 10, 50);
        p.pop();
    }


    public menu(p: p5): void {
        p.push();
        p.fill('#ffffff');
        p.textSize(64);
        p.textAlign(p.CENTER, p.CENTER);;
        p.text(`Press enter to start`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        p.pop();
    }

    public gameOver(p: p5): void {
        p.push();
        p.fill('#ffffff');
        p.textSize(64);
        p.textAlign(p.CENTER, p.CENTER);;
        p.text(`YOU LOST.`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 64);
        p.text(`YOUR SCORE: ${game.points}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        p.text(`Press enter to start`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 64);
        p.pop();
    }
}