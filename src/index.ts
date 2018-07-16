import { Game } from './game/game';

export let game: Game = new Game();

new p5((p: p5) => {
    p.setup = () => {
        const canvas = p.createCanvas(1200, 800);
        (<any>canvas).parent('canvasContainer');
    };

    p.draw = () => {

        p.background(51);

        game.update(p);
        game.draw(p);
    }
});