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
        :value="'' + internalValue"
      >
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "RollingNumberInput",
  props: {
    allowNegative: {
      type: Boolean,
      default: false,
    },
    centerClass: {
      type: String,
      default: 'rolling-number-input-center',
    },
    digitClass: {
      type: String,
      default: 'rolling-number-input-digit',
    },
    leftClass: {
      type: String,
      default: 'rolling-number-input-left',
    },
    rightClass: {
      type: String,
      default: 'rolling-number-input-right',
    },
    name: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      required: true,
    },
    precision: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      required: true,
    },
    max: {
      type: Number as () => number|undefined,
      default: undefined
    },
    min: {
      type: Number as () => number|undefined,
      default: undefined
    },
  },
  data() {
    return {
      internalValue: this.value,
    }
  },
  computed: {
    digits(): string[] {
      if (this.precision < 0 || this.width < 1) {
        // These are invalid values, so just return an empty array
        return []
      }
      const valueStr = Math.abs(this.internalValue).toFixed(this.precision)
      const values = new Array(this.width).fill("0")
      const offset = this.width - valueStr.length
      for (let i = valueStr.length-1; i >= 0; i--) {
        values[i+offset] = valueStr.charAt(i)
      }
      if (this.allowNegative) {
        if (this.internalValue >= 0) {
          values[0] = '+'
        }
        else {
          values[0] = '-'
        }
      }
      return values
    },
    maxValue(): number {
      // If no max is explicitly set, set it to the largest value that can fit into our number of digits
      return this.max ? this.max : Math.pow(10, this.wholeDigits) - Math.pow(10, -this.precision)
    },
    minValue(): number {
      // If no min value is explicitly set, it is 0 if negative numbers are not allowed; otherwise, the inverse of the max
      return this.min ? this.min : this.allowNegative ? -this.maxValue : 0
    },
    wholeDigits(): number {
      // Count the number of digits we have for actually representing numbers
      return this.width - this.precision - (this.allowNegative ? 1 : 0) - (this.precision > 0 ? 1 : 0)
    }
  },
  watch: {
    value(newVal: string, oldVal: number) {
      const newFloat = parseFloat(newVal)
      if (newFloat !== oldVal) {
        if (isNaN(newFloat)) {
          this.internalValue = 0
        }
        else {
          this.internalValue = newFloat
        }
      }
    },
    internalValue(newVal: string, oldVal: number) {
      const newFloat = parseFloat(newVal)
      if (newFloat !== oldVal) {
        this.$emit('input', newFloat)
        this.$emit('change', newFloat)
      }
    },
  },
  methods: {
    async changeDigit(newVal: number, digit: number): Promise<boolean> {
      if (digit < 0 || digit >= this.digits.length || parseInt(this.digits[digit]) === newVal) {
        return false
      }
      const digitStr = this.digits.map((value, index) => index === digit ? newVal : value).join('')
      this.internalValue = parseFloat(digitStr)
      return true
    },
    async changeFocus(reverse: boolean, digit: number): Promise<boolean> {
      let nextDigit = digit + (reverse ? -1 : 1)
      if (nextDigit < this.digits.length && this.digits[nextDigit] === '.') {
        nextDigit += reverse ? -1 : 1
      }
      if (this.$refs && nextDigit < this.digits.length && nextDigit >= (this.allowNegative ? 1 : 0)) {
        const refs = this.$refs
        const inputs = refs.inputs as HTMLInputElement[]
        const inputEl = inputs[nextDigit]
        inputEl.focus()
        return true
      }
      return false
    },
    async handleKey(event: KeyboardEvent, digit: number) {
      const currentValue = this.digits[digit]
      const value = parseInt(event.key)
      if (currentValue === '.' || currentValue === '+' || currentValue === '-' || digit < 0 ||
          digit >= this.digits.length || parseInt(currentValue) === value) {
        // If the focus is on the sign or dot, or if the digit is out of bounds, or if the user typed
        // the same number that is already in the field, we don't want to trigger an input event.
        event.preventDefault()
      }

      if (parseInt(currentValue) === value) {
        // But if they typed the same number that is already in the field, they probably want to go to the next field.
        await this.changeFocus(false, digit)
        return
      }

      if (event.key === 'ArrowUp') {
        // If the user hits the up or down keys, change the value in the current field without changing focus.
        await this.bumpDigit(true, digit)
        event.preventDefault()
        return
      }
      if (event.key === 'ArrowDown') {
        await this.bumpDigit(false, digit)
        event.preventDefault()
        return
      }

      if (value >= 0 && value <= 9) {
        // Otherwise, if this is a valid value, just return.  An input event will be triggered and the input
        // will be handled there.
        return
      }

      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab') {
        // At this point, we want to handle keys that the user might use to navigate between the fields, which
        // include left, right, and tab; ignore any other key.
        if (isNaN(value)) {
          // Furthermore, prevent any non-navigational keys from doing anything
          event.preventDefault()
        }
        return
      }

      const reverse = event.key === 'ArrowLeft' || (event.shiftKey && event.key === 'Tab')
      if (await this.changeFocus(reverse, digit)) {
        event.preventDefault()
      }
    },
    getClass(digit: number) {
      if (digit === 0) {
        let base = `${this.digitClass} ${this.leftClass}`
        if (this.width === 1) {
          base += ' rolling-number-input-single'
        }
        if (this.width === 2) {
          base += ' rolling-number-input-left-two-digits'
        }
        return base
      }
      else if (digit === this.width - 1) {
        return `${this.digitClass} ${this.rightClass}`
      }
      else {
        return `${this.digitClass} ${this.centerClass}`
      }
    },
    async handleClick(event: MouseEvent) {
      if (event.currentTarget instanceof HTMLInputElement) {
        event.currentTarget.select()
      }
    },
    async handleInputEvent(event: InputEvent, digit: number) {
      if (event.data) {
        if (!await this.changeDigit(parseInt(event.data), digit)) {
          event.preventDefault()
        }
        else {
          await this.changeFocus(false, digit)
        }
      }
    },
    async handleWheelEvent(event: WheelEvent, digit: number) {
      if ((this.allowNegative && digit === 0) || (this.precision > 0 && digit === this.width - this.precision - 1)) {
        event.preventDefault()
        return
      }

      if (event.deltaY < 0) {
        await this.bumpDigit(true, digit)
      } else if (event.deltaY > 0) {
        await this.bumpDigit(false, digit)
      }
    },
    async bumpDigit(positive: boolean, digit: number) {
      const precisionOffset = this.width - this.precision
      const place = Math.pow(10, precisionOffset - digit - ((digit >= precisionOffset) ? 1 : 2) - (this.precision === 0 ? -1 : 0))

      if (positive) {
        this.internalValue += place
      } else {
        this.internalValue -= place
      }
      this.internalValue = await this.round(Math.max(this.minValue, Math.min(this.internalValue, this.maxValue)), this.precision)
    },
    async round(value: number, decimals: number) {
      return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
    }
  }
})
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