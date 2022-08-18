import Vue from 'vue';
declare const _default: import("vue/types/vue").ExtendedVue<Vue<Record<string, any>, Record<string, any>, never, never, (event: string, ...args: any[]) => Vue<Record<string, any>, Record<string, any>, never, never, any>>, {
    internalValue: number;
}, {
    changeDigit(newVal: number, digit: number): boolean;
    changeFocus(reverse: boolean, digit: number): boolean;
    handleKey(event: KeyboardEvent, digit: number): void;
    getClass(digit: number): string;
    handleClick(event: MouseEvent): void;
    handleInputEvent(event: InputEvent, digit: number): void;
    handleWheelEvent(event: WheelEvent, digit: number): void;
    bumpDigit(positive: boolean, digit: number): void;
}, {
    digits: string[];
    maxValue: number;
    minValue: number;
    wholeDigits: number;
}, {
    allowNegative: boolean;
    centerClass: string;
    digitClass: string;
    leftClass: string;
    rightClass: string;
    value: number;
    precision: number;
    width: number;
    max: number | undefined;
    min: number | undefined;
}, {}>;
export default _default;
