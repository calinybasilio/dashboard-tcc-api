import * as crypto from 'crypto';

export default class CriptPasswordSerive {

    constructor() { };

    static encrypt(password: string): string {
        const passwordEncrypted = crypto.createHmac('sha256', password).digest('hex');
        return passwordEncrypted;
    }

    static decrypt(password: string, passwordEncrypted: string): boolean {
        return passwordEncrypted === crypto.createHmac('sha256', password).digest('hex');
    }

}