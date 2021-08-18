<template>
  <div>
    <div class="wrapper">
      <div>
        <h1 class="logoName">Website Logo</h1>
        <div class="navBtns">
          <router-link to="nft"
            ><button class="navBtn" id="selected">NFT</button></router-link
          >
          <!-- <a href="nft"><button class="navBtn" id="selected">NFT</button></a> -->
          <router-link to=""
            ><button class="navBtn">Home Page</button></router-link
          >
        </div>
      </div>
    </div>
    <div class="secondDiv">
      <div class="table">
        <h4 class="tableHeading">
          Enter the smart contract address of Ethereum or Binance Smart Chain
        </h4>
        <input
          type="text"
          class="tableInput"
          v-model="contractAddress"
          placeholder="Enter The smart Contract Address"
        />
        <br />
        <button v-if="loading === false" class="checkBtn" @click="checkIt()">
          Check It!
        </button>
        <div v-if="loading === true" class="checkBtn2">
          <span class="lds-rings-span">loading...</span>
        </div>
        <span v-if="ethereum === false" class="chainInfo"
          >Binance Smart Chain</span
        >
        <span v-if="ethereum === true" class="chainInfo">Ethereum Chain</span>
      </div>
      <br /><br /><br />
      <div class="box">
        <span
          ><span class="boxHeading"> Contract Address </span>
          <span class="boxImg"
            ><img
              src="../assets/images/accountAddressIcon.png"
              width="50px" /></span></span
        ><br />
        <span
          ><span class="arrowUpImg"
            ><img src="../assets/images/arrowUpIcon.png" width="20px" /></span
          ><span class="boxSubHeading"
            >{{ filteredAddress }}
            <!-- <div v-if="loading === true" class="lds-ring"><div></div><div></div><div></div><div></div></div> -->
            <button
              class="tooltips"
              v-clipboard:copy="contractAddress"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >
              <span class="tooltiptexts" id="myTooltips">Copy to clipboard</span
              ><img
                class="icon-copy"
                src="../assets/images/content_copy-black-18dp.svg"
                alt=""
              />
            </button> </span
        ></span>
      </div>
      <div class="box">
        <span
          ><span class="boxHeading"> Contract Holders </span>
          <span class="boxImg"
            ><img
              src="../assets/images/amountBalance.png"
              width="50px" /></span></span
        ><br />
        <span class="boxSubHeading2"
          ><span class="arrowUpImg2"
            ><img src="../assets/images/arrowUpIcon.png" width="20px" /></span
          ><span v-if="loading === false">{{ tokenHolders }}</span>
          <div v-if="loading === true" class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </span>
      </div>
      <div class="box">
        <span
          ><span class="boxHeading3" style="margin-left: -40px">
            Contract Info
          </span>
          <span class="boxImg">
            <img
              v-if="ethereum === true"
              src="../assets/images/ethereum.svg"
              width="35px"
            /> </span
        ></span>
        <br />
        <img
          v-if="ethereum === false"
          src="../assets/images/bscIcon.png"
          width="60px"
          style="margin-top: -15px; margin-left: 40px"
        />
        <span class="otherTokenName">Creation Date</span>
        <span class="boxSubHeading3"
          ><span class="arrowUpImg3"
            ><img src="../assets/images/arrowUpIcon.png" width="20px" /></span
          ><span>{{ formatedDate }}</span></span
        >
      </div>
    </div>
  </div>
</template>

