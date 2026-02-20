export const preparePinBlockFormat0 = (pin: string): string => {
  let pinBlock = '0' + pin.length.toString() + pin;
  while (pinBlock.length <= 15) {
    pinBlock += 'F';
  }
  return pinBlock;
};

export const preparePinBlockFormat1 = (pin: string, uniqueSequence: string): string => {
  const pinBlock = '1' + pin.length.toString() + pin + uniqueSequence;
  return pinBlock.slice(0, 16);
};

export const preparePinBlockFormat2 = (pin: string): string => {
  let pinBlock = '2' + pin.length.toString() + pin;
  while (pinBlock.length <= 15) {
    pinBlock += 'F';
  }
  return pinBlock;
};

export const preparePinBlockFormat3 = (pin: string): string => {
  let pinBlock = '3' + pin.length.toString() + pin;
  while (pinBlock.length <= 15) {
    const chars = ['A', 'B', 'C', 'D', 'E', 'F'];
    const random = Math.floor(Math.random() * chars.length);
    pinBlock += chars[random];
  }
  return pinBlock;
};

export const prepareAccountNumberBlock = (accountNumber: string, checkDigit?: boolean): string => {
  if (checkDigit) {
    accountNumber = accountNumber.slice(0, -1);
  }
  let accountNumberBlock;
  if (accountNumber.length > 12) {
    accountNumberBlock = accountNumber.slice(-12);
  } else {
    accountNumberBlock = accountNumber;
    while (accountNumberBlock.length <= 12) {
      accountNumberBlock = '0' + accountNumberBlock;
    }
  }
  accountNumberBlock = '0000' + accountNumberBlock;
  return accountNumberBlock;
};
