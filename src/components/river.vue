<template>
  <div id="river">
    <h1 id="pot">CURRENT POT: {{ this.$store.getters.getPot }}</h1>
    <ul id="whereCards">
      <transition-group name="fade">
        <li v-bind:key="card.id" v-for="card in cards">
            <card id="riverCard" :value="card.value" :suit="card.suit" :color="card.color" :printName="card.printName"></card>
        </li>
        
      </transition-group>
    </ul>
    <div id="leftCards">
     <li :id="num" v-bind:key="num" v-for="num in 2">
       <opponent :id="num"/>
       </li>
    </div>
    <div id="rightCards">
     <li :id="num+2" v-bind:key="num+2" v-for="num in 2">
       <opponent :id="num+2"/>
       </li>
    </div>
    <player :id="0"/>
    
  </div>
</template>

<script>
import EventBus from '../event-bus';
import card from "./card";
import player from "./player";
import opponent from "./opponent";

export default {
    name: "river",
    data(){
        return{
            cards: [],
            maxPlayers: 4
        }
    },components: {
    card,
    player,
    opponent
    },
    created(){
      EventBus.$on("toRiver",(card) => {
        this.cards.push(card);
        this.$store.commit("addToRiver",card);
      });
      EventBus.$on("newRound", () => {
        this.cards = [];
      });
    },
    methods: {
    }
}
</script>

<style>
#pot{
  color:white;
}
#river {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#whereCards{
  min-height: 200px;
}
#riverCard{
    width: 75px;
    height: 100px;
    border-radius: 5px;
    color:white;
    font-size: 10px;
    padding-top: 1px;
    padding-bottom: 2px;
    vertical-align: middle;
}
.fade-enter-active, .fade-leave-active {
  transition: all 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  transform: translateY(-200px);
}
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0 10px;
  display: block;
}

a {
  color: #42b983;
}
#leftCards{
  transform: translateY(-100px) rotate(90deg);
  float: left;
}
#rightCards{
  transform: translateY(-100px) rotate(-90deg);
  float: right;
}
</style>
