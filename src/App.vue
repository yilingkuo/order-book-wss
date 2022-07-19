<script>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import QuoteContainer from './components/QuoteContainer.vue'
import { mixinWebsocket } from './utils/wss'

export default {
  components: {
    QuoteContainer
  },
  mixins: [mixinWebsocket],
  data(){
    return{
      ws: null,
      
      lockReconnect: false,
      timeoutNum: null,
      orderBookTopic: {
        "op": "subscribe",
        "args": [
          "update:BTCPFC"
        ]
      },
      lastPriceTopic: {
        "op": "subscribe",
        "args": [
          "tradeHistoryApi:BTCPFC"
        ]
      }
    }
  },
  created () {
    this.initWebsocket() //開啓前後端的websocket通道
    setTimeout(() => {
      this.ws.close()
    }, "5000")
  },
  destroy(){
    this.websocketclose(); //關閉websocket通道
  },
  mounted() {
    // console.log(this.$store);
  }
}

</script>

<template>
  <div class="flex text-2xl text-left px-1rem pt-2 pb-4">Order Book
  </div>
  <QuoteContainer class="flex-1 pb-12" msg="Vite + Vue" />
</template>

<style scoped>

</style>
