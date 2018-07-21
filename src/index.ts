import { Game, GameState } from './game/game';
import { Hud } from './game/hud/hud';
import { Population, GeneticUnit } from './ai/genetic/population';
import { AiRocket } from './ai/rocket/rocket';

export const CANVAS_WIDTH: number = 1500;
export const CANVAS_HEIGHT: number = 1000;
export const CANVAS_OFFSET: number = 100;


export let game: Game;



const hud: Hud = new Hud();
let startHumanGame = () => {
    new p5((p: p5) => {
        game = new Game();
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
}

let inspectGame = (geneticUnit: GeneticUnit): p5 => {
    return new p5((p: p5) => {
        game = new Game(geneticUnit);
        p.setup = () => {
            const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
            (<any>canvas).parent('canvasContainer');
            game.startGame();
        };

        p.draw = () => {

            p.background(51);

            if (game.state === GameState.running) {
                game.update(p);
                game.draw(p);

                hud.drawPoints(p);
            } else if (game.state === GameState.over) {
                game.draw(p);
                hud.drawPoints(p);
            }
        }
    });
}


let startAiGame = (generations: number): Population => {
    const population = new Population();
    for (let i = 0; i < generations; i++) {
        console.log(population);
        for (const geneticUnit of population.currentPopulation) {
            game = new Game(geneticUnit);

            const processing = new p5((p: p5) => { p.draw = () => { p.noLoop() } });

            game.startGame();
            while (true) {
                game.update(processing);
                game.registerOnGameOver(() => {
                    geneticUnit.perceptron = (<AiRocket>game.gameObjects[0]).perceptron;
                    geneticUnit.fitness = (<AiRocket>game.gameObjects[0]).getFitness();
                });
                if (game.state === GameState.over) {
                    break;
                }
            }
        }
        population.newGeneration();
    }
    return population;
}



(<any>window).startHumanGame = startHumanGame;
(<any>window).startAiGame = startAiGame;

const population = startAiGame(10);
const flatPopulation: GeneticUnit[] = [];
population.generations.map(v => flatPopulation.push(...v));
flatPopulation.sort((a, b) => {
    if (a.fitness! > b.fitness!) return -1;
    if (a.fitness! < b.fitness!) return 1;
    return 0;
});
inspectGame(flatPopulation[0]);
