import "./assets/main.css";
import "./assets/base.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./routers/routes";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

library.add(faUserSecret)

const app = createApp(App);

app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
