const koa = require('koa')
const koaRouter = require('koa-router')// importing Koa-Router
const app = new koa()
const router = new koaRouter()
var views = require('koa-views');

const render = views(__dirname + '/views')

// Must be used before any router is used
app.use(render)
// OR Expand by app.context
// router.use(async function (ctx) {
//   ctx.state = {
//     session: this.session,
//     title: 'app'
//   };



// });
router.get('/admin/register',async (context)=>{

  //console.log(context.request.query['x'])

  //context.body = 'Welcome registration'
  //await context.render('registration.pug')
  await context.redirect("http://localhost:3000/registration")
})






  
router.get('home', '/', (context) => {
  context.body = "Welcome to my Koa.js Server"
})
router.get('admin','/admin',async function (ctx){
  ctx.body = "Welcome to admin"

})
router.get("adminlogin",'/admin/login',async function (ctx){
  //await ctx.render('login.pug')
  await ctx.redirect("http://localhost:3000/login")
})

app.use(router.routes())
  .use(router.allowedMethods())// registering routes to the application

app.listen(2400, () => console.log('Server running at PORT 2400'))
