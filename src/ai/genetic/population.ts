import { Genome, generate, crossover, mutate } from "./genome";
import { ARMS_QUANTITY, HIDDEN_LAYER, OUTPUTS } from "../rocket/rocket";
import { Network } from 'synaptic';

const POPULATION_SIZE = 100;
const CHANCE_TO_CROSSOVER = 0.3;
const CHANCE_TO_MUTATE = 0.1;

export interface GeneticUnit {
    genome: Genome;
    randomSeed?: string;
    perceptron?: Network
    fitness?: number;
}

export class Population {
    public currentPopulation: GeneticUnit[] = [];
    public generations: GeneticUnit[][] = [];


    constructor(

    ) {
        if (!this.currentPopulation || !this.currentPopulation.length) {
            for (let i = 0; i < POPULATION_SIZE; i++) {
                this.currentPopulation.push(this.newUnit());
            }
            this.generations.push(this.currentPopulation);
        }
    }

    private newUnit(base?: GeneticUnit): GeneticUnit {
        return {
            genome: base ? base.genome : generate(ARMS_QUANTITY * HIDDEN_LAYER + HIDDEN_LAYER * OUTPUTS),
            randomSeed: Math.random().toString(36).substr(2),
        }
    }

    public newGeneration(): GeneticUnit[] {
        const nextPopulation: GeneticUnit[] = [];

        this.generations.push(this.currentPopulation);
        for (const geneticUnit of this.currentPopulation) {
            if (geneticUnit.fitness === undefined) {
                throw new Error('Need to calculate fitness for: ' + geneticUnit);
            }
        }
        do {
            let unitsToReproduce = [this.newUnit({ genome: this.select(this.currentPopulation).genome }), this.newUnit({ genome: this.select(this.currentPopulation).genome })];
            nextPopulation.push(...unitsToReproduce);

            if (Math.random() < CHANCE_TO_CROSSOVER) {
                const crossovered = crossover(unitsToReproduce[0].genome, unitsToReproduce[1].genome);
                unitsToReproduce = [this.newUnit({ genome: crossovered[0] }), this.newUnit({ genome: crossovered[1] })];
            }
            for (const unit of unitsToReproduce) {
                nextPopulation.push(this.newUnit({ genome: mutate(unit.genome, CHANCE_TO_MUTATE) }));
            }
            nextPopulation.push(this.newUnit());
            nextPopulation.push(this.newUnit());
            nextPopulation.push(this.newUnit());
        } while (nextPopulation.length < this.currentPopulation.length)
        return this.currentPopulation = nextPopulation;
    }

    private select(population: GeneticUnit[]): GeneticUnit {
        let weight = Math.random() * population.reduce((prev: number, curr) => prev + curr.fitness!, 0);

        for (const geneticUnit of this.currentPopulation) {
            if (weight < geneticUnit.fitness!) {
                return geneticUnit;
            }
            weight -= geneticUnit.fitness!;
        }
        throw new Error('Select didn\'t select');
    }


}