# [pin-encryptor](https://www.npmjs.com/package/pin-encryptor)

https://en.wikipedia.org/wiki/ISO_9564

To protect the PIN during transmission from the PIN entry device to the verifier, the standard requires that the PIN be encrypted, and specifies several formats that may be used.

The PIN block formats are:

## Format 0

The PIN block is constructed by XOR-ing two 64-bit fields: the plain text PIN field and the account number field, both of which comprise 16 four-bit nibbles (16-digit hex).

The plain text PIN field is:

-   one nibble with the value of 0, which identifies this as a format 0 block
-   one nibble encoding the length N of the PIN
-   N nibbles, each encoding one PIN digit
-   14−N nibbles, each holding the "fill" value 15 (i.e. 11112)

The account number field is:

-   four nibbles with the value of zero
-   12 nibbles containing the right-most 12 digits of the primary account number (PAN), excluding the check digit

```
import { PinEncryptor } from 'pin-encryptor';

const p = PinEncryptor.format0('1529', '123456789177');
console.log(p, p.length);   // 041528dcba9876e8 16
```

```
const pinBlock = PinEncryptor.format0('1529', '1231312312');
const p = PinEncryptor.encrypt('mysecret', pinBlock);
console.log(p);             // d30eb09b0110a91fd827d1e80ec48436
```
