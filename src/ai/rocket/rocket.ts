import { game } from "../../index";
import { Rocket, ANGLE_SPEED } from "../../game/rocket/rocket";
import { Layer, Network, Neuron } from 'synaptic';
import { Chromosome } from "../genetic/genome";
import { GeneticUnit } from "../genetic/population";
import { GameObject } from "../../game/utils/gameObject";

const CLOSEST_ASTEROIDS_QUANTITY = 10;
export const INPUT_LAYER =
    2 /* Position to screen bounds */ +
    2 /* Direction */ +
    CLOSEST_ASTEROIDS_QUANTITY * 2/* Angle to closests asteroids */ +
    CLOSEST_ASTEROIDS_QUANTITY/* Distance to closests asteroids */;
export const OUTPUTS = 4;
export const HIDDEN_LAYER = (INPUT_LAYER + OUTPUTS) / 2;

export class AiRocket extends Rocket {
    public perceptron: Network;

    constructor(
        x: number, y: number, geneticUnit: GeneticUnit,
    ) {
        super(x, y);

        this.perceptron = this.createPerceptron(geneticUnit.genome);
        game.registerOnUpdate(() => {
            this.getDecision();
        });
        game.registerOnDraw((_p: p5) => {
        });
        game.registerOnGameOver(() => {
        });
    }

    private createPerceptron(genome: Chromosome): Network {
        const inputs = new Layer(INPUT_LAYER);
        const hidden = new Layer(HIDDEN_LAYER);
        const output = new Layer(OUTPUTS);

        inputs.project(hidden, Layer.connectionType.ALL_TO_ALL);
        hidden.project(output, Layer.connectionType.ALL_TO_ALL);

        for (let i = 0; i < inputs.list.length; i++) {
            const neuron = inputs.list[i];
            const keys = Object.keys((<any>neuron).connections.projected);
            for (let j = 0; j < keys.length; j++) {
                const connection: Neuron.Connection = (<any>neuron).connections.projected[keys[j]];
                connection.weight = genome[i * keys.length + j];
            }
        }
        for (let i = 0; i < hidden.list.length; i++) {
            const neuron = hidden.list[i];
            const keys = Object.keys((<any>neuron).connections.projected);
            for (let j = 0; j < keys.length; j++) {
                const connection: Neuron.Connection = (<any>neuron).connections.projected[keys[j]];
                connection.weight = genome[INPUT_LAYER * HIDDEN_LAYER + i * keys.length + j];
            }
        }

        return new Network({
            input: inputs,
            hidden: [hidden],
            output: output,
        })
    }

    private getClosestAsteroids(count: number): GameObject[] {
        return game.gameObjects
            .filter(v => v.tag === 'asteroid')
            .sort((a, b) => {
                const distA = p5.Vector.dist(this.position, a.position);
                const distB = p5.Vector.dist(this.position, b.position);
                if (distA < distB) {
                    return 1;
                } else if (distA > distB) {
                    return -1;
                } else {
                    return 0;
                }
            })
            .slice(0, count);
    }

    private getDecision(): void {
        const closestAsteroidsPositions: (p5.Vector | undefined)[] = this.getClosestAsteroids(CLOSEST_ASTEROIDS_QUANTITY).map(v => v.position);
        while (closestAsteroidsPositions.length < CLOSEST_ASTEROIDS_QUANTITY) {
            closestAsteroidsPositions.push(undefined);
        }

        const input: number[] = [
            this.position.x,
            this.position.y,
            this.direction.x,
            this.direction.y,
        ];
        for (const position of closestAsteroidsPositions) {
            if (position) {
                const angle = p5.Vector.sub(this.position, position).normalize();
                const distance = p5.Vector.dist(this.position, position);
                input.push(angle.x, angle.y, distance);
            } else {
                input.push(-1, -1, -1);
            }
        }

        const output = this.perceptron.activate(input);

        if (output[0] === NaN ||
            output[1] === NaN ||
            output[2] === NaN ||
            output[3] === NaN) {
            debugger;
        }

        if (Math.round(output[0])) {
            this.accelerate();
        } else {
            this.decelerate();
        }
        if (Math.round(output[1])) {
            this.changeAngle(ANGLE_SPEED);
        }
        if (Math.round(output[2])) {
            this.changeAngle(-ANGLE_SPEED);
        }
        if (Math.round(output[3])) {
            this.shoot();
        }
    }

    public getFitness(): number {
        return game.points;
    }
}