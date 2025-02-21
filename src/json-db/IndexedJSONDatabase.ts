import path from 'path';
import { promises as fs } from 'fs';

export default class IndexedJSONDatabase<T> {
    private filePath: string = '';
    private index: Map<any, number> | undefined;
    private indexKey: keyof T | undefined;

    constructor(collection: string, indexKey: keyof T) {
        this.filePath = path.join(__dirname, 'data', `${collection}.json`);
        this.index = new Map();
        this.indexKey = indexKey;
        this.loadIndex();
    }

    private buildIndex(data: T[]): void {
        this.index?.clear();
        data.forEach((item, index) => {
            this.index?.set(item[this.indexKey!], index);
        });
    }

    private async loadIndex(): Promise<void> {
        const data = await this.readData();
        this.buildIndex(data);
    }

    private async readData(): Promise<T[]> {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            const parsedData: T[] = JSON.parse(data);
            this.buildIndex(parsedData);
            return parsedData;
        } catch (error) {
            return [];
        }
    }

    private async writeData(data: T[]): Promise<void> {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
        this.buildIndex(data);
    }

    public async create(item: T): Promise<void> {
        const data = await this.readData();
        data.push(item);
        await this.writeData(data);
    }

    public async read(filterFun?: (item: T) => boolean): Promise<T[]> {
        const data = await this.readData();
        return filterFun ? data.filter(filterFun) : data;
    }

    async findById(id: any): Promise<T | null> {
        const data = await this.readData();
        const index = this.index?.get(id);
        return index !== undefined ? data[index] : null;
    }

    public async update(id: any, newItem: Partial<T>): Promise<void> {
        const data = await this.readData();
        const index = this.index?.get(id);
        if (index !== undefined) {
            data[index] = { ...data[index], ...newItem };
            await this.writeData(data);
        }
    }

    public async delete(id: any): Promise<void> {
        let data = await this.readData();
        data = data.filter(item => item[this.indexKey!] !== id);
        await this.writeData(data);
    }
}