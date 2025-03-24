<script setup>
import { onMounted, ref } from "vue";
import { ai_helper } from "../utils/ai_helper";

import { useDataStore } from "../DataStore";
import NaviMenu from "../components/menus/NaviMenu.vue";

const store = useDataStore();

const preview_question = ref(null);


function onClickPreview() {
    console.log("* onClickPreview");

    // check if items is loaded
    if (store.items.length == 0) {
        store.msg("No items loaded.", "error");
        return;
    }

    // check if taxonomy is loaded
    if (store.taxonomy_text.length == 0) {
        store.msg("No taxonomy loaded.", "error");
        return;
    }

    let question = ai_helper.generateQuestionFromTemplate(
        store.llm_prompt_template,
        store.items[0],
        store.taxonomy_text
    );

    console.log("* preview question", question);

    preview_question.value = question;
}

function onClickSavePrompt() {
    store.savePromptToFile();
}

onMounted(() => {
    console.log("* mounted Home.vue");
});
</script>


<template>

<NaviMenu />

<div class="menu">



<div class="menu-group">
    <div class="menu-group-box">

      <Button text
          class="menu-button"
          v-tooltip.bottom="'Save the current prompt'"
          @click="onClickSavePrompt">
          <font-awesome-icon :icon="['far', 'floppy-disk']" class="menu-icon" />
          <span>
              Save Prompt
          </span>
      </Button>

      <Button text
          class="menu-button"
          v-tooltip.bottom="'Preview the final prompt'"
          @click="onClickPreview">
          <font-awesome-icon :icon="['far', 'eye']" class="menu-icon" />
          <span>
              Preview final prompt
          </span>
      </Button>

    </div>
    <div class="menu-group-title">
        Prompt Editor
    </div>
</div>



<div class="menu-group">
    <div class="menu-group-box">


        <Button text
            class="menu-button"
            v-tooltip.bottom="'Show the detailed user manual in a new window.'"
            @click="store.showHelp()">
            <font-awesome-icon icon="fa-solid fa-book" class="menu-icon" />
            <span>
                How-to
            </span>
        </Button>
    </div>
    <div class="menu-group-title">
        Help
    </div>
</div>


</div>





<div class="main">

<Panel class="h-full w-1/2 mr-2">

<template #header>
  <div class="w-full flex justify-between">
    <div class="flex">
      <div class="flex-col">
        <div class="text-lg font-bold">
          <font-awesome-icon :icon="['fas', 'edit']" />
          Prompt Editor
        </div>
      </div>
    </div>
  </div>
</template>

<div class="w-full"
    :style="{ height: 'calc(100svh - 19rem)', overflowY: 'auto' }">

    <!-- A text area for the prompt -->
    <Textarea v-if="store.llm_prompt_template"
      v-model="store.llm_prompt_template"
      style="height: calc(100svh - 23rem);"
      class="w-full p-2" />

    <div v-else>
      No prompt loaded.
    </div>

</div>

</Panel>

<Panel class="h-full w-1/2">

    <template #header>
      <div class="w-full flex justify-between">
        <div class="flex">
          <div class="flex-col">
            <div class="text-lg font-bold">
              <font-awesome-icon :icon="['far', 'eye']" />
              Preview
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="w-full"
        v-if="store.llm_prompt_template"
        :style="{ height: 'calc(100svh - 19rem)', overflowY: 'auto' }">

        <!-- make this pre auto-wrap -->
        <pre v-if="preview_question" v-html="preview_question" style="white-space: pre-wrap;"></pre>
        <div v-else>
          No preview question.
        </div>
    </div>

</Panel>

</div>

</template>

<style scoped>
</style>
