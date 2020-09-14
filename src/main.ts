import * as xor from 'buffer-xor';
import { preparePinBlock, prepareAccountNumberBlock } from './util';

export class PinEncryptor {

    /**
     * The PIN block is constructed by XOR-ing two 64-bit (16-bit hex) fields:
     * the plain text PIN field and the account number field,
     * both of which comprise 16-bit hex.
     *
     * @param pin string
     * @param accountNumber string
     */
    static format0(pin: string, accountNumber: string, accountNumberHasCheckDigit?: boolean): string {
        const pinBlock = preparePinBlock(pin);
        const accountNumberBlock = prepareAccountNumberBlock(accountNumber, accountNumberHasCheckDigit);
        const pinBlockBuffer = Buffer.from(pinBlock, 'hex');
        const accountNumberBlockBuffer = Buffer.from(accountNumberBlock, 'hex');
        return xor(pinBlockBuffer, accountNumberBlockBuffer).toString('hex');
    }
}
