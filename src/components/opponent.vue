<template>
  <div id="opponent" v-bind:class="{'notActive':!isTurn,'active':isTurn, 'winner':winner, 'out':ImOut}">
    Cash: {{ this.money}}
    <br />
    {{ this.moveMade }}
    <ul>
      <transition-group name="ignore">
        <div :id="'opponent'+this.id" v-if="!this.shown" :key="this.money">
          <li class="oppCards" v-bind:key="card.id" v-for="card in hand">
            <img id="opponentImg" src="../assets/cardBack.jpg" alt="Deck" />
          </li>
        </div>
        <div v-if="this.shown " :key="this.money">
          <li v-bind:key="card.id" v-for="card in hand">
            <card
              class="smallCards"
              :value="card.value"
              :suit="card.suit"
              :color="card.color"
              :id="card.id"
              :printName="card.printName"
            ></card>
          </li>
        </div>
      </transition-group>
    </ul>
  </div>
</template>

<script>
import EventBus from "../event-bus";
import card from "./card";
export default {
  name: "opponent",
  props: ["id"],
  data() {
    return {
      ImOut: false,
      money: 100,
      hand: [],
      shown: false,
      randomValue: 0,
      highestValue: -1,
      isTurn: false,
      folded: false,
      moveMade: "",
      winner: false
    };
  },
  components: {
    card
  },
  created() {
    EventBus.$on("toOpponent", data => {
      if (data[0] == this.id && this.money != 0) {
        this.hand.push(data[1]);
      }
    });
    EventBus.$on("theWinnerIs", winID => {
      if (winID == this.id) {
        this.winner = true;
        this.money += this.$store.getters.getPot;
      }
    });
    EventBus.$on("newRound", () => {
      if(this.money == 0){
        this.ImOut = true;
        this.fold();
      }
      else{
        this.hand = [];
        this.moveMade = "";
        this.isTurn = false;
        this.highestValue = -1;
        this.randomValue = 0;
        this.winner = false;
        this.shown = false;
        this.folded = false;
        document.getElementById("opponent"+this.id).style.opacity = 1;
      }
    });
    window.setInterval(() => {
      if (
        this.$store.getters.getTurn == this.id &&
        !this.isTurn &&
        !this.folded
      ) {
        if(this.ImOut){
          this.$store.commit("nextTurn");
        }
        else{
          this.isTurn = true;
          this.randomNumber();
          const sleep = mill => {
            return new Promise(resolve => setTimeout(resolve, mill));
          };
          sleep(this.randomValue * 30).then(() => {
            this.makeMove();
            this.isTurn = false;
            this.$store.commit("nextTurn");
          });
        }
      } else if (
        this.$store.getters.getTurn == -1 &&
        !this.shown &&
        !this.folded
      ) {
        this.testCheckHand();
        EventBus.$emit("showingCards", [this.highestValue, this.id]);
        console.log(this.highestValue);
        this.shown = true;
      }
    }, 1000);
  },
  methods: {
    randomNumber: function() {
      this.randomValue = Math.floor(Math.random() * 100);
    },
    getCard(card) {
      this.hand.push(card);
    },
    makeMove() {
      if(this.$store.getters.amOnlyOneLeft == true){
        this.fold();
        return
      }
      this.testCheckHand();
      //WORKING HERE
      if (this.highestValue > 8) {
        //Straight Flush and Royal Flush
        if (this.randomValue > 50) {
          //RAISE
          console.log("RAISE");
          this.moveMade = "RAISE";
          this.raise();
        } else if (this.randomValue > 20 && this.randomValue <= 50) {
          //CALL
          console.log("CALL");
          this.moveMade = "CALL";
          this.call();
        } else if (this.randomValue > 1 && this.randomValue <= 20) {
          //CHECK
          console.log("CHECK");
          this.moveMade = "CHECK";
          this.check();
        } else if (this.randomValue <= 1) {
          //FOLD
          console.log("FOLD");
          this.moveMade = "FOLD";
          this.fold();
        }
      } else if (this.highestValue <= 8 && this.highestValue > 5) {
        //Flush to 4 of a Kind
        if (this.randomValue > 70) {
          //RAISE
          console.log("RAISE");
          this.moveMade = "RAISE";
          this.raise();
        } else if (this.randomValue > 20 && this.randomValue <= 70) {
          //CALL
          console.log("CALL");
          this.moveMade = "CALL";
          this.call();
        } else if (this.randomValue > 3 && this.randomValue <= 20) {
          //CHECK
          console.log("CHECK");
          this.moveMade = "CHECK";
          this.check();
        } else if (this.randomValue <= 3) {
          //FOLD
          console.log("FOLD");
          this.moveMade = "FOLD";
          this.fold();
        }
      } else if (this.highestValue <= 5 && this.highestValue > 3) {
        //Straight || 3 of Kind
        if (this.randomValue > 60) {
          //RAISE
          console.log("RAISE");
          this.moveMade = "RAISE";
          this.raise();
        } else if (this.randomValue > 40 && this.randomValue <= 60) {
          //CALL
          console.log("CALL");
          this.moveMade = "CALL";
          this.call();
        } else if (this.randomValue > 10 && this.randomValue <= 40) {
          //CHECK
          console.log("CHECK");
          this.moveMade = "CHECK";
          this.check();
        } else if (this.randomValue <= 10) {
          //FOLD
          console.log("FOLD");
          this.moveMade = "FOLD";
          this.fold();
        }
      } else if (this.highestValue <= 3 && this.highestValue > 0) {
        //High Card to 2 Pair
        if (this.randomValue > 75) {
          //RAISE
          console.log("RAISE");
          this.moveMade = "RAISE";
          this.raise();
        } else if (this.randomValue > 40 && this.randomValue <= 75) {
          //CALL
          console.log("CALL");
          this.moveMade = "CALL";
          this.call();
        } else if (this.randomValue > 15 && this.randomValue <= 40) {
          //CHECK
          console.log("CHECK");
          this.moveMade = "CHECK";
          this.check();
        } else if (this.randomValue <= 15) {
          //FOLD
          console.log("FOLD");
          this.moveMade = "FOLD";
          this.fold();
        }
      }
    },
    fold() {
      this.$store.commit("fold", this.id);
      this.folded = true;
      var fadeTarget = document.getElementById("opponent"+this.id);
      var fadeEffect = setInterval(function () {
      if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = 1;
      }
      if (fadeTarget.style.opacity > 0) {
          fadeTarget.style.opacity -= 0.1;
      } else {
          clearInterval(fadeEffect);
      }
      }, 50);
    },
    raise() {
      if (this.$store.getters.getbet == 0) {
        this.$store.commit("raise", 10);
        this.moveMade += " 10";
      } else if (
        this.money >= Number(100 / (10 - Math.round(this.highestValue))) ||
        Math.round(Number(100 / (10 - Math.round(this.highestValue)))) >=
          2 * this.$store.getters.getBet
      ) {
        this.$store.commit(
          "raise",
          Math.round(Number(100 / (10 - Math.round(this.highestValue))))
        );
        this.money -= Math.round(
          Number(100 / (10 - Math.round(this.highestValue)))
        );
        this.moveMade +=
          " " + Math.round(Number(100 / (10 - Math.round(this.highestValue))));
      } else {
        this.$store.commit("raise", this.money);
        this.money = 0;
        this.moveMade = "ALL IN " + this.money;
      }
    },
    check() {
      if (this.$store.getters.getBet == 0) {
        this.$store.commit("check");
      } else {
        this.call();
        this.moveMade = "CALL";
      }
    },
    call() {
      if (this.$store.getters.getBet == 0) {
        this.moveMade = "CHECK";
        this.check();
      } else if (this.money >= Number(this.$store.getters.getBet)) {
        this.$store.commit("call");
        this.money -= Number(this.$store.getters.getBet);
        return true;
      } else {
        this.$store.commit("bet", this.money);
        this.money = 0;
        return true;
      }
      return false;
    },
    bet() {
      if (this.money - Number(this.$store.getters.getBet) < 0) {
        this.$store.commit("bet", this.money);
        this.money = 0;
        return true;
      }
      return false;
    },
    testCheckHand() {
      var combos;
      var totCards = [];
      var riverCards = this.$store.getters.getRiver;
      for (var i = 0; i < this.hand.length; i++) {
        totCards.push(this.hand[i]);
      }
      for (var i = 0; i < riverCards.length; i++) {
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
        };
        var all = [];
        for (var i = min; i < a.length; i++) {
          fn(i, a, [], all);
        }
        all.push(a);
        return all;
      };
      if (totCards.length >= 5) {
        combos = combine(totCards, 5);
        if (totCards.length == 6) {
          combos = combos.splice(0, 6);
        } else if (totCards.length == 7) {
          combos = combos.splice(0, 21);
        }
      } else {
        combos = combine(totCards, 2);
      }
      this.highestValue = -1;
      for (var i = 0; i < combos.length; i++) {
        var currVal = this.$store.getters.getBest(combos[i]);
        if (currVal > this.highestValue) {
          this.highestValue = currVal;
        }
      }
      //console.log(this.$store.getters.getHandString(this.highestValue));
    }
  }
};
</script>

<style>
#opponent, #opponent1, #opponent2, #opponent3, #opponent4 {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ccc;
  margin-top: 60px;
}
.notActive {
  box-shadow: 0px 0px 0px 0px #000;
}
.active {
  box-shadow: 0px 0px 5px 10px #ccc;
}
.winner {
  box-shadow: 0px 0px 5px 10px gold;
}
.out {
  display: none;
}
#actOpponent {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  box-shadow: 0px 0px 5px 10px #ccc;
}
#opponentImg {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
  width: 75px;
  height: 125px;
  padding: 2px;
  border: solid rgb(0, 0, 0) (0, 0, 0) 2px;
  border-radius: 5%;
}
.smallCards {
  width: 100px !important;
  height: 150px !important;
}
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: table-row;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
