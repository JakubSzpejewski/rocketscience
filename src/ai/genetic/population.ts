import { Chromosome, generate, crossover, mutate } from "./genome";
import { INPUT_LAYER, HIDDEN_LAYER, OUTPUTS } from "../rocket/rocket";
import { Network } from 'synaptic';

const POPULATION_SIZE = 200;
const CHANCE_TO_CROSSOVER = 0.65;
const CHANCE_TO_MUTATE = 0.001;

export interface GeneticUnit {
    genome: Chromosome;
    randomSeed?: string;
    perceptron?: Network
    fitness?: number;
}

const fiftyThreeZeroes = '00000000000000000000000000000000000000000000000000000';

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
            genome: base ? base.genome : generate(INPUT_LAYER * HIDDEN_LAYER + HIDDEN_LAYER * OUTPUTS),
            randomSeed: 'pqoskdwja'//Math.random().toString(36).substr(2),
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
                unitsToReproduceGenomeAsBits.push(unit.genome.map(v => (fiftyThreeZeroes + Math.round(((v + 5) * ((<any>Number).MAX_SAFE_INTEGER / 10))).toString(2)).substr(-53)).join('').split(''));
            }

            if (Math.random() < CHANCE_TO_CROSSOVER) {
                unitsToReproduceGenomeAsBits = crossover(unitsToReproduceGenomeAsBits[0], unitsToReproduceGenomeAsBits[1]);
            }
            const mutated: string[][] = [];
            for (const unit of unitsToReproduceGenomeAsBits) {
                mutated.push(mutate(unit, CHANCE_TO_MUTATE));
            }
            const genome: number[][] = [];
            for (const mutatedUnit of mutated) {
                const genomesAsBitsArray: string[] = [];
                while (mutatedUnit.length > 0) {
                    const cutgenome = mutatedUnit.splice(0, 53).join('');
                    if (cutgenome.length > 53) {
                        throw new Error('eee');
                    }
                    genomesAsBitsArray.push(cutgenome);
                }

                genome.push(genomesAsBitsArray.map(v => ((parseInt(v, 2)) / ((<any>Number).MAX_SAFE_INTEGER / 10)) - 5));
            }
            nextPopulation.push(...[this.newUnit({ genome: genome[0] }), this.newUnit({ genome: genome[1] })]);

        } while (nextPopulation.length < this.currentPopulation.length)
        return this.currentPopulation = nextPopulation;
    }

    private select(population: GeneticUnit[]): GeneticUnit {
        let weight = Math.random() * population.reduce((prev: number, curr) => prev + curr.fitness!, 0);

        for (const geneticUnit of population) {
            if (weight < geneticUnit.fitness!) {
                return geneticUnit;
            }
            weight -= geneticUnit.fitness!;
        }
        throw new Error('Select didn\'t select');
    }


}