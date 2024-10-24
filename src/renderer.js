import {createApp} from 'vue';
import {createPinia} from 'pinia';
import VueLazyload from 'vue-lazyload'
import router from './router';
import App from './App.vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './style.css';

const app = createApp(App);

app.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
});
app.use(createPinia());
app.use(router);
app.use(Toast);

app.mount('#app');
