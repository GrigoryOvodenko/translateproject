expresssubapi = require("express");
const connectmyDB=require("./connectionDB.js") 
var requestMODULE = require('request');
let unifiedmodule=require("./unifiedFile.js")
let configmodule = require("./config.js")
let specialfuncobj= new unifiedmodule.SpecialFunctions() // специальные функции вынесенные в отдельный модуль
const urlencodedParser = expresssubapi.urlencoded({extended: false});

let unifiedmoduleobj = new unifiedmodule.ClsUnit()

//login get and post method
subapilogoutget = expresssubapi();
subapilogoutpost = expresssubapi();
//login get and post method
//search get and post method
searchget = expresssubapi();
searchpost = expresssubapi();
//search get and post method

//question get and post method
questionsapiget = expresssubapi()
questionsapipost = expresssubapi()
//question get and post method

//registration get and post method
registrationget = expresssubapi()
registrationpost = expresssubapi()
//registration get and post method
//login get and post method
loginget = expresssubapi()
loginpost = expresssubapi()
//login get and post method
retrieveget = expresssubapi()
mainget = expresssubapi()



//Методы на выход ; get- 400 ошибка ;post-выход из системы

subapilogoutpost.post("/",function(request,response){
  console.log(subapilogoutpost.mountpath);
  response.redirect("http://localhost:3000/login")

})
//Методы на выход ; get- 400 ошибка ;post-выход из системы


questionsapipost.post("/",urlencodedParser,function(request,response){

  console.log(request.body)
  //входные параметры
  let userid=request.query.userid
  let tokenVar = request.query.tokenVar
  //входные параметры

  //Подключение к БД
  mycls = new connectmyDB.workDB(connectmyDB.urlPWD)
  db = mycls.connect_()
  let urlToken = `http://localhost:3000/checktoken?tokenVar=${tokenVar}&userid=${userid}`
  //Подключение к БД
  //Проверка токена и id
  requestMODULE(urlToken, function (error, responseToken, body) {
    let json = JSON.parse(body);
    if (json["result"]==200){
      let connectPWD = new connectmyDB.workDB(connectmyDB.urlPWD)
      let nameTableQuestions = 'Questions'
      let date_ = unifiedmoduleobj.func_return_current_date()
      let qIns=connectPWD.ins_func(nameTableQuestions,["Text","UserID","CurrentDate"])
      let textField = request.body.fieldtext
      let LstValues = [textField,userid,date_];
      //вставляем обратную связь в бд
      db.run(qIns,LstValues,function(err,res){
        if (err){      
          response.render('questions',{'tokenVar':tokenVar,'userid':userid,'flag':false})
        }
        else{
          response.redirect("http://localhost:3000/login?questions=true")
    
        }
      })

    }
    else{
      response.sendStatus(json["result"]);

    }
  })


     
})






