<template>
  <table class="table-auto border-spacing-x-0 border-spacing-y-1 border-separate">
    <thead>
      <tr class="h-8 lg:pb-4 xl:pb-8 text-lg">
        <th class="text-left quote-container-pad">Price (USD)</th>
        <th class="text-right ">Size</th>
        <th class="text-right quote-container-pad">Total</th>
      </tr>
    </thead>
    <tbody>
      <!-- <div v-for=""></div> -->
      <Quote 
        v-for="(item, index) in sellOrders"
        :key="index"
        :nodeIndex="index"
        :orderType="'sell'"
        :price="item[0]"
        :size="item[1]"
        :total="item[2]"
        :denominator="sellOrdersDenominator"
        class="quote-container-pad"
      />
      <tr>
        <td colspan="3" class="text-xl quote-pad">1,354,545.2</td>
      </tr>
      <!-- <CurrentPrice  :orderType="'buy'"/> -->
      <Quote
        v-for="(item, index) in buyOrders"
        :key="index"
        :nodeIndex="index"
        :orderType="'buy'"
        :price="item[0]"
        :size="item[1]"
        :total="item[2]"
        :denominator="buyOrdersDenominator"
        class="quote-container-pad"
      />

    </tbody>
  </table>
</template>

<script>
import Quote from './Quote.vue'
import CurrentPrice from './CurrentPrice.vue'
import { nextTick } from '@vue/runtime-core'
export default {
  components: {
    Quote,
    CurrentPrice
  },
  computed: {
    sellOrders: {
      get: function () {
        return this.$store.state.wssdata.sellOrders
      }
    },
    buyOrders: {
      get: function () {
        return this.$store.state.wssdata.buyOrders
      }
    },
    sellOrdersDenominator: function () {
      if (this.sellOrders.length > 0) {
        console.log(this.sellOrders[0][2])
        return this.sellOrders[0][2]
      } else {
        return null
      }
    },
    buyOrdersDenominator: function () {
      if (this.buyOrders.length > 0) {
        console.log(this.buyOrders[this.buyOrders.length-1][2])
        return this.buyOrders[this.buyOrders.length-1][2]
      } else {
        return null
      }
    },
  },
  data () {
    return {

    }
  },
  watch: {
    buyHighlighIndex(newArray, oldArray) {
      // do stuff
    },
    sellHighlighIndex(newArray, oldArray) {
      // do stuff
    },
  },
  mounted () {
    this.$nextTick(() => {
      // inner loading
    })
  }
}
</script>

<style lang="postcss">
.current-price {
  @apply min-h-10
}
.quote-container-pad {
  @apply px-1rem;
}
</style>