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
        (<any>Math).seedrandom(geneticUnit.randomSeed);
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

const wait = (): Promise<void> => {
    return new Promise(r => window.setTimeout(r, 0));
}

const averageFitness: number[] = [];

let startAiGame = async (generations: number, lastPopulation?: GeneticUnit[]): Promise<Population> => {
    const population = new Population(lastPopulation);
    const processing = new p5((p: p5) => { p.draw = () => { p.noLoop() } });
    for (let i = 0; i < generations; i++) {
        for (const geneticUnit of population.currentPopulation) {
            (<any>Math).seedrandom(geneticUnit.randomSeed);
            game = new Game(geneticUnit);
            game.startGame();
            let current, timer = Date.now();
            while (current = Date.now()) {
                game.update(processing);
                game.registerOnGameOver(() => {
                    geneticUnit.fitness = (<AiRocket>game.gameObjects[0]).getFitness();
                });
                if (game.state === GameState.over) {
                    break;
                }
                if (current - timer > 100) {
                    timer = Date.now();
                    await wait();
                }

            }
        }
        localStorage.setItem('population', JSON.stringify(population.currentPopulation));
        console.log(population);
        (<any>Math).seedrandom();
        averageFitness.push(population.currentPopulation.reduce((prev: number, current) => prev + current.fitness!, 0) / population.currentPopulation.length);
        if (i < generations - 1) {
            population.newGeneration();
        }
    }
    return population;
}

(<any>window).startHumanGame = startHumanGame;
(<any>window).startAiGame = startAiGame;

const lastPopulation = localStorage.getItem('population');
console.log(lastPopulation);
let parsedLastPopulation: GeneticUnit[] | undefined;
if (lastPopulation) {
    parsedLastPopulation = JSON.parse(lastPopulation);    
}

const populationPromise = startAiGame(10, parsedLastPopulation);

populationPromise.then((population) => {
    console.log(averageFitness);

    population.currentPopulation.sort((a, b) => {
        if (a.fitness! > b.fitness!) return -1;
        if (a.fitness! < b.fitness!) return 1;
        return 0;
    });
    inspectGame(population.currentPopulation[0]);

});
