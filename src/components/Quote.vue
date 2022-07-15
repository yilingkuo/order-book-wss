<template>
  <tr >
    <td :class="[textStyle]" class="text-left quote-pad">1234,111,11</td>
    <td class="text-right">4000</td>
    <td class="text-right quote-pad">1961</td>
  </tr>
</template>

<script>
export default {
  props: ['orderType'],
  computed: {
    textStyle () {
      console.log('text-' + this.orderType + '-price')
      switch (this.orderType) {
        case 'buy':
          return 'text-buy-price'
        case 'sell':
          return 'text-sell-price'
      
        default:
          return 'text-sell-price'
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.quote-pad {
  @apply px-1rem;
}
</style>