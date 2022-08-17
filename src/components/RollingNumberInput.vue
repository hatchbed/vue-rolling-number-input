<template>
  <span>
    <input
      v-for="(digit, index) in digits"
      ref="inputs"
      :key="index"
      :value="digit"
      :class="getClass(index)"
      @keydown="checkInput($event, index)"
      @keyup="handleKeyUp($event, index)"
      @input="handleInputEvent($event, index)"
      @wheel="handleWheelEvent($event, index)"
      @click="handleClick($event)"
    >
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
    }
  },
  data() {
    return {
      internalValue: this.value,
    }
  },
  computed: {
    digits(): string[] {
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
      return Math.pow(10, this.wholeDigits) - Math.pow(10, -this.precision)
    },
    minValue(): number {
      return this.allowNegative ? -this.maxValue : 0
    },
    wholeDigits(): number {
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
          console.info(`${oldVal} / ${newVal}`)
          this.internalValue = newFloat
        }
      }
    },
    internalValue(newVal: string, oldVal: number) {
      const newFloat = parseFloat(newVal)
      if (newFloat !== oldVal) {
        this.$emit('input', newFloat)
      }
    },
  },
  methods: {
    changeDigit(newVal: number, digit: number): boolean {
      console.info(`Possibly changing ${digit} to: ${newVal}`)
      if (digit < 0 || digit >= this.digits.length || parseInt(this.digits[digit]) === newVal) {
        return false
      }
      console.info(`Changing ${digit} to: ${newVal}`)
      const digitStr = this.digits.map((value, index) => index === digit ? newVal : value).join('')
      this.internalValue = parseFloat(digitStr)
      return true
    },
    checkInput(event: KeyboardEvent, digit: number) {
      const value = this.digits[digit]
      if (value === '.' || value === '+' || value === '-' || isNaN(parseInt(event.key)) || digit < 0 ||
          digit >= this.digits.length || parseInt(value) === parseInt(event.key)) {
        event.preventDefault()
      }
    },
    getClass(digit: number) {
      if (digit === 0) {
        return `${this.digitClass} ${this.leftClass}`
      }
      else if (digit === this.width - 1) {
        return `${this.digitClass} ${this.rightClass}`
      }
      else {
        return `${this.digitClass} ${this.centerClass}`
      }
    },
    handleClick(event: MouseEvent) {
      if (event.currentTarget instanceof HTMLInputElement) {
        event.currentTarget.select()
      }
    },
    handleInputEvent(event: InputEvent, digit: number) {
      if (event.data) {
        if (!this.changeDigit(parseInt(event.data), digit)) {
          event.preventDefault()
        }
      }
    },
    handleKeyUp(event: KeyboardEvent, digit: number) {
      const value = parseInt(event.key)
      if (event.key !== 'Tab' && !(value >= 0 && value <= 9)) {
        event.preventDefault()
        return
      }

      const reverse = event.shiftKey && event.key === 'Tab'
      let nextDigit = digit + (reverse ? -1 : 1)
      if (nextDigit < this.digits.length && this.digits[nextDigit] === '.') {
        nextDigit += reverse ? -1 : 1
      }
      if (this.$refs && nextDigit < this.digits.length && nextDigit >= (this.allowNegative ? 1 : 0)) {
        const refs = this.$refs
        const inputs = refs.inputs as HTMLInputElement[]
        const inputEl = inputs[nextDigit]
        inputEl.focus()
      }
    },
    handleWheelEvent(event: WheelEvent, digit: number) {
      const precisionOffset = this.width - this.precision
      if ((this.allowNegative && digit === 0) || (this.precision > 0 && digit === this.width - this.precision - 1)) {
        event.preventDefault()
        return
      }

      const place = Math.pow(10, precisionOffset - digit - ((digit >= precisionOffset) ? 1 : 2) - (this.precision === 0 ? -1 : 0))

      if (event.deltaY < 0) {
        this.internalValue += place
      } else if (event.deltaY > 0) {
        this.internalValue -= place
      }
      this.internalValue = Math.max(this.minValue, Math.min(this.internalValue, this.maxValue))
    },
  }
})
</script>

<style scoped>
/*noinspection CssUnusedSymbol*/
.rolling-number-input-center {
  border-left: 1px solid black;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-right: none;
}
/*noinspection CssUnusedSymbol*/
.rolling-number-input-left {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
  border-right: none;
}
/*noinspection CssUnusedSymbol*/
.rolling-number-input-right {
  border-left: 1px solid black;
  border-right: 1px solid black;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}
/*noinspection CssUnusedSymbol*/
.rolling-number-input-digit {
  text-align: center;
  font-family: monospace;
  width: 1em;
}
</style>