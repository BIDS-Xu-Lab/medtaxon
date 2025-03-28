<script setup>
import { ref } from "vue";
import { useDataStore } from "../DataStore";
import { ai_helper } from "../utils/ai_helper";

const store = useDataStore();
const status = ref({});
const visible_prompt_full_text = ref(false);

function onClickAcceptHuman() {
    store.setWorkingItemDecision(
        'human',
        store.working_item.result_human
    );
    store.msg(`Updated human decision [${store.working_item.decision}] to Document ${store.working_item.pmid}`, 'success');
}


const isReviewing = (model_id) => {
    if (status.value.hasOwnProperty(model_id)) {
        return status.value[model_id] == 'reviewing';
    }

    return false;
}

async function onClickAccept(model_id, result) {
    store.setWorkingItemDecision(
        model_id,
        result
    );
    store.msg(`Updated [${model_id}] decision [${store.working_item.decision}] to Document ${store.working_item.pmid}`, 'success');
}

async function onClickReview(model_id) {
    // set flag
    status.value[model_id] = 'reviewing';

    // first generate the prompot
    let question = ai_helper.generateQuestionFromTemplate(
        store.llm_prompt_template,
        store.working_item,
        store.taxonomy_text
    );

    // then try to ask question
    try {
        
        let d = await ai_helper.ask(
            question,
            store.config.ai_models[model_id]
        );

        console.log(`* AI Helper [${model_id}]`, d);

        // update working item
        store.setWorkingItemResult(model_id, d);
    } catch (err) {
        // 
    }

    status.value[model_id] = 'reviewed';
}

async function onClickReviewAll() {
    for (let model_id in store.config.ai_models) {
        let model = store.config.ai_models[model_id];
        onClickReview(model.id);
    }
}

function isAllReviewed() {
    for (let model_id in store.config.ai_models) {
        let model = store.config.ai_models[model_id];
        if (isReviewing(model.id)) {
            return false;
        }
    }

    return true;
}

function onClickCopyPrompt() {
    navigator.clipboard.writeText(
        ai_helper.generateQuestionFromTemplate(
            store.llm_prompt_template,
            store.working_item,
            store.taxonomy_text
        )
    );

    // show message
    store.msg('Prompt copied to clipboard', 'success');
}

</script>

<template>

<Panel class="h-full w-2/5">
<template #header>
    <div class="w-full flex justify-between">
        <div class="flex items-center gap-2">
            <div class="flex-col">
                <div class="text-lg font-bold">
                    <i class="fa-solid fa-gavel"></i> 
                    Decision
                </div>
                <div class="panel-subtitle text-sm">
                    <template v-if="store.working_item">
                        <i class="far fa-file"></i>
                        {{ store.working_item?.pmid }}
                    </template>
                    <template v-else>
                        No Document selected
                    </template>
                </div>
            </div>

            <div>
                <Button label="Review All"
                    @click="onClickReviewAll"
                    v-tooltip.right="'Review automatically by all AI models'"
                    :disabled="!store.working_item || !isAllReviewed()"
                    class="mr-2"
                    size="normal"
                    icon="pi pi-bolt"
                    severity="secondary" />
            </div>

        </div>
        <div>

        </div>
    </div>
</template>

