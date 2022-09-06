<template>
  <div id="player">
    <button v-if="this.over" v-on:click="this.newRound">Next Hand</button>
    <h1 v-if="this.over">{{ this.winner }}</h1>
    <ul >
      <transition-group v-if="!this.folded" name="fade">
        <li v-bind:class="{'winner':isWinner}" v-bind:key="card.id" v-for="card in hand">
            <card :value="card.value" :suit="card.suit" :color="card.color" :id="card.id" :printName="card.printName"></card>
        </li>
      </transition-group>
      <h3>{{ this.pokerHand }}</h3>
      <div v-if="this.$store.getters.getTurn == this.id && !this.folded && !this.$store.getters.amOnlyOneLeft" >
        <input v-model="currentBet" placeholder="Type your bet."/>
        <p>Total Money: {{ money }}</p>
        <p>Bet is: {{ this.$store.getters.getBet }}</p>
        <button v-on:click="this.raise">Raise</button>
        <button v-on:click="this.call">Call</button>
        <button v-if="this.$store.getters.getBet==0" v-on:click="this.check">Check</button>
        <button v-on:click="this.fold">Fold</button>
      </div>
    </ul>
  </div>
</template>

<script>
import EventBus from '../event-bus';
import card from "./card";

export default {
    name: "player",
    props: ["id"],
    data(){
        return{
            money: 100,
            hand: [],
            oponentHandsVals: [],
            playerIDs: [],
            pokerHand: "",
            currentBet: "",
            over: false,
            highestValue: -1,
            winner: "",
            isWinner: false,
            folded: false,
        }
    },components: {
    card
    },
    created(){
      EventBus.$on("toPlayer", (card) => {
        ////console.log(this.hand);
        this.hand.push(card);
        this.checkHand();
      });
      EventBus.$on("toRiver", (card) => {
        this.checkHand();
      });
      EventBus.$on("newRound", () => {
        this.hand = [];
        this.oponentHandsVals = [];
        this.playerIDs = [];
        this.pokerHand = "";
        this.currentBet = "";
        this.over = false;
        this.highestValue = -1;
        this.winner = "";
        this.isWinner = false;
        this.folded = false;
      });
      EventBus.$on("showingCards",(handID) => {
        this.playerIDs.push(handID[1]);
        this.oponentHandsVals.push(handID[0]);
        console.log("=> "+this.oponentHandsVals.length == 4-this.$store.getters.getNumFolded);
        if(this.oponentHandsVals.length == 4-this.$store.getters.getNumFolded){
          if(!this.folded){
            this.oponentHandsVals.push(this.highestValue);
            this.playerIDs.push(-1);
          }
          var highestHand = Math.max(...this.oponentHandsVals);
          var winnerID = this.playerIDs[this.oponentHandsVals.indexOf(highestHand)];
          this.winner = "THE WINNING HAND IS: " +this.$store.getters.getHandString(highestHand);
          this.over = true;
          if(winnerID == -1){
            this.isWinner = true;
            this.money += this.$store.getters.getPot;
          }
          else{
            console.log(this.playerIDs);
            EventBus.$emit("theWinnerIs",winnerID);
          }
          this.playerIDs = [];
        }
      });
      window.setInterval(() => {
        if(this.$store.getters.getTurn == -1){
          this.over = true;
        }
      },1000);
    },
    methods: {
        newRound(){
          this.$store.commit("newRound");
        },
        getCard(card){
            this.hand.push(card);
        },
        checkHand(){
          this.testCheckHand()
          //////console.log(this.highestValue);
          this.pokerHand = this.$store.getters.getHandString(this.highestValue);
          
        },
        raise(){
          if(this.money >= Number(this.currentBet) && this.currentBet >= 2*(this.$store.getters.getBet)){
            this.$store.commit('raise',this.currentBet);
            this.money -= Number(this.currentBet);
            this.$store.commit('nextTurn');
          }
        },
        call(){
          if(this.money >= Number(this.$store.getters.getBet)){
            this.$store.commit('call');
            this.money -= Number(this.$store.getters.getBet);
            this.$store.commit('nextTurn');
          }else{
            this.$store.commit('raise',this.money);
            this.money = 0;
            this.$store.commit('nextTurn');
          }
        },
        check(){
            this.$store.commit('check');
            this.$store.commit('nextTurn');
        },
        fold(){
          this.$store.commit("fold",this.id);
          this.folded = true;
          this.$store.commit("nextTurn");
        },
        testCheckHand(){
          var combos;
          var totCards = [];
          var riverCards = this.$store.getters.getRiver;
          for(var i=0; i<this.hand.length; i++){
            totCards.push(this.hand[i]);
          }
          for(var i=0; i<riverCards.length; i++){
            totCards.push(riverCards[i]);
          }

          var combine = function(a, min) {
            var fn = function(n, src, got, all) {
              if (n == 0) {
                if (got.length > 0) {
                  all[all.length] = got;
                }
                return;
              }
              for (var j = 0; j < src.length; j++) {
                fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
              }
            return;
          }
        var all = [];
        for (var i = min; i < a.length; i++) {
          fn(i, a, [], all);
        }
        all.push(a);
        return all;
        }
        if(totCards.length >= 5){
          combos = combine(totCards,5);
          if(totCards.length == 6){
            combos = combos.splice(0,6);
          }
          else if(totCards.length == 7){
            combos = combos.splice(0,21);
          }
        }
        else{
          combos = combine(totCards,2);
        }
        this.highestValue = -1;
        for(var i=0; i<combos.length; i++){
          var currVal = this.$store.getters.getBest(combos[i]);
          if(currVal > this.highestValue){
            this.highestValue = currVal;
          }
        }
        ////////console.log(this.$store.getters.getHandString(this.highestValue));
        }
    }
}
</script>

<style>
#player {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  color: black;
}
.winner{
  border: 5px solid gold;
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
  display: inline-block;
  margin: 0;
}

a {
  color: #42b983;
}
</style>
