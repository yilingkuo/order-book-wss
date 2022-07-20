export const mixinWebsocket = {
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
    methods: {
      //初始websocket
      initWebsocket () {
        let wsURL = 'wss://ws.btse.com/ws/oss/futures'
        this.ws = new WebSocket(wsURL); //建立連線
        this.ws.onopen = this.websocketonopen;
        this.ws.error = this.websocketonerror;
        this.ws.onmessage = this.websocketonmessage;
        this.ws.onclose = this.websocketclose;
      },
      websocketonopen () {
        console.log('ws 連線成功');
        this.websocketsend(this.orderBookTopic)
        // this.websocketsend(this.lastPriceTopic)
      },
      websocketonerror (e) {
        console.error('ws 連線失敗', e);
      },
      websocketonmessage (e) {
        // 後端通知前端，前端取得資料
        let _data = e.data;
        this.checkSign2Reconnect(JSON.parse(_data))
        this.$store.dispatch('wssdata/receiveData', JSON.parse(_data))
      },
      websocketsend (data) {
        //前端丟topic資料
        console.log('send data', data);
        try {
          this.ws.send(JSON.stringify(data));
        } catch (error) {
          this.ws.close()
        }
      },
      websocketclose () {
        console.log('ws 關閉連線')
        this.ws.close()
        // this.reconnect()
      },
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
        }), 10000)
      },
      checkSign2Reconnect (newOrderBook) {
        if ('type' in newOrderBook && 'prevSeqNum' in newOrderBook && 'seqNum' in this.$store.state.wssdata.orderBookUpdate) {
          if (newOrderBook.type === 'delta') {
            if (newOrderBook.prevSeqNum !== this.$store.state.wssdata.orderBookUpdate.seqNum) {
              this.reconnect()
            }
            this.$store.commit('wssdata/setOrderBookUpdate', newOrderBook)
          }
        }
      }
    }
}