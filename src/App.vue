<template>
  <div id="app">
    <deck v-if="started" @sendRiver="river" @sendCard="deal" @sendOpponent="oposition"/>
    <river v-if="started"></river>
    <button v-if="!started" v-on:click="this.startGame">Start Game</button>
  </div>
</template>

<script>
import EventBus from './event-bus'
import card from './components/card'
import deck from './components/deck'
import player from './components/player'
import river from './components/river'
import opponent from './components/opponent'
export default {
  name: 'App',
  data()  {
    return{
      players: [],
      started: false,
    }
  },
  components: {
    deck,
    card,
    river,
    opponent
  },
  methods: {
    deal(card){
      console.log("In App");
      EventBus.$emit('toPlayer', card);
    },
    river(card){
      EventBus.$emit('toRiver',card);
    },
    oposition(data)
    {
      EventBus.$emit('toOpponent', data);
    },
    startGame(){
      this.started = true;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  vertical-align: middle;
  position: relative;

}
#center{
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%,-50%);
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
body{
  background-image: url(./assets/table.png);
  background-repeat: no-repeat;
  background-size: 100%;
  height: 100%;
  min-height: 100%;
  background-position: center;
}
html{
  height: 100%;
}
</style>
