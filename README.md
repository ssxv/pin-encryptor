# [pin-encryptor](https://www.npmjs.com/package/pin-encryptor)

## npm

`npm i pin-encryptor`

https://en.wikipedia.org/wiki/ISO_9564

To protect the PIN during transmission from the PIN entry device to the verifier, the standard requires that the PIN be encrypted, and specifies several formats that may be used.

The PIN block formats are:

## Format 0

The PIN block is constructed by XOR-ing two 64-bit fields: the plain text PIN field and the account number field, both of which comprise 16 four-bit nibbles (16-digit hex).

The plain text PIN field is:

- one nibble with the value of 0, which identifies this as a format 0 block
- one nibble encoding the length N of the PIN
- N nibbles, each encoding one PIN digit
- 14−N nibbles, each holding the "fill" value 15 (i.e. 11112)

The account number field is:

- four nibbles with the value of zero
- 12 nibbles containing the right-most 12 digits of the primary account number (PAN), excluding the check digit

```
import { PinEncryptor } from 'pin-encryptor';

const p = PinEncryptor.format0('1529', '123456789177');
console.log(p, p.length);   // 041528dcba9876e8 16
```

## Format 1

This format should be used where no Account number is available. The PIN block is constructed by concatenating the PIN with a transaction number thus:

- one nibble with the value of 1, which identifies this as a format 1 block
- one nibble encoding the length N of the PIN
- N nibbles, each encoding one PIN digit
- 14−N nibbles encoding a unique value, which may be a transaction sequence number, time stamp or random number

```
import { PinEncryptor } from 'pin-encryptor';

const p = PinEncryptor.format1('1529', '123456789177');
console.log(p, p.length);   // 1415291234567891 16
```

## Format 2

Format 2 is for local use with off-line systems only, e.g. smart cards. The PIN block is constructed by concatenating the PIN with a filler value thus:

- one nibble with the value of 2, which identifies this as a format 2 block
- one nibble encoding the length N of the PIN
- N nibbles, each encoding one PIN digit
- 14−N nibbles, each holding the "fill" value 15 (i.e. 11112)
  (Except for the format value in the first nibble, this is identical to the plain text PIN field of format 0.)

```
import { PinEncryptor } from 'pin-encryptor';

const p = PinEncryptor.format2('1529');
console.log(p, p.length);   // 241529FFFFFFFFFF 16
```

## Format 3

Format 3 is the same as format 0, except that the "fill" digits are random values from 10 to 15, and the first nibble (which identifies the block format) has the value 3.

```
import { PinEncryptor } from 'pin-encryptor';

const p = PinEncryptor.format3('1529');
console.log(p, p.length);   // 341529DFBADABBFC 16
```
