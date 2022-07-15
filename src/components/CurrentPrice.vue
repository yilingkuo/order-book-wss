<template>
  <tr>
    <td colspan="3" :class="[textStyle]" class="quote-pad">1,354,545.2</td>
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