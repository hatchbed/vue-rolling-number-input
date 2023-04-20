<template>
  <span class="rolling-number-input-grid">
    <!-- Every digit and symbol in the value gets broken up into its own input element -->
    <input
      v-for="(digit, index) in digits"
      ref="inputs"
      :key="index"
      :value="digit"
      :class="getClass(index)"
      @keydown="handleKey($event, index)"
      @input="handleInputEvent($event, index)"
      @wheel="handleWheelEvent($event, index)"
      @click="handleClick($event)"
    >
    <!-- Create a hidden, named input element that is set to the real value so it can be submitted with forms -->
    <span>
      <input
        type="hidden"
        :name="name"
        :value="'' + state.internalValue"
      >
    </span>
  </span>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, reactive, ref, watch, withDefaults} from 'vue'

const props = withDefaults(defineProps<{
    allowNegative?: boolean
    centerClass?: string
    digitClass?: string
    leftClass?: string
    rightClass?: string
    name?: string
    modelValue: number
    precision?: number
    width: number
    max?: number
    min?: number
}>(), {
    allowNegative: false,
    centerClass: 'rolling-number-input-center',
    digitClass: 'rolling-number-input-digit',
    leftClass: 'rolling-number-input-left',
    rightClass: 'rolling-number-input-right',
    name: '',
    modelValue: 0,
    precision: 0,
    max: undefined,
    min: undefined,
})

const emit = defineEmits<{
    (e: 'input', value: number): void
    (e: 'change', value: number): void
}>()

const state = reactive({internalValue: props.modelValue})

const inputs = ref<HTMLInputElement[] | null>(null)

const digits = computed(() => {
    if (props.precision < 0 || props.width < 1) {
        // These are invalid values, so just return an empty array
        return []
    }
    const valueStr = Math.abs(state.internalValue).toFixed(props.precision)
    const values = new Array(props.width).fill("0")
    const offset = props.width - valueStr.length
    for (let i = valueStr.length - 1; i >= 0; i--) {
        values[i + offset] = valueStr.charAt(i)
    }
    if (props.allowNegative) {
        if (state.internalValue >= 0) {
            values[0] = '+'
        } else {
            values[0] = '-'
        }
    }
    return values
})

const maxValue = computed(() => {
    // If no max is explicitly set, set it to the largest value that can fit into our number of digits
    return props.max ? props.max : Math.pow(10, wholeDigits.value) - Math.pow(10, -props.precision)
})

const minValue = computed(() => {
    // If no min value is explicitly set, it is 0 if negative numbers are not allowed; otherwise, the inverse of the max
    return props.min ? props.min : props.allowNegative ? -maxValue.value : 0
})

const wholeDigits = computed(() => {
    // Count the number of digits we have for actually representing numbers
    return props.width - props.precision - (props.allowNegative ? 1 : 0) - (props.precision > 0 ? 1 : 0)
})

watch(() => props.modelValue, (newVal, oldVal) => {
    // const newFloat = parseFloat(newVal)
    if (newVal !== oldVal) {
        if (isNaN(newVal)) {
            state.internalValue = 0
        } else {
            state.internalValue = newVal
        }
    }
})

watch(() => state.internalValue, (newVal, oldVal) => {
    // const newFloat = parseFloat(newVal)
    if (newVal !== oldVal) {
        emit('input', newVal)
        emit('change', newVal)
    }
})


