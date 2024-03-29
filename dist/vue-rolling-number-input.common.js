/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "";
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ entry_lib; }
});

;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
/* eslint-disable no-var */
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (false) { var getCurrentScript; }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[0]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/RollingNumberInput.vue?vue&type=template&id=ef2e0682&scoped=true&
var render = function render() {
  var _vm = this,
      _c = _vm._self._c,
      _setup = _vm._self._setupProxy;

  return _c('span', {
    staticClass: "rolling-number-input-grid"
  }, [_vm._l(_vm.digits, function (digit, index) {
    return _c('input', {
      key: index,
      ref: "inputs",
      refInFor: true,
      class: _vm.getClass(index),
      domProps: {
        "value": digit
      },
      on: {
        "keydown": function ($event) {
          return _vm.handleKey($event, index);
        },
        "input": function ($event) {
          return _vm.handleInputEvent($event, index);
        },
        "wheel": function ($event) {
          return _vm.handleWheelEvent($event, index);
        },
        "click": function ($event) {
          return _vm.handleClick($event);
        }
      }
    });
  }), _c('span', [_c('input', {
    attrs: {
      "type": "hidden",
      "name": _vm.name
    },
    domProps: {
      "value": '' + _vm.internalValue
    }
  })])], 2);
};

var staticRenderFns = [];

;// CONCATENATED MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject = require("vue");
var external_commonjs_vue_commonjs2_vue_root_Vue_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject);
;// CONCATENATED MODULE: ./node_modules/babel-loader/lib/index.js!./node_modules/ts-loader/index.js??clonedRuleSet-41.use[1]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/RollingNumberInput.vue?vue&type=script&lang=ts&

