export default class {

    private static aesKey: string;

    static setKey() {
        if (process.env.key === undefined) throw new Error("Key not set or unaccesible!")
        else this.aesKey = process.env.key;
    }

    static getKey(): string {
        return this.aesKey;
    }

}