// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
import proportion from 'vue-proportion-directive';
import { VueJsonp } from 'vue-jsonp'
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// Vue.prototype.$axios = axios;
Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://localhost:8081';
axios.defaults.withCredentials = true;
Vue.use(VueJsonp)
Vue.use(proportion);
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    render: h => h(App),
    components: { App },
    template: '<App/>'
})
