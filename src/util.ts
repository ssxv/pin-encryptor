export const preparePinBlock = (pin: string): string => {
    let pinBlock = '0' + pin.length.toString() + pin;
    while (pinBlock.length <= 15) {
        pinBlock += 'F';
    }
    return pinBlock;
};

export const prepareAccountNumberBlock = (accountNumber: string, checkDigit?: boolean): string => {
    if (checkDigit) {
        accountNumber = accountNumber.substr(0, accountNumber.length - 1);
    }
    let accountNumberBlock;
    if (accountNumber.length > 12) {
        accountNumberBlock = accountNumber.substr(accountNumber.length - 12, 12);
    } else {
        accountNumberBlock = accountNumber;
        while (accountNumberBlock.length <= 12) {
            accountNumberBlock = '0' + accountNumberBlock;
        }
    }
    accountNumberBlock = '0000' + accountNumberBlock;
    return accountNumberBlock;
};
