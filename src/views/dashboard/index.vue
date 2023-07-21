<template>
  <div>
    <Card />
    <Sale />
    <Observe />
  </div>
</template>

<script>
import Card from './card'
import Sale from './sale'
import Observe from './observe'

export default {
  name: 'Dashboard',
  components: { Card, Sale, Observe},
  created() {
    this.$store.dispatch('getData');
  },
}
</script>
<style scoped>

</style>