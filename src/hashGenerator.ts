import { createHmac } from 'crypto';

export default class HashGenerator {
    public calculateHMAC = (key: string, data: string) => {
        const hmac = createHmac('sha3-256', key);
        hmac.update(data);
        const result = hmac.digest('hex');

        return result;
    };

    public verifyHMAC = (key: string, data: string, receivedHMAC: string): boolean => {
        const calculatedHMAC = this.calculateHMAC(key, data);
        return calculatedHMAC === receivedHMAC;
    };
}
