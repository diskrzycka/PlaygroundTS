import path from 'path';
import { promises as fs } from 'fs';

export default class JSONDatabase<T> {
    private filePath: string = '';

    constructor(collection: string) {
        this.filePath = path.join(__dirname, 'data', `${collection}.json`);
    }

    private async readData(): Promise<T[]> {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data) as T[];
        } catch (error) {
            return [];
        }
    }

    private async writeData(data: T[]): Promise<void> {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
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

    public async update(filterFun: (item: T) => boolean, newItem: Partial<T>): Promise<void> {
        const data = await this.readData();
        const updatedData = data.map(item => filterFun(item) ? { ...item, ...newItem } : item);
        await this.writeData(updatedData);
    }

    public async delete(filterFun: (item: T) => boolean): Promise<void> {
        const data = await this.readData();
        const updatedData = data.filter(item => !filterFun(item));
        await this.writeData(updatedData);
    }
}