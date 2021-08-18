import nft from './components/nft.vue';
import mainPage from './components/mainPage.vue';
import passPage from './components/passPage.vue';

export default [
    // { path: '/', component: nft },
    { path: '/', component: passPage },
    { path: '/mainPage', component: mainPage },
    { path: '/nft', component: nft },
]