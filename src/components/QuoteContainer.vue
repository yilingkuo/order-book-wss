<template>
  <table class="table-auto border-spacing-0 border-collapse">
    <thead>
      <tr class="h-8 lg:pb-4 xl:pb-8 text-lg">
        <th class="text-left quote-container-pad">Price (USD)</th>
        <th class="text-right ">Size</th>
        <th class="text-right quote-container-pad">Total</th>
      </tr>
    </thead>
    <tbody>
      <!-- <div v-for=""></div> -->
      <Quote v-for="(item, index) in sellOrders" :key="index" :orderType="'sell'" class="quote-container-pad"/>
      <tr>
        <td colspan="3" class="text-xl quote-pad">1,354,545.2</td>
      </tr>
      <!-- <CurrentPrice  :orderType="'buy'"/> -->
      <Quote v-for="(item, index) in buyOrders" :key="index" :orderType="'buy'" class="quote-container-pad"/>

    </tbody>
  </table>
</template>

<script>
import Quote from './Quote.vue'
import CurrentPrice from './CurrentPrice.vue'
export default {
  components: {
    Quote,
    CurrentPrice
  },
  data () {
    return {
      buyOrders: [
        { value: 'b' },
        { value: 'b' },
        { value: 'b' },
        { value: 'b' },
        { value: 'b' },
        { value: 'b' },
        { value: 'b' },
        { value: 'b' }
      ],
      sellOrders: [
        { value: 's' },
        { value: 's' },
        { value: 's' },
        { value: 's' },
        { value: 's' },
        { value: 's' },
        { value: 's' },
        { value: 's' },
        { value: 's' }
      ]
    }
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