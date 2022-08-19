import Vue from 'vue';
declare const _default: import("vue/types/vue").ExtendedVue<Vue<Record<string, any>, Record<string, any>, never, never, (event: string, ...args: any[]) => Vue<Record<string, any>, Record<string, any>, never, never, any>>, {
    internalValue: number;
}, {
    changeDigit(newVal: number, digit: number): Promise<boolean>;
    changeFocus(reverse: boolean, digit: number): Promise<boolean>;
    handleKey(event: KeyboardEvent, digit: number): Promise<void>;
    getClass(digit: number): string;
    handleClick(event: MouseEvent): Promise<void>;
    handleInputEvent(event: InputEvent, digit: number): Promise<void>;
    handleWheelEvent(event: WheelEvent, digit: number): Promise<void>;
    bumpDigit(positive: boolean, digit: number): Promise<void>;
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
    name: string;
    value: number;
    precision: number;
    width: number;
    max: number | undefined;
    min: number | undefined;
}, {}>;
export default _default;
