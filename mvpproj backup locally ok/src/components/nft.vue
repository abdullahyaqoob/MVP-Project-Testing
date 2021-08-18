<template>
  <div>
    <div>
      <div class="wrapper">
        <div>
          <h1 class="logoName">Website Logo</h1>
          <div class="navBtns">
            <router-link to="/nft"
              ><button class="navBtn">NFT</button></router-link
            >
            <router-link to=""
              ><button class="navBtn" id="selected">
                Home Page
              </button></router-link
            >
            <!-- <h5>0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d</h5> -->
          </div>
        </div>
      </div>
      <div class="secondDiv">
        <div class="table">
          <h4 class="tableHeading">
            Enter the smart contract address to find NFT
          </h4>
          <input
            type="text"
            class="tableInput"
            v-model="nftAddress"
            placeholder="Enter The smart Contract Address"
          />
          <br />
          <button v-if="!loading" class="checkBtn" @click="checkNFT()">
            Check It!
          </button>
          <button v-else class="checkBtn" @click="checkNFT()">
            Loading...
          </button>
          <!-- <span class="chainInfo">Total NFT's: {{this.allNftLength}}</span> -->
        </div>
        <br /><br /><br />

        <table width="80%" class="tableClass">
          <thead>
            <tr>
              <th>ID</th>
              <th>NFT Project Name</th>
              <th>NFT Token ID</th>
              <th>Open Sea Token URL</th>
              <th>Property Traits</th>
            </tr>
            <br />
          </thead>

          <tbody v-if="!loading">
            <tr v-for="(data, index) in requiredTraitsData" :key="index">
              <td data-title="Name">{{ index + 1 }}</td>
              <td data-title="ID" :title="data.name">{{ data.name }}</td>
              <td data-title="ID" :title="data.tokenId">{{ data.tokenId }}</td>
              <td data-title="ID" :title="data.nftUrl">
                {{ data.nftUrl.substring(0, 30) + " ..."
                }}<button
                  class="tooltips"
                  v-clipboard:copy="data.nftUrl"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >
                  <span class="tooltiptexts" id="myTooltips"
                    >Copy to clipboard</span
                  ><img
                    class="icon-copy"
                    src="../assets/images/content_copy-black-18dp.svg"
                    alt=""
                  />
                </button>
              </td>
              <div
                class="traitsRow"
                style="text-align: start; margin-left: 40px; margin-top: 3px"
                v-for="(traitss, index) in data.traits"
                :key="index"
              >
                <span style="color: rgb(0, 10, 255)" :title="traitss.value">{{
                  traitss.value
                }}</span>
                <span
                  style="margin-left: 20px; color: red"
                  :title="traitss.value"
                  >{{ traitss.trait_count }}</span
                ><br />
                <!-- <span style="margin-left: 20px; color: red;" :title="traitss.value" :v-model="percentage(traitss.value)">{{percentage}}</span><br /> -->
              </div>
            </tr>
          </tbody>
        </table>
        <div v-if="loading">
          <br /><br /><br /><br />
          <div
            style="
              box-shadow: 3px 0px 11px 4px rgb(200, 200, 200);
              width: 40%;
              margin: auto;
              padding: 7px;
            "
          >
            <div v-if="loading === true" class="lds-ring" style="height: 28px">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span style="font-size: 20px; color: black; margin-left: 20px"
              >On Average It takes about 1 minute to fetch 1000 NFTs</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "request-promise";