/* harmony default export */ var RollingNumberInputvue_type_script_lang_ts_ = (external_commonjs_vue_commonjs2_vue_root_Vue_default().extend({
  name: "RollingNumberInput",
  props: {
    allowNegative: {
      type: Boolean,
      default: false
    },
    centerClass: {
      type: String,
      default: 'rolling-number-input-center'
    },
    digitClass: {
      type: String,
      default: 'rolling-number-input-digit'
    },
    leftClass: {
      type: String,
      default: 'rolling-number-input-left'
    },
    rightClass: {
      type: String,
      default: 'rolling-number-input-right'
    },
    name: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      required: true
    },
    precision: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      default: undefined
    },
    min: {
      type: Number,
      default: undefined
    }
  },

  data() {
    return {
      internalValue: this.value
    };
  },

  computed: {
    digits() {
      if (this.precision < 0 || this.width < 1) {
        // These are invalid values, so just return an empty array
        return [];
      }

      const valueStr = Math.abs(this.internalValue).toFixed(this.precision);
      const values = new Array(this.width).fill("0");
      const offset = this.width - valueStr.length;

      for (let i = valueStr.length - 1; i >= 0; i--) {
        values[i + offset] = valueStr.charAt(i);
      }

      if (this.allowNegative) {
        if (this.internalValue >= 0) {
          values[0] = '+';
        } else {
          values[0] = '-';
        }
      }

      return values;
    },

    maxValue() {
      // If no max is explicitly set, set it to the largest value that can fit into our number of digits
      return this.max ? this.max : Math.pow(10, this.wholeDigits) - Math.pow(10, -this.precision);
    },

    minValue() {
      // If a min value is explicitly set, return that, but don't let it go below zero if negative numbers aren't allowed.
      if (this.min) {
        if (this.allowNegative) {
          return this.min;
        }

        return Math.max(this.min, 0);
      } // If no min is set, return the inverse of the max if negative numbers are allowed, otherwise 0.


      if (this.allowNegative) {
        return -this.maxValue;
      }

      return 0;
    },

    wholeDigits() {
      // Count the number of digits we have for actually representing numbers
      return this.width - this.precision - (this.allowNegative ? 1 : 0) - (this.precision > 0 ? 1 : 0);
    }

  },
  watch: {
    value(newVal, oldVal) {
      const newFloat = parseFloat(newVal);

      if (newFloat !== oldVal) {
        if (isNaN(newFloat)) {
          this.internalValue = 0;
        } else {
          this.internalValue = newFloat;
        }
      }
    },

    internalValue(newVal, oldVal) {
      const newFloat = parseFloat(newVal);

      if (newFloat !== oldVal) {
        this.$emit('input', newFloat);
        this.$emit('change', newFloat);
      }
    }

  },
  methods: {
    async changeDigit(newVal, digit) {
      if (digit < 0 || digit >= this.digits.length || parseInt(this.digits[digit]) === newVal) {
        return false;
      }

      const digitStr = this.digits.map((value, index) => index === digit ? newVal : value).join('');
      this.internalValue = parseFloat(digitStr);
      return true;
    },

    async changeFocus(reverse, digit) {
      let nextDigit = digit + (reverse ? -1 : 1);

      if (nextDigit < this.digits.length && this.digits[nextDigit] === '.') {
        nextDigit += reverse ? -1 : 1;
      }

      if (this.$refs && nextDigit < this.digits.length && nextDigit >= (this.allowNegative ? 1 : 0)) {
        const refs = this.$refs;
        const inputs = refs.inputs;
        const inputEl = inputs[nextDigit];
        inputEl.focus();
        return true;
      }

      return false;
    },

    async handleKey(event, digit) {
      const currentValue = this.digits[digit];
      const value = parseInt(event.key); // If the user presses "-" or "+", change the sign of the value regardless of where the
      // cursor is.

      if (event.key === '-' && this.allowNegative || (event.key === 'ArrowUp' || event.key === 'ArrowDown') && currentValue === '+') {
        this.internalValue = -Math.abs(this.internalValue);

        if (this.min) {
          this.internalValue = Math.max(this.min, this.internalValue);
        }

        event.preventDefault();
        return;
      } else if (event.key === '+' || (event.key === 'ArrowUp' || event.key === 'ArrowDown') && currentValue === '-') {
        this.internalValue = Math.abs(this.internalValue);

        if (this.max) {
          this.internalValue = Math.min(this.max, this.internalValue);
        }

        event.preventDefault();
        return;
      }

      if (currentValue === '.' || currentValue === '+' || currentValue === '-' || digit < 0 || digit >= this.digits.length || parseInt(currentValue) === value) {
        // If the focus is on the sign or dot, or if the digit is out of bounds, or if the user typed
        // the same number that is already in the field, we don't want to trigger an input event.
        event.preventDefault();
      }

      if (parseInt(currentValue) === value) {
        // But if they typed the same number that is already in the field, they probably want to go to the next field.
        await this.changeFocus(false, digit);
        return;
      }

      if (event.key === 'ArrowUp') {
        // If the user hits the up or down keys, change the value in the current field without changing focus.
        await this.bumpDigit(true, digit);
        event.preventDefault();
        return;
      }

      if (event.key === 'ArrowDown') {
        await this.bumpDigit(false, digit);
        event.preventDefault();
        return;
      }

      if (value >= 0 && value <= 9) {
        // Otherwise, if this is a valid value, just return.  An input event will be triggered and the input
        // will be handled there.
        return;
      }

      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Tab') {
        // At this point, we want to handle keys that the user might use to navigate between the fields, which
        // include left, right, and tab; ignore any other key.
        if (isNaN(value)) {
          // Furthermore, prevent any non-navigational keys from doing anything
          event.preventDefault();
        }

        return;
      }

      const reverse = event.key === 'ArrowLeft' || event.shiftKey && event.key === 'Tab';

      if (await this.changeFocus(reverse, digit)) {
        event.preventDefault();
      }
    },

    getClass(digit) {
      if (digit === 0) {
        let base = `${this.digitClass} ${this.leftClass}`;

        if (this.width === 1) {
          base += ' rolling-number-input-single';
        }

        if (this.width === 2) {
          base += ' rolling-number-input-left-two-digits';
        }

        return base;
      } else if (digit === this.width - 1) {
        return `${this.digitClass} ${this.rightClass}`;
      } else {
        return `${this.digitClass} ${this.centerClass}`;
      }
    },

    async handleClick(event) {
      if (event.currentTarget instanceof HTMLInputElement) {
        event.currentTarget.select();
      }
    },

    async handleInputEvent(event, digit) {
      if (event.data) {
        if (!(await this.changeDigit(parseInt(event.data), digit))) {
          event.preventDefault();
        } else {
          await this.changeFocus(false, digit);
        }
      }
    },

    async handleWheelEvent(event, digit) {
      if (this.allowNegative && digit === 0 || this.precision > 0 && digit === this.width - this.precision - 1) {
        event.preventDefault();
        return;
      }

      if (event.deltaY < 0) {
        await this.bumpDigit(true, digit);
      } else if (event.deltaY > 0) {
        await this.bumpDigit(false, digit);
      }
    },

    async bumpDigit(positive, digit) {
      const precisionOffset = this.width - this.precision;
      const place = Math.pow(10, precisionOffset - digit - (digit >= precisionOffset ? 1 : 2) - (this.precision === 0 ? -1 : 0));

      if (positive) {
        this.internalValue += place;
      } else {
        this.internalValue -= place;
      }

      this.internalValue = await this.round(Math.max(this.minValue, Math.min(this.internalValue, this.maxValue)), this.precision);
    },

    async round(value, decimals) {
      return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
    }

  }
}));
;// CONCATENATED MODULE: ./src/components/RollingNumberInput.vue?vue&type=script&lang=ts&
 /* harmony default export */ var components_RollingNumberInputvue_type_script_lang_ts_ = (RollingNumberInputvue_type_script_lang_ts_); 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/RollingNumberInput.vue?vue&type=style&index=0&id=ef2e0682&prod&scoped=true&lang=css&
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/RollingNumberInput.vue?vue&type=style&index=0&id=ef2e0682&prod&scoped=true&lang=css&

;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent(
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */,
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options =
    typeof scriptExports === 'function' ? scriptExports.options : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) {
    // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
          injectStyles.call(
            this,
            (options.functional ? this.parent : this).$root.$options.shadowRoot
          )
        }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

;// CONCATENATED MODULE: ./src/components/RollingNumberInput.vue



;


/* normalize component */

var component = normalizeComponent(
  components_RollingNumberInputvue_type_script_lang_ts_,
  render,
  staticRenderFns,
  false,
  null,
  "ef2e0682",
  null
  
)

/* harmony default export */ var RollingNumberInput = (component.exports);
;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = (RollingNumberInput);


module.exports = __webpack_exports__["default"];
/******/ })()
;
//# sourceMappingURL=vue-rolling-number-input.common.js.map