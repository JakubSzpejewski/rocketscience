import { Chromosome, generate, crossover, mutate } from "./genome";
import { ARMS_QUANTITY, HIDDEN_LAYER, OUTPUTS } from "../rocket/rocket";
import { Network } from 'synaptic';

const POPULATION_SIZE = 100;
const CHANCE_TO_MUTATE = 0.008;

export interface GeneticUnit {
    genome: Chromosome;
    randomSeed?: string;
    perceptron?: Network
    fitness?: number;
}

export class Population {
    public currentPopulation: GeneticUnit[] = [];


    constructor(
        populationToInit?: GeneticUnit[],
    ) {
        if (populationToInit) {
            this.currentPopulation = populationToInit;
            this.newGeneration();
        }
        if (!this.currentPopulation || !this.currentPopulation.length) {
            for (let i = 0; i < POPULATION_SIZE; i++) {
                this.currentPopulation.push(this.newUnit());
            }
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
        for (const geneticUnit of this.currentPopulation) {
            if (geneticUnit.fitness === undefined) {
                throw new Error('Need to calculate fitness for: ' + geneticUnit);
            }
        }
        do {

            let unitsToReproduce = [this.newUnit({ genome: this.select(this.currentPopulation).genome }), this.newUnit({ genome: this.select(this.currentPopulation).genome })];

            let unitsToReproduceGenomeAsBits: string[][] = [];

            for (const unit of unitsToReproduce) {
                const weightBits = unit.genome.map(v => ((v + 5) * ((<any>Number).MAX_SAFE_INTEGER / 10)).toString(2));
                unitsToReproduceGenomeAsBits.push(weightBits.map(v => {
                    while (v.length < 53) {
                        v += '0';
                    }
                    return v;
                }).join('').split(''));
            }

            const crossovered = crossover(unitsToReproduceGenomeAsBits[0], unitsToReproduceGenomeAsBits[1]);
            const mutated: string[][] = [];
            for (const unit of crossovered) {
                mutated.push(mutate(unit, CHANCE_TO_MUTATE));
            }
            const genome: number[][] = [];
            for (const genomeAsBit of mutated) {
                const bitString = genomeAsBit.join('');
                const genomesAsBitsArray = bitString.match(new RegExp('.{1,' + 53 + '}', 'g'));
                if (!genomesAsBitsArray) {
                    throw new Error('something');
                }
                genome.push(genomesAsBitsArray.map(v => (parseInt(v, 2) / ((<any>Number).MAX_SAFE_INTEGER / 10) - 5)));
            }
            unitsToReproduce = [this.newUnit({ genome: genome[0] }), this.newUnit({ genome: genome[1] })];

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