<template>
  <tr class="new-quote-animat " :class="highlightStatus" >
    <td :class="[textStyle]" class="text-left quote-pad">{{ priceFormat(price) }}</td>
    <td class="text-right">{{ thousandMask(size) }}</td>
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
      isHighlight: false
    }
  },
  props: ['orderType', 'price', 'size', 'total', 'denominator'],
  computed: {
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
        console.log(result)
        return result
      } else {
        return 10
      }
    },
    highlightStatus () {
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
    }

  },
  mounted () {
    this.$nextTick(() => {
      // test animation emit from container? or add status to state.sellorders
      this.triggerHighlight()
    })
  },
  watch: {},
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
    triggerHighlight () {
      setTimeout(() => {
        this.isHighlight = true
      }, "100")
      setTimeout(() => {
        this.isHighlight = false
      }, "1000")
    }
  }
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