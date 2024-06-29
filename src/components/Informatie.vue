<script setup>
import Item from './Item.vue'
import WKBIcon from './icons/IconWKB.vue'
import DevIcon from './icons/IconDev.vue'
import Producteisen from '/src/assets/producteisen.pdf'
import packageJson from '../../package.json'

const version = packageJson.version

</script>

<template>

  <Item>
    <template #icon>
      <WKBIcon />
    </template>
    <template #heading>Over de WKB</template>
    <template #content>
      De Winterswijkse Kegelbond (WKB) is opgericht op 27 april 1981 (K.v.K 103042) · Aangesloten bij de Koninklijke Nederlandse Kegel Bond · Aangesloten bij NOC/NSF · Gevestigd in Winterswijk.
    </template>
</Item>

  <Item>
    <template #icon>
      <DevIcon />
    </template>
    <template #heading>Over de site</template>
    <template #content>
      Onder het motto 'het kan altijd beter' zijn er producteisen geformuleerd voor de website. Die kun je <a id="producteisen" :href="Producteisen" target="_blank" rel="noopener">hier</a> vinden.
      Dit is versie {{ version }}.
    </template>
  </Item>

</template>
