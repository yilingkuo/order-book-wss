const state = () => ({
  orderBookUpdate: [],
  buyOrders: [],  //bids
  sellOrders: [], //asks
  lastPrice: null,
  buyHighlighIndex: null,
  sellHighlighIndex: null
})
const mutations = {
  setOrderBookUpdate (state, wssResponseData) {
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
  },
  updateOrdersByIndex (state, { updateArr, updateIndex, orderType }) {
    if (updateIndex !== -1) {
      if (orderType === 'asks') {
        state.sellOrders[updateIndex] = updateArr
      } else {
        state.buyOrders[updateIndex] = updateArr
      }
    }
    // state.sellOrders = state.sellOrders.splice(updateIndex, 0, updateArr).slice(0, 8)
  },
  updateOrdersLast (state, { updateArr, orderType }) {
    if (orderType === 'asks') {
      state.sellOrders.push(updateArr)
      state.sellOrders.sort((a,b) => b[0] - a[0]).slice(0, 8)
    } else {
      state.buyOrders.push(updateArr)
      state.buyOrders.sort((a,b) => b[0] - a[0]).slice(0, 8)
    }
  }
}
const actions = {
  // 接收更新資料
  receiveData (context, resdata) {
    if ('topic' in resdata && 'data' in resdata) {
      if (resdata.topic === 'tradeHistoryApi:BTCPFC' && length(resdata.data) > 0) {
        context.commit('setLastPrice', resdata.data[0])
      } else if (resdata.topic === 'update:BTCPFC') {
        context.dispatch('checkSnapshotInit', resdata.data)
      }
    }
  },
  // check if order book is snapshot
  checkSnapshotInit (context, data) {
    if ('type' in data) {
      if (data.type === 'snapshot') {
        context.dispatch('initQuotesDisplay', { data: data, orderType: 'bids' })
        context.dispatch('initQuotesDisplay', { data: data, orderType: 'asks' })

        // save as orderBookUpdate for later compare
      } else if (data.type === 'delta') {
        // updateQuoteDisplay
        console.log('update delta', data)
        context.dispatch('updateQuoteDisplay', { data: data, orderType: 'bids' })
        context.dispatch('updateQuoteDisplay', { data: data, orderType: 'asks' })
      }
    }
  },
  // update first 8 sell(ask) buy(bid)
  initQuotesDisplay (context, { data, orderType }) {
    if (orderType in data) {
      // snapshot is sorted already, first map to deep copy arr
      const copyNestArrNoRef = data[orderType].map(arr => (arr.slice(0,2))).slice(0, 8)
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
  calculateSizeTotal (context, orderType) {
    // update size --> recalculate size
    let totalSize = []
    if (orderType === 'asks') {
      const copySellOrders = context.state.sellOrders.map(arr => (arr.slice(0,2))).slice(0, 8)
      totalSize = copySellOrders.map((x, n) => copySellOrders.map(x => parseInt(x[1])).slice((-n-1)).reduce((acc, val) => acc + val)).reverse()
      copySellOrders.map((x, n) => x.push(totalSize[n]))
      context.commit('setSellOrders', copySellOrders)
    } else {
      const copyBuyOrders = context.state.buyOrders.map(arr => (arr.slice(0,2))).slice(0, 8)
      totalSize = copyBuyOrders.map((x, n) => copyBuyOrders.map(x => parseInt(x[1])).slice(0, n+1).reduce((acc, val) => acc + val))
      copyBuyOrders.map((x, n) => x.push(totalSize[n]))
      context.commit('setBuyOrders', copyBuyOrders)
    }
  },

  // compare and update new quotes
  updateQuoteDisplay (context, { data, orderType }) {
    // change size cell: if item = any element
    // highlight: if item > min(orders)
    const updatePrice = data[orderType].map(x => parseFloat(x[0]))
    const updateSize = data[orderType].map(x => parseFloat(x[1]))
    if (orderType === 'asks') {
      // map array for dev data checking
      let orderprice = context.state.sellOrders.map(x => parseFloat(x[0]))
      console.log('order price arr: ', orderprice)
      let ordersize = context.state.sellOrders.map(x => parseFloat(x[1]))
      context.dispatch('updateLogic', {
        orderType: orderType, updatePrice: updatePrice, updateSize: updateSize, orderprice: updateSize, ordersize: ordersize
      })
      // if (updatePrice.length > 0) {
      //   let minOrderprice = Math.min( ...orderprice )
      //   updatePrice.forEach((newprice, index) => {
      //     for (let i = 0; i < orderprice.length; i++) {
      //       if (newprice > minOrderprice) {
      //         console.log('highlight', newprice, orderprice[i], minOrderprice)
      //         if (newprice === orderprice[i]) {
      //           // update size by index, recalculate total
      //           console.log('highlight replace element & update size', data[orderType][index])
      //           if (updateSize[index] > 0) {
      //             let updateArr = [newprice, ordersize[i] + updateSize[index]]
      //             context.commit('updateOrdersByIndex', {
      //               // updateArr: data[orderType][index],
      //               updateArr: updateArr,
      //               updateIndex: i,
      //               orderType: 'asks'
      //             })
      //             context.dispatch('calculateSizeTotal', 'asks')
      //           }
      //           // context.dispatch('calculateSizeTotal', 'asks')
      //         } else {
      //           // update array
      //           // orderprice.push(newprice)
      //           // orderprice.sort((a,b) => b - a).slice(0, 8)
      //           // console.log('highlight update array', test, orderprice.sort((a,b) => b - a).slice(0, 8))
      //           if (updateSize[index] > 0) {
      //             let updateArr = [newprice, ordersize[i] + updateSize[index]]
      //             context.commit('updateOrdersLast', {
      //               // updateArr: data[orderType][index],
      //               updateArr: updateArr,
      //               orderType: 'asks'
      //             })
      //             context.dispatch('calculateSizeTotal', 'asks')
      //           }
      //         }

      //         break
      //       }
      //     }
      //   })
      // }
    } else {
      let orderprice = context.state.buyOrders.map(x => parseFloat(x[0]))
      console.log('order price arr: ', orderprice)
      let ordersize = context.state.buyOrders.map(x => parseFloat(x[1]))
      context.dispatch('updateLogic', {
        orderType: orderType, updatePrice: updatePrice, updateSize: updateSize, orderprice: updateSize, ordersize: ordersize
      })
    }
  },
  updateLogic (context, { orderType, updatePrice, updateSize, orderprice, ordersize }) {
    if (updatePrice.length > 0) {
      let minOrderprice = Math.min( ...orderprice )
      updatePrice.forEach((newprice, index) => {
        for (let i = 0; i < orderprice.length; i++) {
          if (newprice > minOrderprice) {
            console.log('highlight', newprice, orderprice[i], minOrderprice)
            if (newprice === orderprice[i]) {
              // update size by index, recalculate total
              console.log('highlight replace element & update size', data[orderType][index])
              if (updateSize[index] > 0) {
                let updateArr = [newprice, ordersize[i] + updateSize[index]]
                context.commit('updateOrdersByIndex', {
                  // updateArr: data[orderType][index],
                  updateArr: updateArr,
                  updateIndex: i,
                  orderType: orderType
                })
                context.dispatch('calculateSizeTotal', orderType)
              }
              // context.dispatch('calculateSizeTotal', orderType)
            } else {
              // update array
              // orderprice.push(newprice)
              // orderprice.sort((a,b) => b - a).slice(0, 8)
              // console.log('highlight update array', test, orderprice.sort((a,b) => b - a).slice(0, 8))
              if (updateSize[index] > 0) {
                let updateArr = [newprice, ordersize[i] + updateSize[index]]
                context.commit('updateOrdersLast', {
                  // updateArr: data[orderType][index],
                  updateArr: updateArr,
                  orderType: orderType
                })
                context.dispatch('calculateSizeTotal', orderType)
              }
            }

            break
          }
        }
      })
    }
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