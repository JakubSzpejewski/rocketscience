import { Game, GameState } from './game/game';
import { Hud } from './game/hud/hud';
import { } from 'seedrandom';

export const CANVAS_WIDTH: number = 1500;
export const CANVAS_HEIGHT: number = 1000;
export const CANVAS_OFFSET: number = 100;
export let game: Game = new Game();



const hud: Hud = new Hud();
new p5((p: p5) => {
    p.setup = () => {
        const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        (<any>canvas).parent('canvasContainer');
    };

    p.draw = () => {

        p.background(51);

        if (game.state === GameState.running) {
            game.update(p);
            game.draw(p);

            hud.drawPoints(p);
        } else if (game.state === GameState.notRunning) {
            hud.menu(p);
            if (p.keyIsDown(13)) {
                game.startGame();
            }
        } else if (game.state === GameState.over) {
            hud.gameOver(p);
            if (p.keyIsDown(13)) {
                game.startGame();
            }
        }

    }
});
