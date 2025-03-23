<script setup>

import { useDataStore } from "../DataStore";

const store = useDataStore();
</script>

<template>
<div class="footer">
  <div>
    <i class="fa-regular fa-clipboard"></i>
    {{ store.taxonomy_file?.name }}:
    <b>{{ store.taxonomy.length }}</b> taxonomies
    |
    <i class="fa fa-database"></i>
    {{ store.dataset_file?.name }}:
    <b>{{ store.items.length }}</b> rows
    |
    <b>{{ store.n_results_by_human }}</b> by Human
    + 
    <b>{{ store.n_results_by_ai }}</b> by LLM
  </div>
  <div>
    <a href="https://github.com/BIDS-Xu-Lab/medtaxon"
      target="_blank">
      MedTaxon
      v{{ store.version }}
      |
      <i class="fa-brands fa-github"></i>
    </a>
  </div>
</div>
</template>

<style scoped>
</style>