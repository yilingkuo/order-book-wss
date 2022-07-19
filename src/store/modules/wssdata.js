const state = () => ({
  orderBookUpdate: [],
  buyOrders: [],  //bids
  sellOrders: [], //asks
  lastPrice: null,
})
const mutations = {
  setOrderBookUpdate (state, wssResponseData) {
    console.log(wssResponseData)
    state.orderBookUpdate = wssResponseData
  },
  setSellOrders (state, wssResponseData) {
    state.sellOrders = wssResponseData
  },
  setBuyOrders (state, wssResponseData) {
    state.buyOrders = wssResponseData
  },
  setLastPrice (state, wssResponseData) {
    state.lastPrice = wssResponseData
  }
}
const actions = {
  // 接收更新資料
  receiveData (context, resdata) {
    if ('topic' in resdata && 'data' in resdata) {
      console.log('resdata', resdata)
      if (resdata.topic === 'tradeHistoryApi:BTCPFC' && length(resdata.data) > 0) {
        // this.setLastPrice(resdata.data[0])
        context.commit('setLastPrice', resdata.data[0])
      } else if (resdata.topic === 'update:BTCPFC') {
        // context.commit('setOrderBookUpdate', resdata.data)
        context.dispatch('checkSnapshotInit', resdata.data)
      }
    }
  },
  // check if order book is snapshot
  checkSnapshotInit (context, data) {
    if ('type' in data) {
      if (data.type === 'snapshot') {
        // update init display
        context.dispatch('initQuotesDisplay', { data: data, orderType: 'bids' })
        context.dispatch('initQuotesDisplay', { data: data, orderType: 'asks' })

        // save as orderBookUpdate for later compare
      } else if (data.type === 'delta') {
        // updateQuoteDisplay
      }
    }
  },
  // update first 8 sell(ask) buy(bid)
  initQuotesDisplay (context, { data, orderType }) {
    if (orderType in data) {
      // snapshot is sorted already, first map to deep copy arr
      const copyNestArrNoRef = data[orderType].map(arr => (arr.slice())).slice(0, 8)
      let totalSize = []
      if (orderType === 'asks') {
        // sum from reverse direction
        totalSize = copyNestArrNoRef.map((x, n) => copyNestArrNoRef.map(x => parseInt(x[1])).slice((-n-1)).reduce((acc, val) => acc + val)).reverse()
        copyNestArrNoRef.map((x, n) => x.push(totalSize[n]))
        context.commit('setSellOrders', copyNestArrNoRef)
      } else {
        totalSize = copyNestArrNoRef.map((x, n) => copyNestArrNoRef.map(x => parseInt(x[1])).slice(0, n+1).reduce((acc, val) => acc + val))
        copyNestArrNoRef.map((x, n) => x.push(totalSize[n]))
        context.commit('setBuyOrders', copyNestArrNoRef)
      }
    }
  },
  // compare and update new quotes
  updateQuoteDisplay (context) {
    // if item > 
  }
}

// sum from end


export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}