//按需引入ivew中的插件
import Vue from 'vue'
import {
  Pagination,
  Dialog,
  Input,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Row,
  Col,
  Collapse,
  CollapseItem,
  Loading,
  MessageBox,
  Message,
} from 'element-ui'

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Button)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Collapse)
Vue.use(CollapseItem)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
