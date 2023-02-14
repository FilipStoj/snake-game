<script setup>
import Board from './components/Board.vue'
</script>

<template>
  <div id="app">
    <h1>Snake Game</h1>
  
  <Board />
</div>
</template>

<style scoped>
#app {
  text-align: center;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 3rem;
}
</style>