<script>
import cheerio from "cheerio";
export default {
  data() {
    return {
      contractAddress: "",
      filteredAddress: "",
      firstTwoDigit: "",
      formatedDate: "",
      ethereum: true,
      loading: false,
      tokenChain: "",
      tokenHolders: "",
      enterPass: true,
    };
  },
  methods: {
    checkIt() {
      this.firstTwoDigit = this.contractAddress.substring(0, 2);
      if (this.contractAddress === "") {
        this.$toasted.error("Address Invalid");
        this.btnCondition = "normal";

        // hello hello hello hello
        this.enterSeed = "false";
      } else if (this.firstTwoDigit.match(/0x/)) {
        this.$http
          .post(
            "https://api.etherscan.io/api?module=contract&action=getabi&address=" +
              this.contractAddress +
              "&apikey=ESSJPZ2U572NFU51DB1JY9VFWXNH6M2A8V"
          )
          .then(function (data) {
            // if(data.body.status === '0' || this.contractAddress.length != 42) {
            if (this.contractAddress.length !== 42) {
              console.log("address in not 42 diggits");
              this.$toasted.error("Address Invalid");
            } else if (data.body.status === "0") {
              this.loading = true;
              console.log(data);
              console.log("Smart Contract was not etherscan Contract");
              this.loading = false;
            } else {
              this.tokenChain = "ETH";
              this.loading = true;
              this.ethereum = true;
              const startAddr = /\w{8}/;
              const endAddr = /\w{8}$/;
              const startAddrR = this.contractAddress.match(startAddr);
              const endAddrR = this.contractAddress.match(endAddr);
              this.filteredAddress =
                startAddrR.toString() + " ... " + endAddrR.toString();
              console.log("etherscan status: ", data.data.status);

              // this.$http
              //   .get(
              //     "http://143.198.188.112/tokenHolders?tokenAddress=" +
              //       this.contractAddress +
              //       "&tokenChain=" +
              //       this.tokenChain
              //   )
              //   .then(function (data) {
              //     const filteredAddressTxt = data.data.holders.replace(
              //       "addresses",
              //       ""
              //     );
              //     this.tokenHolders = filteredAddressTxt;
              //     console.log("ETH holders: ", data.data.holders);
              //   })
              //   .catch(function (error) {
              //     console.log("ETH holders Eroor: ", error);
              //   });
              console.log("here");
              this.$http
                .get(
                  "http://localhost:8080/one/token/" +
                    this.contractAddress
                )
                .then(function (response) {
                  console.log("entered  ");
                  console.log("response of cheerio: ", response);
                  // console.log(response.data);
                  const $ = cheerio.load(response.data);
                  const holders = $(
                    'div[id = "ContentPlaceHolder1_tr_tokenHolders"] > div > div'
                  )
                    .text()
                    .trim();
                  console.log("hoders data: ", holders);

                  const filteredAddressTxt = holders.replace("addresses", "");
                  this.tokenHolders = filteredAddressTxt;
                  console.log("ETH holders: ", data.data.holders);
                })
                .catch(function (error) {
                  console.log("ETH holders Eroor: ", error);
                });

              this.$http
                .post(
                  "https://api.etherscan.io/api?module=account&action=txlist&address=" +
                    this.contractAddress +
                    "&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=ESSJPZ2U572NFU51DB1JY9VFWXNH6M2A8V"
                )
                .then(function (data) {
                  let unix_timestamp = data.data.result[0].timeStamp;
                  var timestampDate = new Date(unix_timestamp * 1000);
                  this.formatedDate = timestampDate.toLocaleString();
                  console.log("date is", this.formatedDate);
                  console.log("tx list data2: ", data.data.result[0].timeStamp);
                  this.loading = false;
                  // change it
                });
            }
          })
          .catch(function (error) {
            console.log("error", error);
          });
        this.$http
          .post(
            "https://api.bscscan.com/api?module=contract&action=getabi&address=" +
              this.contractAddress +
              "&apikey=PYX6KG2G8GF6QJ5D3KF558U22RWEKX24JA"
          )
          .then(function (data) {
            if (this.contractAddress.length !== 42) {
              console.log("address in not 42 diggits");
            } else if (data.body.status === "0") {
              console.log("Smart Contract was not BSC Contract");
            } else {
              this.tokenChain = "BSC";
              this.loading = true;
              this.ethereum = false;
              const startAddr = /\w{8}/;
              const endAddr = /\w{8}$/;
              const startAddrR = this.contractAddress.match(startAddr);
              const endAddrR = this.contractAddress.match(endAddr);
              this.filteredAddress =
                startAddrR.toString() + " ... " + endAddrR.toString();
              console.log("BSC scan status: ", data.data.status);

              this.$http
                .get(
                  `https://floating-eyrie-82224.herokuapp.com/https://bscscan.com/token/ ${this.contractAddress}`,
                  {
                    headers: {
                      Authorization: "ESSJPZ2U572NFU51DB1JY9VFWXNH6M2A8V",
                    },
                  }
                )
                .then(function (response) {
                  console.log("response of cheerio: ", response);
                  const $ = cheerio.load(response.data);
                  const holders = $(
                    'div[id = "ContentPlaceHolder1_tr_tokenHolders"] > div > div'
                  )
                    .text()
                    .trim();
                  console.log("hoders data: ", holders);

                  const filteredAddressTxt = holders.replace("addresses", "");
                  this.tokenHolders = filteredAddressTxt;
                  console.log("ETH holders: ", data.data.holders);
                })
                .catch(function (error) {
                  console.log("BSC holders error: ", error);
                });

              this.$http
                .post(
                  "https://api.bscscan.com/api?module=account&action=txlist&address=" +
                    this.contractAddress +
                    "&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=PYX6KG2G8GF6QJ5D3KF558U22RWEKX24JA"
                )
                .then(function (data) {
                  console.log(data);
                  let unix_timestamp = data.data.result[0].timeStamp;
                  var timestampDate = new Date(unix_timestamp * 1000);
                  this.formatedDate = timestampDate.toLocaleString();
                  console.log("date is", this.formatedDate);
                  console.log("tx list data2: ", data.data.result[0].timeStamp);
                  this.loading = false;
                });
            }
          })
          .catch(function (error) {
            console.log("error", error);
          });
      } else {
        this.$toasted.error("Your Address was wrong.");
      }
    },
    onCopy(e) {
      console.log("Your Msg", e.text);
      this.$toasted.success("Address Copied " + this.contractAddress);
    },
    onError(e) {
      console.log(e.key);
      this.$toasted.success("Failed to copy Texts " + this.contractAddress);
    },
  },
};
</script>

