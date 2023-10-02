import { randomBytes } from 'crypto';

export default class KeyGenerator {
    public generateKey(lengthInBits: number = 256) {
        const lengthInBytes = Math.ceil(lengthInBits / 8);
        const randomData = randomBytes(lengthInBytes);
        const randomKey = randomData.toString('hex');

        return randomKey;
    }
}