const changeDigit = async (newVal: number, digit: number): Promise<boolean> => {
    if (digit < 0 || digit >= digits.value.length || parseInt(digits.value[digit]) === newVal) {
        return false
    }
    const digitStr = digits.value.map((value, index) => index === digit ? newVal : value).join('')
    state.internalValue = parseFloat(digitStr)
    return true
}
const changeFocus = async (reverse: boolean, digit: number): Promise<boolean> => {
    let nextDigit = digit + (reverse ? -1 : 1)
    if (nextDigit < digits.value.length && digits.value[nextDigit] === '.') {
        nextDigit += reverse ? -1 : 1
    }
    if (inputs.value && nextDigit < digits.value.length && nextDigit >= (props.allowNegative ? 1 : 0)) {
        const inputEl = inputs.value[nextDigit]
        inputEl.focus()
        return true
    }
    return false
}
const handleKey = async (event: KeyboardEvent, digit: number) => {
    const currentValue = digits.value[digit]
    const value = parseInt(event.key)

    // If the user presses "-" or "+", change the sign of the value regardless of where the
    // cursor is.
    if (event.key === '-' && props.allowNegative) {
        state.internalValue = -Math.abs(state.internalValue)
        if (props.min) {
            state.internalValue = Math.max(props.min, state.internalValue)
        }
        event.preventDefault()
        return
    } else if (event.key === '+') {
        state.internalValue = Math.abs(state.internalValue)
        if (props.max) {
            state.internalValue = Math.min(props.max, state.internalValue)
        }
        event.preventDefault()
        return
    }

    if (currentValue === '.' || currentValue === '+' || currentValue === '-' || digit < 0 ||
        digit >= digits.value.length || parseInt(currentValue) === value) {
        // If the focus is on the sign or dot, or if the digit is out of bounds, or if the user typed
        // the same number that is already in the field, we don't want to trigger an input event.
        event.preventDefault()
    }

    if (parseInt(currentValue) === value) {
        // But if they typed the same number that is already in the field, they probably want to go to the next field.
        await changeFocus(false, digit)
        return
    }

    if (event.key === 'ArrowUp') {
        // If the user hits the up or down keys, change the value in the current field without changing focus.
        await bumpDigit(true, digit)
        event.preventDefault()
        return
    }
    if (event.key === 'ArrowDown') {
        await bumpDigit(false, digit)
        event.preventDefault()
        return
    }

    if (value >= 0 && value <= 9) {
        // Otherwise, if props is a valid value, just return.  An input event will be triggered and the input
        // will be handled there.
        return
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab') {
        // At props point, we want to handle keys that the user might use to navigate between the fields, which
        // include left, right, and tab; ignore any other key.
        if (isNaN(value)) {
            // Furthermore, prevent any non-navigational keys from doing anything
            event.preventDefault()
        }
        return
    }

    const reverse = event.key === 'ArrowLeft' || (event.shiftKey && event.key === 'Tab')
    if (await changeFocus(reverse, digit)) {
        event.preventDefault()
    }
}
const getClass = (digit: number) => {
    if (digit === 0) {
        let base = `${props.digitClass} ${props.leftClass}`
        if (props.width === 1) {
            base += ' rolling-number-input-single'
        }
        if (props.width === 2) {
            base += ' rolling-number-input-left-two-digits'
        }
        return base
    } else if (digit === props.width - 1) {
        return `${props.digitClass} ${props.rightClass}`
    } else {
        return `${props.digitClass} ${props.centerClass}`
    }
}
const handleClick = async (event: MouseEvent) => {
    if (event.currentTarget instanceof HTMLInputElement) {
        event.currentTarget.select()
    }
}
const handleInputEvent = async (event: InputEvent, digit: number) => {
    if (event.data) {
        if (!await changeDigit(parseInt(event.data), digit)) {
            event.preventDefault()
        } else {
            await changeFocus(false, digit)
        }
    }
}
const handleWheelEvent = async (event: WheelEvent, digit: number) => {
    if ((props.allowNegative && digit === 0) || (props.precision > 0 && digit === props.width - props.precision - 1)) {
        event.preventDefault()
        return
    }

    if (event.deltaY < 0) {
        await bumpDigit(true, digit)
    } else if (event.deltaY > 0) {
        await bumpDigit(false, digit)
    }
}
const bumpDigit = async (positive: boolean, digit: number) => {
    const precisionOffset = props.width - props.precision
    const place = Math.pow(10, precisionOffset - digit - ((digit >= precisionOffset) ? 1 : 2) - (props.precision === 0 ? -1 : 0))

    if (positive) {
        state.internalValue += place
    } else {
        state.internalValue -= place
    }
    state.internalValue = await round(Math.max(minValue.value, Math.min(state.internalValue, maxValue.value)), props.precision)
}
const round = async (value: number, decimals: number) => {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}
</script>

<style scoped>
.rolling-number-input-grid {
    position: relative;
    display: inline-grid;
    column-gap: 0;
    border-radius: 5px;
    box-sizing: content-box;
    /*width: 100%;*/
}

.rolling-number-input-grid > input {
    grid-row: 1;
    border: none;
    border-right: 1px solid black;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    outline: none;
}

.rolling-number-input-grid > input:hover {
    border: 4px #1867c0 solid;
    margin: -3px -3px -4px -4px;
    z-index: 10;
    border-radius: 5px;
}

.rolling-number-input-grid > input:first-of-type {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-left: 1px solid black;
}

.rolling-number-input-grid > input:first-of-type:hover {
    border-left: 4px #1867c0 solid;
    margin-left: -3px !important;
}

.rolling-number-input-grid > input:last-of-type {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

.rolling-number-input-grid > input:last-of-type:hover {
    margin-right: -3px !important;
    margin-left: -4px !important;
}

/*noinspection CssUnusedSymbol*/
.rolling-number-input-single {
    border: 1px solid black;
    border-radius: 5px;
}

/*noinspection CssUnusedSymbol*/
.rolling-number-input-left-two-digits {
    border-right: 1px solid black !important;
    /*margin-right: -1px;*/
}

/*noinspection CssUnusedSymbol*/
.rolling-number-input-left-two-digits:hover {
    margin-right: -3px;
    border-right: 4px #1867c0 solid !important;
}

/*noinspection CssUnusedSymbol*/
.rolling-number-input-digit {
    text-align: center;
    font-family: monospace;
    width: 1em;
    position: relative;
}

/*noinspection CssUnusedSymbol*/
.rolling-number-input-left:hover {
    margin-left: -3px !important;
    margin-right: -3px !important;
}

/*noinspection CssUnusedSymbol*/
.rolling-number-input-right:hover {
    margin-left: -3px !important;
    margin-right: -3px !important;
}
</style>