subapilogoutget.get("/",function(request,response){
    console.log(subapilogoutget.mountpath);
    response.sendStatus(400)
  })

  searchget.get("/",function(request,response){
    console.log(searchget.mountpath);
    response.sendStatus(400)
  })


  // //поиск нужного слова 
  searchpost.post("/",urlencodedParser,function(request,response){
    let userid=request.query.userid;
  let tokenVar = request.query.tokenVar;
    let mylang=request.body.mylang;
    if(!request.body) return response.sendStatus(400);
    //входные параметры
    //Подключение к БД
    mycls = new connectmyDB.workDB(connectmyDB.urlPWD)
    db = mycls.connect_()
    let urlToken = `http://localhost:3000/checktoken?tokenVar=${tokenVar}&userid=${userid}`
    requestMODULE(urlToken, function (error, responseToken, body) {
      let json = JSON.parse(body);
      if (json["result"]==200){
        //let rus_word='Не Найдено';
        let word = request.body.word;
        let nameTable = 'LogTable';
        let LstValues = [word,mylang,userid];
        let qIns=mycls.ins_func(nameTable,["Name","Lang","UserID"]) //формируем запрос вставки
        mycls.ins_func_add_values(qIns,LstValues) //вставляем данные 
        var sqlSelect = `SELECT DISTINCT Name,Lang FROM LogTable where UserID=${userid}  ORDER BY MYID DESC LIMIT 10 `
        if (request.body.mylang =='Английский') {
          var sqlSelectOne = "SELECT  rus_word FROM words where eng_word="+`'${word}'`
      
        mycls = new connectmyDB.workDB(connectmyDB.urlENG)
        db1 = mycls.connect_()
        db1.all(sqlSelectOne,function(err, results1, fields){
          if (err) {
            message = err.message;
        }
        try{
        rus_word=results1[0].rus_word
        }
        catch{
          rus_word = 'Не Найдено'
      
        }
        })
      }
      else if (request.body.mylang =='Немецкий'){
      
        var sqlSelectOneGER = "SELECT  rus_word,genus FROM words where ger_word="+`'${word}'`
        myclsGER = new connectmyDB.workDB(connectmyDB.urlGER)
        dbGER = myclsGER.connect_()
      
      dbGER.all(sqlSelectOneGER,function(err, results2){
        if (err) {
          message = err.message;
      }
      try{
      rus_word=results2[0].rus_word +"("+results2[0].genus+")"
      
      }
      catch{
        rus_word = 'Не Найдено'
      
      }
      })
      }
      else if (request.body.mylang =='Иврит'){
      
        var sqlSelectOneIVR = "SELECT  rus_word FROM words where ivr_word="+`'${word}'`
        myclsIVR = new connectmyDB.workDB(connectmyDB.urlIVR)
        dbIVR = myclsIVR.connect_()
      
        dbIVR.all(sqlSelectOneIVR,function(err, results3){
        if (err) {
          message = err.message;
      }
      try{
      rus_word=results3[0].rus_word 
      
      }
      catch{
        rus_word = 'Не Найдено'
      
      }
      })
      }
      
      
      
      
      
      db.all(sqlSelect,function(err, results, fields) {
        if (err) {
          message = err.message;
      }
      
      
      
      
      response.render('main',{'resultsLOG':results,'centerresult':[word,rus_word],'tokenVar':tokenVar,'userid':userid})
      
      })
  
      }
      else{
  
        response.sendStatus(json["result"]);
      }
  
    })
  
  })








  questionsapiget.get("/", function(request, response){
    console.log(questionsapiget.mountpath);
    let userid=request.query.userid
    let tokenVar = request.query.tokenVar
  
    //входные параметры
    let urlToken = `http://localhost:3000/checktoken?tokenVar=${tokenVar}&userid=${userid}`
    //Подключение к БД
    mycls = new connectmyDB.workDB(connectmyDB.urlPWD)
    db = mycls.connect_()
     //Проверка токена и id
    requestMODULE(urlToken, function (error, responseToken, body) {
      let json = JSON.parse(body);
      if (json["result"]==200){
        response.render('questions',{'tokenVar':tokenVar,'userid':userid,'flag':true})
      }
      else{
        response.sendStatus(json["result"]);
  
      }
  
    })

})
  registrationget.get("/", function(request, response){
    console.log(registrationget.mountpath);

    response.render('registration',{name2:'Регистрация',flag:''});
    
    
  })

  registrationpost.post("/",urlencodedParser,function(request,response){
    let connectPWD = new connectmyDB.workDB(connectmyDB.urlPWD)
    let password_ = btoa("antisaltpwd__"+request.body.pwd+"__mysaltpwd") 
    let email = request.body.email
    date_ = unifiedmoduleobj.func_return_current_date()
    db = connectPWD.connect_()
  
    let nameTable = 'PWDTABLE'
  
    let qIns=connectPWD.ins_func(nameTable,["Login","Password","CreateDate"])
    let LstValues = [email,password_,date_];
    db.run(qIns,LstValues,function(err,res){
      if (err){      
        response.render('registration',{name2:'Регистрация',flag:'error'});
      }
      else{
        response.redirect("http://localhost:3000/login")
  
      }
     
  
    })
  
  
  })



  
  loginget.get("/",function(request,response){
    console.log(loginget.mountpath);
    response.render('login',{'email':'','flag':request.query.questions})
    
  })

  loginpost.post("/",urlencodedParser,function(request,response){
    let email = request.body.email
    let password = request.body.pwd
    let connectPWD = new connectmyDB.workDB(connectmyDB.urlPWD)
    db = connectPWD.connect_()
    date_ = unifiedmoduleobj.func_return_current_date()
    let typeofdevice = unifiedmoduleobj. func_define_device(navigator)
    const { v4: uuidv4 } = require('uuid');
    tokenVar = uuidv4() //создаем токен для вставки 
    let nameTable = 'TokenTable'
    let IPVAR='0.0.0.1'
   let qIns=connectPWD.ins_func(nameTable,["Login","Token","CreateDate","devicetype","IP"])
  
  let LstValues = [email,tokenVar,date_,typeofdevice,IPVAR];
  
  /* Проверяем логин-пароль */
   connectPWD.func_check_password(email,btoa("antisaltpwd__"+password+"__mysaltpwd") ,"PWDTABLE",function(err,row){
  
  if (  row ===undefined){
  
  //пароль неверен
  response.render('login',{'email':email,'flag':false})
  }
  else{
  //логин верен
    /* ЭТА ЧАСТЬ НА РАБОТУ С ТОКЕНОМ */
    
    connectPWD.func_create_check_token(qIns,LstValues,nameTable,email,typeofdevice,IPVAR,specialfuncobj,response)
  
  /* ЭТА ЧАСТЬ НА РАБОТУ С ТОКЕНОМ */
  
  }
  
   })
  
  })
  





  retrieveget.get("/",function(request,response){
    console.log(retrieveget.mountpath);
    response.render("retrieve")
    
  
  })






//Главная страница на ней лог предыдущих запросов и основная информация
  mainget.get("/", function(requestmain, response){
    console.log(mainget.mountpath);
    //входные параметры
    let userid=requestmain.query.userid
    let tokenVar = requestmain.query.tokenVar
    //входные параметры
    //Подключение к БД
    mycls = new connectmyDB.workDB(connectmyDB.urlPWD)
    db = mycls.connect_()
    let urlToken = `http://localhost:3000/checktoken?tokenVar=${tokenVar}&userid=${userid}`
    
    
    requestMODULE(urlToken, function (error, responseToken, body) {
    
       
        let json = JSON.parse(body);
    
        if (json["result"]==200){
          var sql = `SELECT DISTINCT Name,Lang FROM LogTable where UserID=${userid}  ORDER BY MYID DESC LIMIT 10 `
          db.all(sql,function(err, results, fields) {
            if (err) {
              message = err.message;
          }
          response.render('main',{'resultsLOG':results,'centerresult':[],'tokenVar':tokenVar,'userid':userid})
        
           
           
      
        })
      
        }
        else{
          response.sendStatus(json["result"]);
        }
    
    })
    
    
    
    
    });


module.exports = {subapilogoutpost,subapilogoutget,searchget,searchpost,questionsapiget,questionsapipost,registrationget,registrationpost,loginget,loginpost,retrieveget,mainget}