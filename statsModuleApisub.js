expresssubapiStats = require("express");
const connectmyDB=require("./connectionDB.js") 
var requestMODULE = require('request');
const urlencodedParserStats = expresssubapiStats.urlencoded({extended: false});


statssubapiget = expresssubapiStats();
//statsuser
statssubapiget.get("/statsuser",function(request,response){


    let userid=request.query.userid
    let tokenVar = request.query.tokenVar
  
    //входные параметры
    let urlToken = `http://localhost:3000/checktoken?tokenVar=${tokenVar}&userid=${userid}`
    //Подключение к БД
    mycls = new connectmyDB.workDB(connectmyDB.urlPWD)
    db = mycls.connect_()
    requestMODULE(urlToken, function (error, responseToken, body) {
      let json = JSON.parse(body);
      if (json["result"]==200){
    response.render("statsuser",{'tokenVar':tokenVar,'userid':userid,'result':[]})
      }
      else{
        response.sendStatus(json["result"]);
      }
    })
    
})
statssubapiget.post("/statsuser",urlencodedParserStats,function(request,response){

  mycls = new connectmyDB.workDB(connectmyDB.urlPWD)
  db = mycls.connect_()
  
  let typereport = request.body.typereport;
  console.log(typereport)
  let userid=request.query.userid;
  let tokenVar = request.query.tokenVar;

  let urlToken = `http://localhost:3000/checktoken?tokenVar=${tokenVar}&userid=${userid}`
  let nameTable = 'LogTable';

  requestMODULE(urlToken, function (error, responseToken, body) {
    let json = JSON.parse(body);
 
  
    if (json["result"]==200){
  if (typereport=='Отчет по языкам'){
    var sqlSelect = `SELECT Lang,COUNT(Name) as Counter FROM ${nameTable} where UserID=${userid}  GROUP BY Lang ORDER BY Lang`


  
    db.all(sqlSelect,function(err,res){
      if (err){
 
    
        response.json({'status':400})
      }
   
      
      let dataY = []
      let dataX = []
      let sX=''
      for (let i=0;i<res.length;i++){
     
        dataX.push(res[i].Lang)
        sX+=res[i].Lang+" "
        dataY.push(res[i].Counter)
      }
    
      response.render("statsuser",{'tokenVar':tokenVar,'userid':userid,'xValues':sX,'namereport':typereport,'data':dataY})


     
    
    })


  }


}
else{
  response.json({'status':json["result"]})

}

})

  
  })
  

module.exports = {statssubapiget}