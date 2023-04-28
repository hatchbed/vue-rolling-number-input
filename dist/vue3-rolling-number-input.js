import { defineComponent as V, reactive as N, ref as A, computed as h, watch as w, openBlock as g, createElementBlock as I, Fragment as B, renderList as G, unref as z, normalizeClass as M, createElementVNode as n, toDisplayString as k, withDirectives as m, vModelCheckbox as D, vModelText as f, createVNode as Y } from "vue";
const S = { class: "rolling-number-input-grid" }, J = ["value", "onKeydown", "onInput", "onWheel"], P = ["name", "value"], O = /* @__PURE__ */ V({
  __name: "RollingNumberInput",
  props: {
    allowNegative: { type: Boolean, default: !1 },
    centerClass: { default: "rolling-number-input-center" },
    digitClass: { default: "rolling-number-input-digit" },
    leftClass: { default: "rolling-number-input-left" },
    rightClass: { default: "rolling-number-input-right" },
    name: { default: "" },
    modelValue: { default: 0 },
    precision: { default: 0 },
    width: null,
    max: { default: void 0 },
    min: { default: void 0 }
  },
  emits: ["input", "change", "update:modelValue"],
  setup(d, { emit: i }) {
    const t = d, a = N({ internalValue: t.modelValue }), r = A(null), o = h(() => {
      if (t.precision < 0 || t.width < 1)
        return [];
      const e = Math.abs(a.internalValue).toFixed(t.precision), l = new Array(t.width).fill("0"), u = t.width - e.length;
      for (let s = e.length - 1; s >= 0; s--)
        l[s + u] = e.charAt(s);
      return t.allowNegative && (a.internalValue >= 0 ? l[0] = "+" : l[0] = "-"), l;
    }), y = h(() => t.max ? t.max : Math.pow(10, R.value) - Math.pow(10, -t.precision)), C = h(() => t.min ? t.allowNegative ? t.min : Math.max(t.min, 0) : t.allowNegative ? -y.value : 0), R = h(() => t.width - t.precision - (t.allowNegative ? 1 : 0) - (t.precision > 0 ? 1 : 0));
    w(() => t.modelValue, (e, l) => {
      e !== l && (isNaN(e) ? a.internalValue = 0 : a.internalValue = e);
    }), w(() => a.internalValue, (e, l) => {
      e !== l && (i("input", e), i("change", e), i("update:modelValue", e));
    });
    const v = async (e, l) => {
      if (l < 0 || l >= o.value.length || parseInt(o.value[l]) === e)
        return !1;
      const u = o.value.map((s, c) => c === l ? e : s).join("");
      return a.internalValue = parseFloat(u), !0;
    }, b = async (e, l) => {
      let u = l + (e ? -1 : 1);
      return u < o.value.length && o.value[u] === "." && (u += e ? -1 : 1), r.value && u < o.value.length && u >= (t.allowNegative ? 1 : 0) ? (r.value[u].focus(), !0) : !1;
    }, x = async (e, l) => {
      const u = o.value[l], s = parseInt(e.key);
      if (e.key === "-" && t.allowNegative || (e.key === "ArrowUp" || e.key === "ArrowDown") && u === "+") {
        a.internalValue = -Math.abs(a.internalValue), t.min && (a.internalValue = Math.max(t.min, a.internalValue)), e.preventDefault();
        return;
      } else if (e.key === "+" || (e.key === "ArrowUp" || e.key === "ArrowDown") && u === "-") {
        a.internalValue = Math.abs(a.internalValue), t.max && (a.internalValue = Math.min(t.max, a.internalValue)), e.preventDefault();
        return;
      }
      if ((u === "." || u === "+" || u === "-" || l < 0 || l >= o.value.length || parseInt(u) === s) && e.preventDefault(), parseInt(u) === s) {
        await b(!1, l);
        return;
      }
      if (e.key === "ArrowUp") {
        await p(!0, l), e.preventDefault();
        return;
      }
      if (e.key === "ArrowDown") {
        await p(!1, l), e.preventDefault();
        return;
      }
      if (s >= 0 && s <= 9)
        return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Tab") {
        isNaN(s) && e.preventDefault();
        return;
      }
      const c = e.key === "ArrowLeft" || e.shiftKey && e.key === "Tab";
      await b(c, l) && e.preventDefault();
    }, W = (e) => {
      if (e === 0) {
        let l = `${t.digitClass} ${t.leftClass}`;
        return t.width === 1 && (l += " rolling-number-input-single"), t.width === 2 && (l += " rolling-number-input-left-two-digits"), l;
      } else
        return e === t.width - 1 ? `${t.digitClass} ${t.rightClass}` : `${t.digitClass} ${t.centerClass}`;
    }, E = async (e) => {
      e.currentTarget instanceof HTMLInputElement && e.currentTarget.select();
    }, U = async (e, l) => {
      e.data && (await v(parseInt(e.data), l) ? await b(!1, l) : e.preventDefault());
    }, Z = async (e, l) => {
      if (t.allowNegative && l === 0 || t.precision > 0 && l === t.width - t.precision - 1) {
        e.preventDefault();
        return;
      }
      e.deltaY < 0 ? await p(!0, l) : e.deltaY > 0 && await p(!1, l);
    }, p = async (e, l) => {
      const u = t.width - t.precision, s = Math.pow(10, u - l - (l >= u ? 1 : 2) - (t.precision === 0 ? -1 : 0));
      e ? a.internalValue += s : a.internalValue -= s, a.internalValue = await Q(Math.max(C.value, Math.min(a.internalValue, y.value)), t.precision);
    }, Q = async (e, l) => +(Math.round(+(e + "e" + l)) + "e-" + l);
    return (e, l) => (g(), I("span", S, [
      (g(!0), I(B, null, G(z(o), (u, s) => (g(), I("input", {
        ref_for: !0,
        ref_key: "inputs",
        ref: r,
        key: s,
        value: u,
        class: M(W(s)),
        onKeydown: (c) => x(c, s),
        onInput: (c) => U(c, s),
        onWheel: (c) => Z(c, s),
        onClick: l[0] || (l[0] = (c) => E(c))
      }, null, 42, J))), 128)),
      n("span", null, [
        n("input", {
          type: "hidden",
          name: d.name,
          value: "" + a.internalValue
        }, null, 8, P)
      ])
    ]));
  }
});
const K = (d, i) => {
  const t = d.__vccOpts || d;
  for (const [a, r] of i)
    t[a] = r;
  return t;
}, T = /* @__PURE__ */ K(O, [["__scopeId", "data-v-27c6340d"]]), X = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk2QkI4RkE3NjE2MTFFNUE4NEU4RkIxNjQ5MTYyRDgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk2QkI4Rjk3NjE2MTFFNUE4NEU4RkIxNjQ5MTYyRDgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjU2QTEyNzk3NjkyMTFFMzkxODk4RDkwQkY4Q0U0NzYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjU2QTEyN0E3NjkyMTFFMzkxODk4RDkwQkY4Q0U0NzYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5WHowqAAAXNElEQVR42uxda4xd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", L = { id: "app" }, j = /* @__PURE__ */ n("img", {
  alt: "Vue logo",
  src: X
}, null, -1), H = /* @__PURE__ */ n("h1", null, "Rolling Number Input Example", -1), F = /* @__PURE__ */ n("p", null, "Spin your mouse wheel over individual digits to change them!", -1), q = { style: { display: "flex", "flex-direction": "column", "align-items": "center" } }, _ = { style: { padding: "1em", border: "1px solid black", display: "flex", "flex-direction": "column" } }, $ = { style: { padding: "1em", display: "flex", "flex-direction": "row" } }, ee = { style: { "margin-right": "20px", "text-align": "right" } }, te = /* @__PURE__ */ n("label", null, "Allow Negative", -1), le = /* @__PURE__ */ n("br", null, null, -1), ne = /* @__PURE__ */ n("label", null, "Minimum: ", -1), ae = /* @__PURE__ */ n("br", null, null, -1), ie = /* @__PURE__ */ n("label", null, "Maximum: ", -1), ue = /* @__PURE__ */ n("br", null, null, -1), se = /* @__PURE__ */ n("label", null, "Precision: ", -1), re = /* @__PURE__ */ n("br", null, null, -1), oe = /* @__PURE__ */ n("label", null, "Width: ", -1), ce = /* @__PURE__ */ n("label", null, "Form Input: ", -1), de = /* @__PURE__ */ n("br", null, null, -1), me = /* @__PURE__ */ n("br", null, null, -1), pe = /* @__PURE__ */ n("br", null, null, -1), he = /* @__PURE__ */ n("input", { type: "submit" }, null, -1), ge = /* @__PURE__ */ V({
  __name: "Demo",
  setup(d) {
    const i = N({
      value: 50,
      submittedValue: "",
      allowNegative: !1,
      precision: "3",
      width: "8",
      min: "10",
      max: "1000"
    }), t = (a) => {
      if (a.preventDefault(), a.target && a.target instanceof HTMLFormElement) {
        const r = new FormData(a.target);
        r.has("example") && (i.submittedValue = String(r.get("example")));
      }
    };
    return (a, r) => (g(), I("div", L, [
      j,
      H,
      F,
      n("div", q, [
        n("div", _, [
          n("p", null, "Current Value: " + k(i.value), 1),
          n("div", $, [
            n("div", ee, [
              n("form", null, [
                te,
                m(n("input", {
                  "onUpdate:modelValue": r[0] || (r[0] = (o) => i.allowNegative = o),
                  type: "checkbox"
                }, null, 512), [
                  [D, i.allowNegative]
                ]),
                le,
                ne,
                m(n("input", {
                  "onUpdate:modelValue": r[1] || (r[1] = (o) => i.min = o),
                  type: "number"
                }, null, 512), [
                  [f, i.min]
                ]),
                ae,
                ie,
                m(n("input", {
                  "onUpdate:modelValue": r[2] || (r[2] = (o) => i.max = o),
                  type: "number"
                }, null, 512), [
                  [f, i.max]
                ]),
                ue,
                se,
                m(n("input", {
                  "onUpdate:modelValue": r[3] || (r[3] = (o) => i.precision = o),
                  type: "number"
                }, null, 512), [
                  [f, i.precision]
                ]),
                re,
                oe,
                m(n("input", {
                  "onUpdate:modelValue": r[4] || (r[4] = (o) => i.width = o),
                  type: "number"
                }, null, 512), [
                  [f, i.width]
                ])
              ])
            ]),
            n("div", null, [
              n("form", { onSubmit: t }, [
                ce,
                de,
                Y(T, {
                  modelValue: i.value,
                  "onUpdate:modelValue": r[5] || (r[5] = (o) => i.value = o),
                  "allow-negative": i.allowNegative,
                  width: parseInt(i.width),
                  precision: parseInt(i.precision),
                  min: parseInt(i.min),
                  max: parseInt(i.max),
                  name: "example"
                }, null, 8, ["modelValue", "allow-negative", "width", "precision", "min", "max"]),
                me,
                pe,
                he
              ], 32),
              n("p", null, "Submitted value: " + k(i.submittedValue), 1)
            ])
          ])
        ])
      ])
    ]));
  }
});
export {
  ge as Demo,
  T as RollingNumberInput
};
