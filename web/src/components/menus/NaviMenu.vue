<script setup>
import { useDataStore } from "../../DataStore";
const store = useDataStore();

function onClickSetting() {
    store.flag.show_setting_panel = !store.flag.show_setting_panel;
}

</script>


<template>
<div id="navi">
<div class="navi-left prevent-select">
    
    <div class="navi-item home" @click="store.gotoPage('')">
        <font-awesome-icon :icon="['fa', 'home']" />
        Home
    </div>

    <div class="navi-item" 
        v-tooltip.bottom="'Review the dataset'" 
        @click="store.gotoPage('')"
        :class="{ 'active-page': store.current_page == '' }">
        <font-awesome-icon :icon="['far', 'rectangle-list']" />
        Document
        Reviewer
    </div>

    <div class="navi-item" 
        v-tooltip.bottom="'Edit the taxonomy'" 
        @click="store.gotoPage('taxonomy_editor')"
        :class="{ 'active-page': store.current_page == 'taxonomy_editor' }">
        <font-awesome-icon :icon="['fas', 'folder-tree']" />
        Taxonomy
        Editor
    </div>

    <div class="navi-item" 
        v-tooltip.bottom="'Edit the prompt template'" 
        @click="store.gotoPage('prompt_editor')"
        :class="{ 'active-page': store.current_page == 'prompt_editor' }">
        <font-awesome-icon :icon="['fas', 'edit']" />
        Prompt
        Template
        Editor
    </div>

    <div class="navi-item" 
        v-tooltip.bottom="'Visualize the given datasets'" 
        @click="store.gotoPage('vis')"
        :class="{ 'active-page': store.current_page == 'vis' }">
        <font-awesome-icon :icon="['far', 'chart-bar']" />
        Visualization
    </div>

</div>


<div class="navi-right">
    <div class="navi-item !mx-0" v-tooltip.bottom="'Change system settings'" @click="onClickSetting">
        <font-awesome-icon :icon="['fas', 'cog']" class="mr-1" />
        <span>
            Settings
        </span>
    </div>
</div>
</div>

</template>

<style scoped>
.home {
    
}
</style>