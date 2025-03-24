<script setup>
import { onMounted, ref } from "vue";
import * as toolbox from "../utils/toolbox";

import { useDataStore } from "../DataStore";
import NaviMenu from "../components/menus/NaviMenu.vue";

const store = useDataStore();

onMounted(() => {
    console.log("* mounted Home.vue");
});

function onClickExport(format) {
    console.log("* onClickExport", format);
}

////////////////////////////////////////
// Tree expansion/collapse functions
////////////////////////////////////////
const metaKey = ref(true);
const expandedKeys = ref({});
const selectedKey = ref();
const expandNode = (node) => {
    if (node.children && node.children.length) {
        expandedKeys.value[node.number] = true;

        for (let child of node.children) {
            expandNode(child);
        }
    }
};

const expandAll = () => {
    for (let node of store.taxonomy_tree.children) {
        expandNode(node);
    }

    expandedKeys.value = { ...expandedKeys.value };
};
expandAll();

function onSelectVariable(node) {
    // console.log(event);
    if (store.isLeaf(node)) {
        store.current_taxonomy_node = node;
    }
}

const collapseAll = () => {
    expandedKeys.value = {};
};

////////////////////////////////////////
// Menu functions
////////////////////////////////////////
function onClickSaveTaxonomy() {
    console.log("* onClickSaveTaxonomy");
    store.saveTaxonomyToFile();
}

</script>

<template>

<NaviMenu />

<div class="menu">



<div class="menu-group">
    <div class="menu-group-box">
  
      <Button text
          class="menu-button"
          v-tooltip.bottom="'Save the current taxonomy'"
          @click="onClickSaveTaxonomy">
          <font-awesome-icon :icon="['far', 'floppy-disk']" class="menu-icon" />
          <span>
              Save Taxonomy
          </span>
      </Button>

    </div>
    <div class="menu-group-title">
        File Operations
    </div>
</div>



<div class="menu-group">
    <div class="menu-group-box">
  
      <Button text
          class="menu-button"
          v-tooltip.bottom="'Save the current taxonomy into a tsv file'"
          @click="onClickExport('tsv')">
          <font-awesome-icon :icon="['far', 'file-excel']" class="menu-icon" />
          <span>
              .tsv file
          </span>
      </Button>
  
      <Button text
          class="menu-button"
          v-tooltip.bottom="'Save the current taxonomy into a json file'"
          @click="onClickExport('json')">
          <font-awesome-icon :icon="['far', 'file-code']" class="menu-icon" />
          <span>
              .json file
          </span>
      </Button>

    </div>
    <div class="menu-group-title">
        Export
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
                  <font-awesome-icon :icon="['fas', 'folder-tree']" />
                  Taxonomy Tree
              </div>
              <div class="panel-subtitle text-sm">
                  <b>
                      {{ store.n_variables }}
                  </b>
                  variables are loaded.
              </div>
          </div>
      </div>

      <div class="flex items-start gap-2">
          <Button type="button" 
              severity="secondary"
              size="small" icon="pi pi-plus" label="Expand All" @click="expandAll" />
          <Button type="button" 
              severity="secondary"
              size="small" icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
      </div>
  </div>
</template>


<div class="w-full"
    :style="{ height: 'calc(100svh - 19rem)', overflowY: 'auto' }">
    <div v-if="store.taxonomy_tree.children.length === 0">
        No taxonomy loaded.
    </div>
    <div v-else>
        <TreeTable size="small"
            :value="store.taxonomy_tree.children" 
            v-model:selectionKeys="selectedKey"
            v-model:expandedKeys="expandedKeys" 
            :metaKeySelection="metaKey"
            dataKey="number"
            @node-select="onSelectVariable"
            selectionMode="single"
            tableStyle="min-width: 20rem">
            <Column header="Name" expander>
                <template #body="slotProps">
                    <div>{{ slotProps.node.name }}</div>

                    <template v-if="!store.isLeaf(slotProps.node)">
                        <Button text
                            v-tooltip.right="'Add a new variable.'"
                            severity="secondary"
                            rounded>
                            <font-awesome-icon :icon="['fas', 'plus']" />
                        </Button>
                    </template>
                </template>
            </Column>

            <Column header="Description">
                <template #body="slotProps">
                    <div v-if="slotProps.node.description">
                        <font-awesome-icon :icon="['far', 'message']" />
                        {{ toolbox.cut(slotProps.node.description) }}
                    </div>
                </template>
            </Column>

            <Column>
                <template #body="slotProps">
                    <div class="w-full flex justify-end">

                        <Button type="button" 
                            v-tooltip.right="'Delete whole group.'"
                            severity="danger"
                            rounded>
                            <font-awesome-icon :icon="['fas', 'trash-alt']" />
                        </Button>
                    </div>

                </template>
            </Column>
        </TreeTable>
    </div>
</div>



</Panel>







<Panel class="h-full w-1/2">

<template #header>
    <div class="w-full flex justify-between">
        <div class="flex">
            <div class="flex-col">
                <div class="text-lg font-bold">
                    <font-awesome-icon :icon="['fas', 'edit']" />
                    Taxonomy Detail
                </div>

                <div v-if="store.current_taxonomy_node">
                  <div class="text-sm">
                    {{ store.current_taxonomy_node.name }}
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<div class="w-full"
    :style="{ height: 'calc(100svh - 19rem)', overflowY: 'auto' }">

    <div v-if="store.current_taxonomy_node">
      <div class="flex flex-col gap-2">
          <label for="name">Name</label>
          <InputText id="name" 
            v-model="store.current_taxonomy_node.name" 
            aria-describedby="name-help" />
          <Message size="small" severity="secondary" variant="simple">
            Enter the name of the taxonomy.
          </Message>
      </div>
      
      <div class="flex flex-col gap-2">
        <label for="description">Description</label>
        <Textarea id="description" 
          v-model="store.current_taxonomy_node.description" 
          aria-describedby="description-help" />
          
      </div>


    </div>
    <div v-else>
        No taxonomy selected.
    </div>

</div>

</Panel>



</div>

</template>

<style scoped>
</style>
