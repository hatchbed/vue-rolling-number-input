<template>
  <div id="app">
    <img
      alt="Vue logo"
      src="./assets/logo.png"
    >
    <h1>Rolling Number Input Example</h1>

    <p>Spin your mouse wheel over individual digits to change them!</p>

    <div style="display: flex; flex-direction: column; align-items: center">
      <div style="padding: 1em; border: 1px solid black; display: flex; flex-direction: column;">
        <p>Current Value: {{ value }}</p>
        <div style="padding: 1em; display: flex; flex-direction: row;">
          <div style="margin-right: 20px; text-align: right">
            <form>
              <label>Allow Negative</label>
              <input
                v-model="allowNegative"
                type="checkbox"
              >
              <br>
              <label>Minimum: </label>
              <input
                v-model="min"
                type="number"
              >
              <br>
              <label>Maximum: </label>
              <input
                v-model="max"
                type="number"
              >
              <br>
              <label>Precision: </label>
              <input
                v-model="precision"
                type="number"
              >
              <br>
              <label>Width: </label>
              <input
                v-model="width"
                type="number"
              >
            </form>
          </div>
          <div>
            <form @submit="handleSubmit">
              <label>Form Input: </label><br>
              <RollingNumberInput
                v-model="value"
                :allow-negative="allowNegative"
                :width="parseInt(width)"
                :precision="parseInt(precision)"
                :min="parseInt(min)"
                :max="parseInt(max)"
                name="example"
              />
              <br><br>
              <input type="submit">
            </form>
            <p>Submitted value: {{ submittedValue }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import RollingNumberInput from "@/components/RollingNumberInput.vue";

export default Vue.extend({
  name: 'App',
  components: {RollingNumberInput},
  data() {
    return {
      value: 50,
      submittedValue: '',
      allowNegative: false,
      precision: "3",
      width: "8",
      min: "10",
      max: "1000",
    }
  },
  methods: {
    handleSubmit(e: SubmitEvent) {
      e.preventDefault()
      if (e.target && e.target instanceof HTMLFormElement) {
        const data = new FormData(e.target)
        if (data.has('example')) {
          this.submittedValue = String(data.get('example'))
        }
      }
    }
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
