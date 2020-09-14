# pin-encryptor

An effective state management tool

```
import { Transitional, TransitionsMap } from 'pin-encryptor';

export enum WaterStatus {
    solid = 'solid',
    liquid = 'liquid',
    gas = 'gas',
}

const transitions: TransitionsMap = {
    melt: {
        from: WaterStatus.solid,
        to: WaterStatus.liquid },
    vapourize: {
        from: WaterStatus.liquid,
        to: WaterStatus.gas },
    condense: {
        from: WaterStatus.gas,
        to: WaterStatus.liquid
    },
};

export class Water extends Transitional {
    name: string;
    state: WaterStatus;

    constructor() {
        super(transitions, 'state');
    }
}

const water = new Water();
water.name = 'Some Water';
water.state = WaterStatus.solid;

console.log(water.can('melt'));

water.do('melt');

console.log(water);
```
