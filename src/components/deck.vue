<template>
  <div id="deck">
    <div id="imgcnt">
      <img id="deckimg" src="../assets/cardBack.jpg" alt="Deck">
    </div>
  </div>
</template>

<script>
import EventBus from '../event-bus'
import card from "./card"
import opponentVue from './opponent.vue'
export default {
  name: 'deck',
  data () {
    return {
      values:[],
      cardsToRiver: 0,
    }
  },
  mounted(){
    this.initDeck();
    this.shuffleCards();
    this.deal();
     EventBus.$on("nowRiver",() => {
        this.river();
      });
      EventBus.$on("newRound", () => {
        this.cardsToRiver = 0;
        this.values = [];
        this.initDeck();
        this.shuffleCards();
        this.deal();
      });
    },
  components: {
    card
  },
  methods: {
      initDeck(){
          for(var i=0; i<52; i++){
              var currSuit;
              var value;
              var id;
              var color;
              var currPrintName;
              if(i<13){
                  currSuit = "♥️"
                  color = "red"
              }
              else if(i<26){
                  currSuit = "♦️"
                  color = "blue"
              }
              else if(i<39){
                  currSuit = "♣️"
                  color = "green"
              }
              else{
                  currSuit = "♠️"
                  color = "black"
              }
              id=""+((i%13)+1)+currSuit.substring(0,1);
              value = (i%13)+2;
              currPrintName = value;
              if(value == 14){
                  currPrintName = "Ace";
              }else if(value == 11){
                  currPrintName = "Jack";
              }else if(value == 12){
                  currPrintName = "Queen";
              }else if(value == 13){
                  currPrintName = "King";
              }
              this.values.push({value: value,suit: currSuit,color: color, id: id,printName: currPrintName});
          }
      },
      shuffleCards(){
          var numCycles = 100;
          for(var i=0; i<numCycles; i++){
              this.values.sort(() => Math.random() - 0.5);
          }
      },
      deal(){
      
          setTimeout(() =>{
              var topCard = this.values.pop();
              this.$emit('sendCard', topCard);
          
            },750)
            
           var topCard = this.values.pop();
           this.$emit('sendCard', topCard);
           this.opponent();
      },
      opponent()
      {
        setTimeout(() =>{
          for(var i=0;i<9;i++){
            var topCard = this.values.pop();
            var data = [i,topCard];
            this.$emit('sendOpponent', data);
          }
          
            },750)
            
        for(var i=0;i<9;i++){
          var topCard = this.values.pop();
          var data = [i,topCard];
          this.$emit('sendOpponent', data);
        }

      },
      river(){
        var topCard = this.values.pop();
        if(this.cardsToRiver == 0){
          this.$emit('sendRiver', topCard);
          var topCard = this.values.pop();
          this.$emit('sendRiver', topCard);
          var topCard = this.values.pop();
          this.$emit('sendRiver', topCard);
          this.cardsToRiver+=3;
        }
        else if(this.cardsToRiver < 5){
          var topCard = this.values.pop();
          this.$emit('sendRiver', topCard);
          this.cardsToRiver++;
        }
      }
  }
}
</script>

<style>
#deck {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#deckimg{
  width: 75px;
  height: 100px;
  border-radius: 5px;
  transform: rotate(90deg);
}
#imgcnt{
  text-align: center;
  border-radius: 5px;
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
</style>
