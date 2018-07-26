
export type Chromosome = number[];

export const generate = (length: number): Chromosome => {
    const ret = [];
    for (let i = 0; i < length; i++) {
        ret.push(Math.random() * 10 - 5);
    }
    return ret;
}

export const mutate = (genome: string[], chance: number): string[] => {
    const ret: string[] = [];
    for (let v of genome) {
        ret.push(Math.random() < chance ? v === '1' ? '0' : '1' : v);
    }
    return ret;
}

export const crossover = (genome1: string[], genome2: string[]): string[][] => {
    const ret1 = [];
    const ret2 = [];
    if (genome1.length !== genome2.length) {
        throw new Error('Wrong genomes to crossover');
    }
    let pos = Math.ceil(Math.random() * genome1.length);
    ret1.push(...genome1.slice(0, pos));
    ret1.push(...genome2.slice(pos));
    ret2.push(...genome2.slice(0, pos));
    ret2.push(...genome1.slice(pos));
    return [ret1, ret2];
}
