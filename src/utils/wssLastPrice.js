export const mixinWebsocketLastPrice = {
  data(){
    return{
      wsLastPrice: null,
      lockReconnectLastPrice: false,
      timeoutNumLastPrice: null,

      lastPriceTopic: {
        "op": "subscribe",
        "args": [
          "tradeHistoryApi:BTCPFC"
        ]
      }
    }
  },
  methods:{
    //初始websocket
    initWebsocketLastPrice () {
      let wsURL = 'wss://ws.btse.com/ws/futures'
      this.wsLastPrice = new WebSocket(wsURL); //建立連線
      this.wsLastPrice.onopen = this.websocketonopen2;
      this.wsLastPrice.error = this.websocketonerror2;
      this.wsLastPrice.onmessage = this.websocketonmessage2;
      this.wsLastPrice.onclose = this.websocketclose2;
    },
    websocketonopen2 () {
      console.log('ws2 連線成功~~');
      this.websocketsend(this.orderBookTopic)
      // this.websocketsend(this.lastPriceTopic)
    },
    websocketonerror2 (e) {
      console.error('ws 連線失敗', e);
    },
    websocketonmessage2 (e) {
      // 後端通知前端，前端取得資料
      let _data = e.data;
      // 利用vuex存到共用的state
      this.$store.dispatch('wssdata/receiveData', JSON.parse(_data))
    },
    websocketsend (data) {
      //前端丟topic資料
      console.log('send data', data);
      try {
        this.wsLastPrice.send(JSON.stringify(data));
      } catch (error) {
        this.wsLastPrice.close()
      }
    },
    websocketclose2 () {
      console.log('ws 關閉連線')
      // this.reconnect()
    },
    // basic reconnect
    reconnect () {
      const that = this
      if (that.lockReconnect) {
        return
      }
      that.lockReconnect = true
      // 避免請求過多
      clearTimeout(that.timeoutnum)
      that.timeoutNum = setTimeout((() => {
        that.initWebsocket()
        that.lockReconnect = false
      }), 5000)
    },
  }
}