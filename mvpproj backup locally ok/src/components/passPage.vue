<template>
  <div class="mainOvervlay">
    <div class="overvlay">
      <div>
        <br /><br />
        <!-- <span class="curvedArrow"><img src="../assets/images/curvedArrow.png" width="25px"></span> -->
        <h3 class="enterSeedHeading">Please enter Password to continue.</h3>
        <input
          type="text"
          class="AddressToInput"
          placeholder="***************************"
          style="width: 60%"
          id="seedInput"
          required
          v-model="passwordWritten"
        />
        <h1 style="text-align: center">
          <!-- v-if="btnCondition === 'normal'" -->
          <button class="transactionBtn" @click="checkPass()">
            Access Crypto Analysis Tool
          </button>
          <!-- <button v-if="btnCondition === 'working'" class="transactionBtn">
            <img
              src="../assets/images/loading.gif"
              style="
                width: 20px;
                margin-right: 4px;
                position: relative;
                top: 5px;
              "
            />
            loading...
          </button> -->
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      enterPass: true,
      passwordWritten: "",
    };
  },
  methods: {
    checkPass() {
        this.$router.push("mainPage");
    }
    // checkPass() {
    //   if (this.passwordWritten === "&5S[y'nKY#{~{x-") {
    //     this.$router.push("nft");
    //   } else {
    //     this.$toasted.error("Password wrong!");
    //   }
    // },
  },
};
</script>

<style>
body{
    background-image: url(../assets/images/hero.png);
    width: 100%;
    height: 100%;
}
</style>