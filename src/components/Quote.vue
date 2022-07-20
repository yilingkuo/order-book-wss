<template>
  <tr class="new-quote-animat " :class="highlightStyle" >
    <td :class="[textStyle]" class="text-left quote-pad">{{ priceFormat(price) }}</td>
    <td class="text-right new-quote-animat " :class="highlightStyle">{{ thousandMask(size) }}</td>
    <td class="w-1/2 text-right relative quote-pad">
      <div class="total-percentage" :class="[percentageBg]" :style="`width: ${totalPercentage}%`"></div>
      {{ thousandMask(total) }}
    </td>
  </tr>
</template>

<script>
export default {
  data () {
    return {
      isHighlight: false,
      isQuoteSizeChange: false
    }
  },
  props: ['orderType', 'price', 'size', 'total', 'denominator', 'nodeIndex'],
  computed: {
    sellHighlighIndex: {
      get: function () {
        return this.$store.state.wssdata.sellHighlighIndex
      }
    },
    buyHighlighIndex: {
      get: function () {
        return this.$store.state.wssdata.buyHighlighIndex
      }
    },
    sellQuoteSizeChangeIndex: {
      get: function () {
        return this.$store.state.wssdata.sellQuoteSizeChangeIndex
      }
    },
    buyQuoteSizeChangeIndex: {
      get: function () {
        return this.$store.state.wssdata.buyQuoteSizeChangeIndex
      }
    },
    textStyle () {
      switch (this.orderType) {
        case 'buy':
          return 'text-buy-price'
        case 'sell':
          return 'text-sell-price'
      
        default:
          return 'text-sell-price'
      }
    },
    percentageBg () {
      switch (this.orderType) {
        case 'buy':
          return 'bg-buy-totalpercent'
        case 'sell':
          return 'bg-sell-totalpercent'
      
        default:
          return 'bg-sell-totalpercent'
      }
    },
    totalPercentage () {
      if (this.denominator) {
        const result = parseFloat(this.total * 100/this.denominator).toFixed(0)
        return result
      } else {
        return 10
      }
    },
    highlightStyle () {
      if (this.isHighlight) {
        switch (this.orderType) {
          case 'buy':
            return 'bg-buy-highlight'
          case 'sell':
            return 'bg-sell-highlight'

          default:
            return 'bg-sell-highlight'
        }
      } else {
        return ''
      }
    },
    quoteSizeChangeStyle () {
      if (this.isQuoteSizeChange) {
        // check size change direction
        switch (this.orderType) {
          case 'buy':
            return 'bg-buy-highlight'
          case 'sell':
            return 'bg-sell-highlight'

          default:
            return 'bg-sell-highlight'
        }
      } else {
        return ''
      }
    },

  },
  watch: {
    sellHighlighIndex: {
      handler(newIndex) {
        console.log('sellHighlighIndex', newIndex, this.nodeIndex)
        if (this.nodeIndex === newIndex) {
          console.log('start highlight?')
          this.startHighlight()
        }
      },
      // force eager callback execution
      // immediate: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      // test animation emit from container? or add status to state.sellorders
      // this.startHighlight()
      // dynamic watch
      if (this.orderType === 'sell') {
        console.log('trigger watch?', this.$watch)
        this.$watch('sellHighlighIndex', (newIndex) => {
          console.log('sellHighlighIndex', newIndex, this.nodeIndex)
          if (this.nodeIndex === newIndex) {
            console.log('start highlight?')
            this.startHighlight()
          }
        })
        this.$watch('sellQuoteSizeChangeIndex', (newIndex) => {
          if (this.nodeIndex === newIndex) {
            this.startQuoteSizeChange()
          }
        })
      } else {
        this.$watch('buyHighlighIndex', (newIndex) => {
          if (this.nodeIndex === newIndex) {
            this.startHighlight()
          }
        })
        this.$watch('buyQuoteSizeChangeIndex', (newIndex) => {
          if (this.nodeIndex === newIndex) {
            this.startQuoteSizeChange()
          }
        })
      }

    })
  },
  created () {
    this.triggerWatch(this.orderType)
  },
  methods: {
    thousandMask (v) {
      if (typeof v === 'string') {
        return parseFloat(v).toLocaleString('en')
      } else if (typeof v === 'number') {
        return v.toLocaleString('en')
      } else {
        return v
      }
    },
    priceFormat (v) {
      return parseFloat(v).toFixed(1).toLocaleString('en')
    },
    startHighlight () {
      this.isHighlight = true
      setTimeout(() => {
        this.isHighlight = false
      }, "100")
    },
    startQuoteSizeChange () {
      setTimeout(() => {
        this.isQuoteSizeChange = true
      }, "100")
      setTimeout(() => {
        this.isQuoteSizeChange = false
      }, "1000")
    },
    triggerWatch (orderType) {
      if (orderType === 'sell') {
        this.$watch('sellHighlighIndex', (newIndex) => {
          if (this.nodeIndex === newIndex) {
            this.startHighlight()
          }
        })
        this.$watch('sellQuoteSizeChangeIndex', (newIndex) => {
          if (this.nodeIndex === newIndex) {
            this.startQuoteSizeChange()
          }
        })
      } else {
        this.$watch('buyHighlighIndex', (newIndex) => {
          if (this.nodeIndex === newIndex) {
            this.startHighlight()
          }
        })
        this.$watch('buyQuoteSizeChangeIndex', (newIndex) => {
          if (this.nodeIndex === newIndex) {
            this.startQuoteSizeChange()
          }
        })
      }
    }
  },
}
</script>

<style lang="postcss" scoped>
.quote-pad {
  @apply px-1rem ;
}
.total-percentage {
  @apply -z-1 absolute top-0 right-0 bottom-0 bg-totalpercent;
}
</style>