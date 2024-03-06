import { Big } from 'big.js'

export const generateRandomDecimalInRange = (min: Big, max: Big): string => {
    const range = max.minus(min);
    const randomNum = new Big(Math.random()).times(range).plus(min);
    const multiplier = new Big(10).pow(18);
    return randomNum.times(multiplier).round().div(multiplier).toString();
}