let subAPImodule = require("./subAPIlogin.js") // объект из котороого берем суб приложения
let statsAPImodule = require("./statsModuleApisub.js") // объект из которого берем суб приложения для статистики


// подключение express
const express = require("express");

// создаем объект приложения
const app = express();


app.set('view engine', 'pug');

app.use('/logout',subAPImodule.subapilogoutget) //get logout
app.use('/logout',subAPImodule.subapilogoutpost) // post logout


app.use('/search',subAPImodule.searchget) // search get
app.use('/search',subAPImodule.searchpost) // search post

app.use('/questions',subAPImodule.questionsapiget) // questions get
app.use('/questions',subAPImodule.questionsapipost) // questions post


app.use('/registration',subAPImodule.registrationget) //registration
app.use('/registration',subAPImodule.registrationpost) //registration

app.use('/login',subAPImodule.loginget) // login get
app.use('/login',subAPImodule.loginpost) // login post


app.use('/retrieve',subAPImodule.retrieveget) //get retrieve
app.use('/main',subAPImodule.mainget)
app.use('/reports',statsAPImodule.statssubapiget)



// определяем обработчик для маршрута "/"
app.get("/", function(request, response){
    // отправляем ответ
    response.render('index', { title: 'Hey', message: 'Hello there!'});
});

app.get("/checktoken",function(request,response){
  let userid=request.query.userid
  let tokenVar = request.query.tokenVar
  let nameTable = 'TokenTable'
  qSEL= `SELECT ID FROM ${nameTable} where ID=${userid} and Token='${tokenVar}'`
  db.get(qSEL,function(err,res){
  
      if (err){
        return response.json({'result':400})
  
      }
  
      if (res==undefined){
        return response.json({'result':401})
       
      }
      else{
        return response.json({'result':200})
      }
    })



})



// начинаем прослушивать подключения на 3000 порту
app.listen(3000);