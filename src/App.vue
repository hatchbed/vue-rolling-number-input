<template>
  <div id="app">
    <img
      alt="Vue logo"
      src="./assets/logo.png"
    >
    <h1>Rolling Number Input Example</h1>

    <p>Spin your mouse wheel over individual digits to change them!</p>

    <div style="display: flex; flex-direction: column; align-items: center">
      <div style="padding: 1em; border: 1px solid black;">
        <p>Current Value: {{ value }}</p>
        <RollingNumberInput
          v-model="value"
          :width="8"
          :allow-negative="true"
          :precision="3"
        />
      </div>
      <br>
      <div style="padding: 1em; border: 1px solid black;">
        <p>Current Value: {{ value2 }}</p>
        <form @submit="handleSubmit">
          <label>Form Input: </label>
          <RollingNumberInput
            v-model="value2"
            :width="8"
            :precision="0"
            :min="10"
            :max="20000000"
            name="example"
          />
          <br>
          <input type="submit">
        </form>
        <p>Submitted value: {{ submittedValue }}</p>
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
      value2: 50,
      submittedValue: '',
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