<style>
.wrapper {
  width: 100%;
  height: 300px;
  background-color: rgb(0, 82, 255);
  margin-top: -19px;
  margin-left: -8px;
  color: white;
  padding: 30px;
}
.secondDiv {
  margin-left: -8px;
  margin-top: -20px;
  width: 100%;
  min-height: 550px;
  max-height: auto;
  position: relative;
  top: 30%;
  background-image: url(../assets/images/business-bg.png);
  background-position: 100%;
  background-repeat: no-repeat;
  margin-bottom: -40px;
  padding-bottom: 100px;
}
.logoName {
  display: inline-block;
  text-align: start;
  padding-left: 70px;
  float: left;
}
.navBtn {
  display: inline-block;
  position: relative;
  float: right;
  padding: 10px 14px;
  border-radius: 7px;
  border: none;
  margin: 10px;
  margin-top: 30px;
}
.navBtn:hover {
  border: 2px solid white;
  background-color: rgb(0, 82, 255);
  color: white;
  font-weight: bold;
}
.navBtns {
  margin-right: 150px;
}
#selected {
  border: 2px solid white;
  background-color: rgb(0, 82, 255);
  color: white;
  font-weight: bold;
}
#selected:hover {
  border: 2px solid rgb(0, 82, 255);
  background-color: #eee;
  color: black;
  font-weight: normal;
}

/* Table */
.table {
  background-color: #eee;
  color: black;
  width: 60%;
  min-height: 200px;
  display: block;
  height: auto;
  border-radius: 7px;
  margin: 0 auto;
  position: relative;
  right: 30px;
  margin-top: -120px;
  text-align: start;
  box-shadow: 3px 0px 11px 4px rgb(168, 168, 168);
}
.tableHeading {
  font-size: 17px;
  padding: 30px 30px 0px 30px;
  padding-left: 110px;
}
.tableInput {
  margin-left: 110px;
  width: 70%;
  height: 30px;
  border-radius: 6px;
  border: none;
  border: 1px solid rgb(187, 187, 187);
  background-color: white;
  padding-left: 20px;
  outline: none;
}
.checkBtn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: rgb(0, 82, 255);
  color: white;
  font-weight: bold;
  margin-left: 110px;
  margin-top: 20px;
  cursor: pointer;
  display: inline;
  flex-wrap: nowrap;
}
.checkBtn2 {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: rgb(0, 82, 255);
  color: white;
  font-weight: bold;
  margin-left: 110px;
  margin-top: 20px;
  position: relative;
  top: 25px;
  cursor: pointer;
  display: inline;
  flex-wrap: nowrap;
}