export default {
  data() {
    return {
      nftAddress: "",
      offset: 0,
      limit: 50,
      nftData: [],
      nftAssets: [],
      allNftData: [],
      allNftLength: "",
      allTraits: [],
      requiredData: [],
      requiredDataArray: [],
      requiredNftData: [],
      counter: 1,
      requiredTraitsData: [],
      NFTTokenID: "",
      alltokenID: [],
      loading: false,
    };
  },
  methods: {
    async checkNFT() {
      if (this.nftAddress === "") {
        this.$toasted.error("Input feild is empty!");
      } else if (this.nftAddress.length < 30) {
        this.$toasted.error("Invalid Address!");
      } else {
        this.loading = true;
        try {
          // for (let i = 0; i < 300; i++) {
          for (let i = 0; i < 60; i++) {
            this.counter++;
            const res = await request({
              url:
                "https://api.opensea.io/api/v1/assets?offset=" +
                this.offset +
                "&limit=" +
                this.limit +
                "&asset_contract_address=" +
                this.nftAddress,
              method: "GET",
              made: "no-cors",
              header: {
                // "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                // "accept-encoding": "gzip, deflate, br",
                // "accept-language": "en-US,en;q=0.9",
                "Access-Control-Allow-Origin": "http://localhost:8085/",
              },
            });
            console.log("***************************************************");

            this.nftData = JSON.parse(res);
            const heelo = this.nftData.assets;
            heelo.map((data) => {
              if (data.traits.length != 0) {
                const requiredDataNew = new Object();
                requiredDataNew.token_id = data.token_id;
                requiredDataNew.permalink = data.permalink;
                requiredDataNew.name = data.collection.name;
                requiredDataNew.traits = data.traits;
                this.requiredData.push(requiredDataNew);
                this.requiredDataArray = this.requiredData;
              }
            });
            if (this.nftData.assets.length != 50) {
              break;
            }

            this.offset += this.limit;
          }

          this.allNftLength = this.counter * 50 - 50;

          // console.log("required data array", this.requiredDataArray);
          this.requiredDataArray.forEach((data) => {
            data.traits.forEach((Sdata) => {
              var DataTraitCount =
                (Sdata.trait_count / this.allNftLength) * 100;
              if (DataTraitCount < 1) {
                if (this.requiredTraitsData.length == 0) {
                  console.log(
                    "Hey, now reqTraitsData array is empty and gonna insert first value"
                  );
                  this.requiredTraitsData.push({
                    name: data.name,
                    tokenId: data.token_id,
                    traits: [Sdata],
                    nftUrl: data.permalink,
                  });
                } else {
                  var checker = true;
                  this.requiredTraitsData.forEach((res, index) => {
                    if (res.tokenId === data.token_id) {
                      this.requiredTraitsData[index].traits.push(Sdata);
                      checker = false;
                    }
                  });
                  if (checker) {
                    this.requiredTraitsData.push({
                      name: data.name,
                      tokenId: data.token_id,
                      traits: [Sdata],
                      nftUrl: data.permalink,
                    });
                  }
                }
              } else {
                console.log("trait count is more than 1%");
              }
            });
          });

          console.log("Required Traits Data: ", this.requiredTraitsData);
          if (this.requiredTraitsData.length < 1) {
            this.$toasted.error("Soory, No Records Found!");
          }
          this.loading = false;
        } catch (e) {
          console.log(e.message);
          this.loading = false;
          this.$toasted.error(e.message);
        }
      }
    },
  },
  // percentage(percentage){
  //   console.log('perc', percentage);
  //   percentage / this.allNftLength * 100
  //   console.log(this.allNftLength);
  //   return percentage (percentage)
  // }
  // ,
  onCopy() {
    this.$toasted.success("URL Copied ");
  },
  onError() {
    this.$toasted.error("Failed to copy URL ");
  },
};
</script>

<style scoped>
.tableClass {
  border-radius: 10px;
  background-color: white;
  margin: 0 auto;
  box-shadow: 3px 0px 11px 4px rgb(230, 230, 230);
  padding-top: 8px;
}
table tr td {
  text-align: center;
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
  background-color: transparent;
  outline: none;
  cursor: pointer;
  margin-right: 100px;
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
tbody tr:nth-child(odd) {
  background-color: rgb(129, 129, 129);
  /* background-color: rgb(59, 38, 57); */
  color: white;
}
.lds-ring div {
  border: 4px solid rgb(0, 82, 255);
  border-color: rgb(0, 82, 255) transparent transparent transparent;
}
@media only screen and (max-width: 500px) {
  table,
  head,
  tbody,
  th,
  td,
  tr {
    display: block;
  }
  thead tr {
    display: none;
  }
  tr {
    border: 1px solid #ccc;
  }
  td {
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
    white-space: normal;
    text-align: left;
    min-height: 30px;
    overflow: hidden;
    word-break: break-all;
  }
  td:before {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    text-align: left;
    font-weight: bold;
  }
  td:before {
    content: attr(data-title);
  }
}
/* ************************************************************************************888 */
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