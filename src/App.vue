<template>
  <div id="app">
    <img
      alt="Vue logo"
      src="./assets/logo.png"
    >
    <h1>Rolling Number Input Example</h1>

    <div>Current Value: {{ value }}</div>

    <p>Spin your mouse wheel over individual digits to change them!</p>

    <div>
      <RollingNumberInput
        v-model="value"
        :width="8"
        :allow-negative="true"
        :precision="3"
      />
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
      value: 50
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
