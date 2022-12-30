
export const roundValue = (value: number) => {
    let roundedValue: number;

    if (value > 0.1) {
        roundedValue = (Math.round((value + Number.EPSILON) * 10) | 0) / 10;
    } else {
        roundedValue = (Math.round((value + Number.EPSILON) * 100) | 0) / 100;
    }
    return roundedValue;
}

export const showKW = (threshold_in_k:number, value: number) => {
    if (threshold_in_k !== undefined && Math.abs(value) < threshold_in_k * 1000) {
        return false;
    }
    return true;
}