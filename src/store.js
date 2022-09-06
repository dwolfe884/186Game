import Vue from 'vue';
import Vuex from 'vuex';
import EventBus from './event-bus';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    currentTurn: 0,
    totalPlayers: 5,
    currentPot: 0,
    bet: 0,
    numRounds: 0,
    consecutiveCallsToCall: 0,
    riverCards: [],
    gameOver: false,
    foldedPlayers: [],
    onlyoneleft: false,
  },
  mutations: {
    addToRiver: (state, card) => {
      state.riverCards.push(card);
    },
    nextTurn: (state) => {
      if (state.foldedPlayers.length == 5) {
        state.currentTurn = -1;
        state.gameOver = true;
        console.log("GAME IS OVER");
      }
      else {
        do {
          state.currentTurn = (state.currentTurn + 1) % (state.totalPlayers);
        } while (state.foldedPlayers.includes(state.currentTurn));
        console.log(state.consecutiveCallsToCall + " = " + (state.totalPlayers - state.foldedPlayers.length));
        if (state.consecutiveCallsToCall == state.totalPlayers - state.foldedPlayers.length) {
          EventBus.$emit("nowRiver");
          state.bet = 0;
          state.consecutiveCallsToCall = 0;
          if (state.numRounds == 3) {
            state.currentTurn = -1;
            state.gameOver = true;
            console.log("GAME IS OVER");
          }
          else {
            state.numRounds++;
          }
        }
      }
    },
    raise: (state, amount) => {
      if (amount > state.bet) {
        state.bet = amount;
        state.consecutiveCallsToCall = 0;
      }
      state.consecutiveCallsToCall++;
      state.currentPot += Number(amount);
    },
    check: (state) => {
      state.consecutiveCallsToCall++;
    },
    call: (state) => {
      state.currentPot += Number(state.bet);
      state.consecutiveCallsToCall++;
    },
    fold: (state, id) => {
      state.foldedPlayers.push(id);
      if(state.totalPlayers - state.foldedPlayers.length == 1){
        state.onlyoneleft = true;
        console.log("everuone folded");
      }
    },
    newRound: (state) => {
      state.onlyoneleft = false;
      state.foldedPlayers = [];
      state.currentTurn = 0;
      state.currentPot = 0;
      state.bet = 0;
      state.numRounds = 0;
      state.consecutiveCallsToCall = 0;
      state.riverCards = [];
      state.gameOver = false;
      EventBus.$emit("newRound");
    }
  },
  actions: {},
  getters: {
    getTurn: (state) => state.currentTurn,
    getPot: (state) => state.currentPot,
    getBet: (state) => state.bet,
    amOnlyOneLeft: (state) => state.onlyoneleft,
    getRiver: (state) => state.riverCards,
    getNumFolded: (state) => state.foldedPlayers.length,
    getBest: (state) => (hand) => {
      hand.sort(function (a, b) {
        return a.value - b.value;
      });
      if (hand.length == 2) {

        if (hand[0].value == hand[1].value) {
          return 1 + 0.0001 * (hand[0].value);//[1.02 - 1.14] pair
        }
        else {
          return (0 + 0.0001 * Math.max(hand[0].value, hand[1].value)); //[0.02 - 0.14] high card
        }
      }
      else if (hand.length == 5) {
        var dupes = [];
        var i = 0;
        while (i < hand.length) {
          var currDupes = {
            value: hand[i].value,
            occurances: 0
          };
          for (var j = 0; j < hand.length; j++) {
            if (hand[j].value == currDupes.value) {
              currDupes.occurances++;
            }
          }
          dupes.push(currDupes);
          i += currDupes.occurances;
        }
        dupes.sort(function (a, b) {
          return a.occurances - b.occurances;
        });
        var isFlush = true;
        var isStraight = dupes[dupes.length - 1].occurances == 1 && hand[0].value + 4 == hand[4].value;
        for (var i = 0; i < hand.length; i++) {
          if (hand[0].suit != hand[i].suit) {
            isFlush = false;
          }
        }
        //CHECK ROYAL FLUSH
        if (isFlush && isStraight && hand[4].value == 14) {
          return 9 + 0.14 + 0.0014;
        }
        //CHECK STRAIGHT FLUSH
        if (isFlush && isStraight) {
          return 8 + hand[4].value * 0.01 + hand[4].value * 0.0001;
        }
        //CHECK 4 OF A KIND
        if (dupes[dupes.length - 1].occurances == 4) {
          return 7 + dupes[dupes.length - 1].value * 0.01 + dupes[0].value * 0.0001;
        }
        //CHECK FULL HOUSE
        if (dupes[1].occurances == 3 && dupes[0].occurances == 2) {
          return 6 + dupes[dupes.length - 1].value * 0.01 + dupes[0].value * 0.0001;
        }
        //CHECK FLUSH
        if (isFlush) {
          return 5 + hand[4].value * 0.01 + hand[3].value * 0.0001;
        }
        //CHECK STRAIGHT
        if (isStraight) {
          return 4 + hand[4].value * 0.01 + hand[4].value * 0.001;
        }
        //CHECK 3 OF A KIND
        if (dupes[dupes.length - 1].occurances == 3) {
          if (dupes[dupes.length - 1].value == hand[4].value) {
            return 3 + dupes[dupes.length - 1].value * 0.01 + hand[1].value * 0.0001;
          }
          return 3 + dupes[dupes.length - 1].value * 0.01 + hand[4].value * 0.0001;
        }
        //CHECK 2 PAIR
        if (dupes[dupes.length - 1].occurances == 2 && dupes[dupes.length - 2].occurances == 2) {
          return 2 + Math.max(dupes[dupes.length - 1].value, dupes[dupes.length - 2].value) * 0.01 +
            Math.min(dupes[dupes.length - 1].value, dupes[dupes.length - 2].value) * 0.0001;
        }
        //CHECK PAIR
        if (dupes[dupes.length - 1].occurances == 2) {
          if (dupes[dupes.length - 1].value == hand[4].value) {
            return 1 + dupes[dupes.length - 1].value * 0.01 + hand[2].value * 0.0001;
          }
          return 1 + dupes[dupes.length - 1].value * 0.01 + hand[4].value * 0.0001;
        }
        //CHECK HIGH CARD
        return 0 + hand[4].value * 0.0001;
      }
      else {
        return -1;
      }
    },
    //here
    getHandString: (state) => (handVal) => {

      var returnString = "";
      if (handVal > 9) {
        returnString = "Royal Flush";
        return returnString;
      }
      else if (handVal < 9 && handVal > 8) {
        returnString = "Straight Flush, ";
      }
      else if (handVal < 8 && handVal > 7) {
        returnString = "4 of a Kind, ";
      }
      else if (handVal < 7 && handVal > 6) {
        returnString = "Full House";
        return returnString;
      }
      else if (handVal < 6 && handVal > 5) {
        returnString = "Flush, ";
      }
      else if (handVal < 5 && handVal > 4) {
        returnString = "Straight, ";
      }
      else if (handVal < 4 && handVal > 3) {
        returnString = "3 of a Kind, ";
      }
      else if (handVal < 3 && handVal > 2) {
        returnString = "Two Pair, ";
      }
      else if (handVal < 2 && handVal > 1) {
        returnString = "Pair, ";
      }
      else {
        returnString = "High Card, ";
      }

      //after decimal
      var decimalVal = handVal.toFixed(4).toString();
      console.log(decimalVal);
      decimalVal = decimalVal.substr(decimalVal.indexOf(".") + 3, decimalVal.indexOf(".") + 3);
      console.log(decimalVal);
      if (decimalVal == "14") {
        returnString += "Ace High";
      }
      else if (decimalVal == "13") {
        returnString += "King High";
      }
      else if (decimalVal == "12") {
        returnString += "Queen High";
      }
      else if (decimalVal == "11") {
        returnString += "Jack High";
      }
      else if (decimalVal == "10") {
        returnString += "10 High";
      }
      else if (decimalVal == "09") {
        returnString += "9 High";
      }
      else if (decimalVal == "08") {
        returnString += "8 High";
      }
      else if (decimalVal == "07") {
        returnString += "7 High";
      }
      else if (decimalVal == "06") {
        returnString += "6 High";
      }
      else if (decimalVal == "05") {
        returnString += "5 High";
      }
      else if (decimalVal == "04") {
        returnString += "4 High";
      }
      else if (decimalVal == "03") {
        returnString += "3 High";
      }
      else if (decimalVal == "02") {
        returnString += "2 High";
      }

      return returnString;
    }
  }
});