<script setup>
import Item from './Item.vue'
import WKBIcon from './icons/IconWKB.vue'
import DevIcon from './icons/IconDev.vue'
import Producteisen from '/src/assets/producteisen.pdf'
</script>

<template>

  <Item>
    <template #icon>
      <WKBIcon />
    </template>
    <template #heading>Over de WKB</template>

    De Winterswijkse Kegelbond (WKB) is opgericht op 27 april 1981 (K.v.K 103042) · Aangesloten bij de Koninklijke Nederlandse Kegel Bond · Aangesloten bij NOC/NSF · Kegelbond gevestigd in Winterswijk.
  </Item>

  <Item>
    <template #icon>
      <DevIcon />
    </template>
    <template #heading>Over de site</template>

    Onder het motto 'het kan altijd beter' zijn er producteisen geformuleerd voor de website. Die kun je <a :href="Producteisen" target="_blank" rel="noopener">hier</a> vinden.
    Dit is versie 1.0.1.
  </Item>

</template>
