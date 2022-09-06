<template>
  <div v-bind:style="{'background-color': color}" id="card">
    <h1>{{ printName }}</h1>
    <p> OF </p>
    <h2>{{ suit }}</h2>
  </div>
</template>

<script>
export default {
  name: 'card',
  props: ['value','suit','color','id','printName'],
}
</script>

<style>
#card {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
  background-color: #42b983;
  width: 150px;
  height: 200px;
  padding: 2px;
  border: solid rgb(0, 0, 0)(0, 0, 0) 2px;
  border-radius: 5%;
  
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
