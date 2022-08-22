import Vue from "vue";
import App from "./App.vue";

import {
  Button,
  Input,
  Table,
  TableColumn,
  Dialog,
  Form,
  FormItem,
  Option,
  Select,
  Cascader,
  Message,
  MessageBox,
  Autocomplete,
} from "element-ui";

Vue.use(Button);
Vue.use(Input);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Option);
Vue.use(Select);
Vue.use(Cascader);
Vue.use(Autocomplete);
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
