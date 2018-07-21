import { game, CANVAS_HEIGHT, CANVAS_WIDTH } from "../../index";
import { PIXELS_FROM_POSITION, Rocket, ANGLE_SPEED } from "../../game/rocket/rocket";
import { Arm, ARM_LENGTH } from "./arm";
import { Layer, Network, Neuron } from 'synaptic';
import { Genome } from "../genetic/genome";
import { GeneticUnit } from "../genetic/population";

export const ARMS_QUANTITY = 16;
export const HIDDEN_LAYER = 10;
export const OUTPUTS = 4;

export class AiRocket extends Rocket {
    public arms: Arm[] = [];
    public perceptron: Network;

    constructor(
        x: number, y: number, geneticUnit: GeneticUnit,
    ) {
        super(x, y);

        this.perceptron = this.createPerceptron(geneticUnit.genome);
        for (let i = 0; i < ARMS_QUANTITY; i++) {
            this.arms[i] = new Arm(2 * Math.PI / ARMS_QUANTITY * i);
        }
        game.registerOnUpdate((p: p5) => {
            this.updateArms();
            this.getDecision(p);
        });
        game.registerOnDraw((p: p5) => {
            for (const arm of this.arms) {
                arm.draw(p);
            }
        });
        game.registerOnGameOver(() => {
            this.arms = [];
        });
    }

    private createPerceptron(genome: Genome): Network {
        const inputs = new Layer(ARMS_QUANTITY);
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
                connection.weight = genome[ARMS_QUANTITY * HIDDEN_LAYER + i * keys.length + j];
            }
        }

        return new Network({
            input: inputs,
            hidden: [hidden],
            output: output,
        })
    }

    private updateArms(): void {
        for (const arm of this.arms) {
            arm.update(p5.Vector.add(this.position, new p5.Vector(0, -PIXELS_FROM_POSITION)));

            arm.checkOutOfBounds([new p5.Vector(0, 0), new p5.Vector(CANVAS_WIDTH, 0), new p5.Vector(CANVAS_WIDTH, CANVAS_HEIGHT), new p5.Vector(0, CANVAS_HEIGHT)]);
            arm.collisions(game.gameObjects);
        }
    }
    private getDecision(p: p5): void {
        const distances = this.arms.map(v => v.distance);

        const normalize = (v: number) => (v / ARM_LENGTH) * 12 - 6;
        const normalized = distances.map(normalize);

        const output = this.perceptron.activate(normalized);


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
            this.shoot(p);
        }
    }

    public getFitness(): number {
        return game.points;
    }
}