/* Boxes */
.boxes {
  background-color: red !important;
  width: 100%;
  /* height: 10%; */
  position: absolute;
  right: 0;
  left: 0;
  top: 18%;
}
.box {
  margin-top: 30px;
  background-color: white;
  display: inline-block;
  width: 24%;
  height: 16%;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  overflow: hidden;
  /* -moz-box-shadow:    3px 3px 5px 6px #ccc;
  -webkit-box-shadow: 3px 3px 5px 6px #ccc; */
  box-shadow: 3px 0px 11px 4px rgb(230, 230, 230);
  margin-right: 40px;
}
.boxHeading {
  float: left;
  /* position: relative; */
  /* top: -22px; */
  /* left: -80px; */
  color: #6f7985;
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  margin-left: 20px;
}
.boxImg {
  float: right;
  margin-right: 20px;
  margin-top: 5px;
  /* position: relative;
  left: 90px; */
}
.boxSubHeading {
  /* top: -11px; */
  color: #13e753;
  width: 60%;
  /* float: right;
  position: relative;
  left: -250px;
  top: 7px; */
  float: left;
  margin-top: 67px;
  margin-left: -130px;
  flex-wrap: nowrap;
}
.arrowUpImg {
  float: left;
  position: relative;
  top: 65px;
  margin-left: -150px;
}
.boxHeading3 {
  float: left;
  /* position: relative; */
  /* top: -22px; */
  /* left: -80px; */
  color: #6f7985;
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  position: relative;
  left: 65px;
}
.arrowUpImg2 {
  float: left;
  margin-left: 10px;
  margin-top: -3px;
}
.loading_class {
  vertical-align: sub;
  width: 140px;
  margin: 0 auto;
  position: absolute;
  left: 45%;
  transform: translateX(-50%);
}
.boxSubHeading2 {
  color: #13e753;
  width: 70%;
  float: left;
  margin-top: 67px;
  margin-left: -155px;
  flex-wrap: nowrap !important;
}
.otherTokenName {
  float: left;
  margin-top: 40px;
  margin-left: -45px;
  font-weight: bold;
}
.arrowUpImg3 {
  float: left;
  margin-left: -50px;
}
.boxSubHeading3 {
  color: #13e753;
  width: 45%;
  float: left;
  margin-top: 72px;
  margin-left: -53px;
}
@media only screen and (max-width: 1630px) {
  .boxHeading {
    position: relative;
    top: -10px;
    left: -10px;
  }
  .boxSubHeading {
    position: relative;
    top: -20px;
    left: -10px;
  }
  .arrowUpImg {
    position: relative;
    /* top: -10px; */
    left: -10px;
    margin-top: -20px;
  }
  .boxSubHeading2 {
    position: relative;
    top: -20px;
    left: -15px;
  }
  .boxHeading3 {
    position: relative;
    top: -10px;
    left: 45px;
  }
  .otherTokenName {
    position: relative;
    top: -15px;
    left: -20px;
  }
  .boxSubHeading3 {
    position: relative;
    top: -15px;
    left: -20px;
  }
}
#copy-key {
  margin-left: 15px;
  border-radius: 10px;
  padding: 2px 7px;
  position: relative;
  right: 10px;
  top: 2px;
}
.tooltip {
  position: relative;
  display: inline-block;
  border: none;
  background-color: rgb(255, 251, 243);
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 140px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 150%;
  left: 50%;
  margin-left: -75px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: 10px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

.tooltips {
  float: right;
  display: inline-block;
  border: none;
  background-color: rgb(255, 251, 243);
  outline: none;
  cursor: pointer;
}

.tooltips .tooltiptexts {
  visibility: hidden;
  width: 140px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 150%;
  left: 60%;
  margin-left: 0px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltips .tooltiptexts::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -10px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltips:hover .tooltiptexts {
  visibility: visible;
  opacity: 1;
}
.chainInfo {
  float: right;
  margin-right: 30px;
  margin-top: 60px;
  color: rgb(0, 82, 255);
  font-weight: bold;
  font-family: "Courier New", Courier, monospace;
}
.lds-ring {
  display: inline-block;
  position: relative;
  width: 40px;
  height: 40px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 34px;
  height: 34px;
  margin: 1px;
  border: 4px solid #13e753;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #13e753 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.overvlay {
  width: 50%;
  height: 40%;
  background-color: #172b4d;
  position: absolute;
  top: 200px;
  left: 0;
  right: 0;
  z-index: 1;
  margin: 0 auto !important;
  border-radius: 10px;
}
.enterSeedHeading {
  color: white;
  margin-top: 100px;
  text-transform: uppercase;
}
#seedInput {
  margin: 0 auto;
}
.transactionBtn {
  letter-spacing: 0.025em;
  font-size: 0.875rem;
  color: #fff;
  background-color: #5e72e4;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-top: 10px;
  padding: 10px 10px;
  border: none;
  border-radius: 4px;
}
.AddressToInput {
  border: none;
  -webkit-transition: -webkit-box-shadow 0.15s ease;
  transition: -webkit-box-shadow 0.15s ease;
  transition: box-shadow 0.15s ease;
  transition: box-shadow 0.15s ease, -webkit-box-shadow 0.15s ease;
  font-size: 0.875rem;
  display: block;
  width: 100%;
  height: calc(1.5em + 1.25rem + 2px);
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #8898aa;
  background-color: #fff;
  background-clip: padding-box;
  border-radius: 0.375rem;
  -webkit-box-shadow: none;
  box-shadow: none;
  -webkit-transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  font-family: inherit;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);
  outline: none;
}

.lds-rings {
  display: inline-block;
  flex-wrap: nowrap;
  position: relative;
  width: 100px;
  height: 25px;
}
.lds-rings div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 25px;
  height: 25px;
  margin: 1px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #ffffff transparent transparent transparent;
}
.lds-rings-span {
  font-size: 15px;
}
.lds-rings div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-rings div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-rings div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-rings {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>



