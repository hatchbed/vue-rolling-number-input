# vue-rolling-number-input

`RollingNumberInput` is a Vue component that provides a number input field with digits that can be quickly
individually adjusted using a mouse wheel or arrow keys on a keyboard.  It is ideal for situations such as
inputting radio frequencies or distances where users may want to spin through values and need to dynamically
change what degree of precision they are modifying.

## Attributes

### RollingNumberInput

| Attribute     | Type    | Required? | Default                       | Usage                                                                                                                                                                 |
|---------------|---------|-----------|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| allowNegative | Boolean | No        | `false`                       | `true` to display the `+`/`-` field and allow negative numbers; false to only allow >= 0                                                                              |
| centerClass   | String  | No        | `rolling-number-input-center` | CSS class to apply to digits other than the leftmost and rightmost digits                                                                                             |
| digitClass    | String  | No        | `rolling-number-input-digit`  | CSS class to apply to all digits                                                                                                                                      |
| leftClass     | String  | No        | `rolling-number-input-left`   | CSS class to apply to the leftmost digit                                                                                                                              |
| max           | Number  | No        | `undefined`                   | Maximum allowed value; if `undefined`, will be the largest value that can be displayed in the visible number of digits.                                               |
| min           | Number  | No        | `undefined`                   | Minimum allowed value; if `undefined`, will be `0` if `allowNegative` is `false` or `-max` if `allowNegative` is `true`.                                              |
| name          | String  | No        | empty string                  | Name of the HTML input for form submission                                                                                                                            |
| precision     | Number  | No        | `0`                           | Number of digits of decimal precision to display.  The precision must be >= 0.                                                                                        |
| rightClass    | String  | No        | `rolling-number-input-right`  | CSS class to apply to the rightmost digit                                                                                                                             |
| value         | Number  | Yes       |                               | Numeric value to display in the field                                                                                                                                 |
| width         | Number  | Yes       |                               | Total number of fields to display; note that this **includes** the sign and decimal, if negative numbers are allowed or the precision is > 0. The width must be >= 1. |

## Demo

https://hatchbed.github.io/vue-rolling-number-input/

## Installation

Install the package through NPM:
```bash
npm install vue-rolling-number-input
```

Import it into your project:

```javascript
import RollingNumberInput from 'vue-rolling-number-input'
import 'vue-rolling-number-input/dist/vue-rolling-number-input.css'

export default {
  components: {
    RollingNumberInput,
  }
}
```

Usage example:
```html
    <RollingNumberInput
        class="rolling-input"
        :allow-negative="false"
        :max="1000"
        :min="5"
        :width="8"
        :precision="3"
        v-model="fieldValue"
        @change="$emit('change', $event)"
    />
```