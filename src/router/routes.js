// import Patha from "views/pathA"; //正常加载
const Login = () => import("views/login/login.vue");
const SignUp = () => import('views/login/signup.vue');

const Authredirect = () => import("views/authredirect");
// 404 页面
const NotFoundComponent = () => import("views/nofound");


// 博客模块
const MyBlog = () => import("views/my-blog");
// 首页
const Home = () => import("views/my-blog/home/home.vue");
const ArticleList = () => import('views/my-blog/home/artilce-list');
const ArticleContent = ()=> import('views/my-blog/home/article-content');
// 天梯系统
const Rank = () => import('views/my-blog/rank/rank.vue');
// 个人中心
const MessageBoard = () => import('views/my-blog/message-board/message-board.vue');
// 用户信息展示
const UserMessage = () => import('views/my-blog/message-board/user-message.vue');
// 用户信息编辑
const EditMessage = () => import('views/my-blog/message-board/edit-message.vue');
// 发布文章模块
const Release = ()=> import('views/my-blog/release/index.vue');
// 发布简介
const ReleaseIntroduction = ()=> import('views/my-blog/release/release-introduction.vue');
// 发布文章详细内容
const ReleaseArticle = () => import('views/my-blog/release/release-article.vue')




const routes = [
  { // 登录
    path: "/login",
    name: "login",
    component: Login
  },
  {// 注册
    path: "/signup",
    name: "signUp",
    component: SignUp
  },
  { // 鉴权 重定向
    path: "/authredirect",
    name: "authredirect",
    component: Authredirect
  },
  { // 默认跳转博客首页
    path: "",
    redirect: '/my-blog'
  },
  { // 博客
    path: "/my-blog",
    component: MyBlog,
    children: [
      {// 默认跳转到首页
        path: '',
        redirect: '/my-blog/home'
      },
      { // 首页
        path: 'home',
        name:'Home',
        component: Home,
        redirect: '/my-blog/home/article-list/1',
        children:[{
          path:'article-list/:page',
          name: 'ArticleList',
          component:ArticleList
        },{
          path:'article-content/:id',
          name:'ArticleContent',
          component:ArticleContent
        }]
      },
      { // 天梯
        path: 'rank',
        name: 'Rank',
        component: Rank
      },
      { // 个人中心
        path: '/my-blog/message-board',
        component: MessageBoard,
        children:[{
          path:'',
          redirect:'/my-blog/message-board/user-message',
        },{
          path:'user-message',
          name:'UserMessage',
          component:UserMessage
        },{
          path:'edit-message',
          name:'EditMessage',
          component:EditMessage
        }]
      }
    ]
  },
  {// 创建文章
    path:'/release',
    component:Release,
    children:[{
      path: "",
      redirect: '/release/release-introduction/'
    },{
      // 第一步，创建简介
      path:'/release/release-introduction/:id',
      name:'ReleaseIntroduction',
      component:ReleaseIntroduction
    },{
      // 第二步，添加内容
      path:'/release/release-article/:id',
      name:'ReleaseArticle',
      component:ReleaseArticle
    }]
  },
  {
    path: "*", // 其他没有被匹配的路由，都会跳转到404页面
    component: NotFoundComponent
  }
];
export default routes;