<div class="flex flex-col"
    style="height: calc(100svh - 18.5rem); overflow-y: auto;">

    <div v-if="store.has_working_item_decision"
        class="dp-info">
        <div class="final final-yes">
            {{ store.working_item.decision }}
        </div>
        <div class="final-info">
            by {{ store.working_item.decision_by }} 
            @ {{ store.working_item.decision_datetime }}
        </div>
    </div>
    <div v-else-if="store.working_item"
        class="dp-info">
        <div class="final final-not">
            Not Decided Yet
        </div>
        <div class="final-info">
            Please make a decision
        </div>
    </div>
    <div v-else
        class="dp-info mb-4">
        <div class="final">
            Please select an item or upload a dataset
        </div>
    </div>

    <Fieldset>
        <template #legend>
            <div class="flex items-center gap-2">
                <i class="fa-solid fa-user-doctor"></i>
                    Human Reviewer
            </div>
        </template>
        <template #dropdownicon>
            <i class="pi pi-map" />
        </template>
        <div v-if="store.working_item"
            class="flex justify-between">
            <div class="mr-1">
                <!-- <Select v-model="store.working_item.result_human"
                    :options="store.taxonomy"
                    :scrollHeight="'20rem'"
                    filter
                    optionLabel="value"
                    optionValue="value"
                    class="min-w-42 max-w-96">
                    <template #option="slotProps">
                        <span v-html="slotProps.option.html"></span>
                    </template>
                </Select> -->
                <select v-model="store.working_item.result_human"
                    class="py-2 px-1 w-96 border rounded-md">
                    <option v-for="item in store.taxonomy"
                        v-html="item.html"
                        :value="item.value">
                    </option>
                </select>
            </div>
            <Button label="Accept"
                icon="pi pi-check" 
                v-tooltip.bottom="'Accept human decision'"
                @click="onClickAcceptHuman"
                severity="success">
            </Button>
        </div>
    </Fieldset>

    <Fieldset v-for="model, model_id in store.config.ai_models"
        class="p-2 mb-2">

    <template #legend>
        <div class="flex items-center gap-2">
            <i class="fa-solid fa-cube"></i>
            {{ model.name }} Reviewer
        </div>
    </template>

    <div v-if="store.working_item"
        class="flex flex-col gap-4">
        <div v-if="store.working_item['result_' + model.id]"
            class="model-output-detail">
            <div class="category">
                {{ store.working_item['result_' + model.id] }}
            </div>
            <div class="raw">
                {{ store.working_item['result_reason_' + model.id] }}
            </div>
            <div class="text-sm italic text-right">
                <span v-tooltip="'Prompt used for this model'"
                    @click="visible_prompt_full_text = true"
                    class="cursor-pointer">
                    <font-awesome-icon :icon="['far', 'circle-question']" />
                    Prompt
                </span>
            </div>
        </div>

        <div class="flex items-center justify-between">
            <template v-if="isReviewing(model.id)">
                <div class="mr-2">
                    Reviewing
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </div>
            </template>
            <template v-else>
                <Button label="Review" 
                    @click="onClickReview(model.id)"
                    class="mr-2"
                    severity="secondary">
                    <template #icon>
                        <i class="fa-solid fa-bolt"></i>
                    </template>
                </Button>
            </template>
            
            <template v-if="store.working_item['result_' + model.id]">

            <Button label="Accept" 
                icon="pi pi-check"
                v-tooltip.bottom="'Accept '+model.id+' decision'"
                @click="onClickAccept(model.id, store.working_item['result_' + model.id])"
                severity="success" />
            </template>
        </div>
    </div>
        
    </Fieldset>

</div>

</Panel>

<Drawer v-model:visible="visible_prompt_full_text"
    style="width: 50rem;"
    position="right">
<template #header>
    <div class="flex justify-between items-center gap-2">
        <div class="text-xl font-bold">
            Full-text of Prompt
        </div>
        <div>
            <Button severity="secondary"
                v-tooltip.bottom="'Copy the full-text of prompt'"
                @click="onClickCopyPrompt">
                <font-awesome-icon :icon="['far', 'copy']" />
                Copy
            </Button>
        </div>
    </div>
</template>

<pre class="p-4 prompt-full-text">{{ 
    ai_helper.generateQuestionFromTemplate(
        store.llm_prompt_template,
        store.working_item,
        store.taxonomy_text
    ) 
    }}</pre>
</Drawer>

</template>

<style scoped>
.decision-panel {
    width: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.dp-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.final {
    font-weight: bold;
    font-size: 1.5rem;
    text-align: center;
    line-height: 1.8rem;
    width: 80%;
}
.final-yes {
    color: green;
}
.final-not {
    color: orange;
}
.final-info {
    font-style: italic;
    font-size: 0.8rem;
    color: #666;
}

.category {
    font-size: 1.2rem;
    font-weight: bold;
}
.raw {
    font-size: 0.95rem;
}
.prompt-full-text {
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
}
</style>
