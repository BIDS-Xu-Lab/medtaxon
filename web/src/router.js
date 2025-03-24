import { createWebHistory, createRouter } from 'vue-router'

import HomePage from './pages/Home.vue';
import VisPage from './pages/Vis.vue';
import PromptEditor from './pages/PromptEditor.vue';
import TaxonomyEditor from './pages/TaxonomyEditor.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/vis', component: VisPage },
    { path: '/prompt_editor', component: PromptEditor },
    { path: '/taxonomy_editor', component: TaxonomyEditor },
]

const router = createRouter({
    history: createWebHistory(
        import.meta.env.VITE_BASE_PATH || './'
    ),
    routes,
})

export default router