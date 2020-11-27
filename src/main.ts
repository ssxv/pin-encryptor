import * as xor from 'buffer-xor';
import { preparePinBlockFormat0, prepareAccountNumberBlock, preparePinBlockFormat1, preparePinBlockFormat2, preparePinBlockFormat3 } from './util';

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
        const pinBlock = preparePinBlockFormat0(pin);
        const accountNumberBlock = prepareAccountNumberBlock(accountNumber, accountNumberHasCheckDigit);
        const pinBlockBuffer = Buffer.from(pinBlock, 'hex');
        const accountNumberBlockBuffer = Buffer.from(accountNumberBlock, 'hex');
        return xor(pinBlockBuffer, accountNumberBlockBuffer).toString('hex');
    }

    /**
     * This format should be used where no PAN is available.
     * The PIN block is constructed by concatenating the PIN with a transaction number.
     *
     * @param pin string
     * @param uniqueSequence string
     */
    static format1(pin: string, uniqueSequence: string): string {
        const pinBlock = preparePinBlockFormat1(pin, uniqueSequence);
        return pinBlock;
    }

    static format2(pin: string): string {
        const pinBlock = preparePinBlockFormat2(pin);
        return pinBlock;
    }

    static format3(pin: string): string {
        const pinBlock = preparePinBlockFormat3(pin);
        return pinBlock;
    }
}
