const sqlite3 = require('sqlite3');
let urlENG = "C:/Users/Grisha/Desktop/python/ENGLISH/ENGLISH.db";
let urlGER = "C:/Users/Grisha/Desktop/python/ENGLISH/GERMAN.db"
let urlIVR = "C:/Users/Grisha/Desktop/python/ENGLISH/IVRIT.db"
let urlPWD = "C:/Users/Grisha/Desktop/python/ENGLISH//MAINDB.db"
let unifiedmodule=require("./unifiedFile.js")

let unifiedmoduleobj = new unifiedmodule.ClsUnit()

class workDB{
    constructor(url){
        this.url=url

    }
    // соединение с БД
    connect_(){
      
       var db = new sqlite3.Database(this.url, (err) => {
           if (err) {
               message = err.message;
           }
   
       }
       )
       return db
   }
   //функция проверки и создания токена
   func_create_check_token(qIns,LstValues,nameTable,mail,typeofdevice,IPVAR,specialfuncobj,response){
    const { v4: uuidv4 } = require('uuid');
    db.run(qIns,LstValues,(err,result)=>{
      let qSel=`SELECT CreateDate,ID,Token FROM ${nameTable} where Login='${mail}' and devicetype=${typeofdevice} and IP='${IPVAR}'`
   
  
      if (err) {
  
    db.each(qSel,(err1,result1)=>{
  
      let CreateDate = result1.CreateDate
      let current_Token = result1.Token
      let current_date = unifiedmoduleobj.func_return_current_date()
      let flagtoken = specialfuncobj.func_check_date_token(CreateDate,current_date)
      let id1 = result1.ID
  
      if (flagtoken == false){
        let tokenVar1 = uuidv4() // создаем новый токен для случая если старый истек
        let qUPD=`UPDATE ${nameTable} SET Token='${tokenVar1}',CreateDate='${current_date}' WHERE ID=${id1}`
        db.run(qUPD)
        if (mail =='admin'){
          response.redirect(`http://localhost:2400/admin/listusers?tokenVar=${tokenVar1}&userid=${id1}`)
        }
        else{        response.redirect(`http://localhost:3000/main?tokenVar=${tokenVar1}&userid=${id1}`)}

      }
      else{
        if (mail =='admin'){
          response.redirect(`http://localhost:2400/admin/listusers?tokenVar=${current_Token}&userid=${id1}`)
        }
        else{
          response.redirect(`http://localhost:3000/main?tokenVar=${current_Token}&userid=${id1}`)
      }
    }
  
    })
      }
      else{
        //получаем id вставленной строки
        db.each(qSel,(errsel,ressel)=>{
          let myIDINSER = ressel.ID
          if (mail =='admin'){
            response.redirect(`http://localhost:2400/admin/listusers?tokenVar=${tokenVar}&userid=${myIDINSER}`)
          }
          else{
            response.redirect(`http://localhost:3000/main?tokenVar=${tokenVar}&userid=${myIDINSER}`)
          }
       
        })
  
      }
    })
   }
   func_check_password(login,pwd,nameTable,callback){

    let qSEL=`SELECT ID,Password FROM ${nameTable} where Login='${login}' and Password='${pwd}'`

    
  
  db.get(qSEL,callback);
   }
 call_all(query){
    let data = []
    db.all(query, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {

          data.push(row)
        });
      });

      return data ;
}

//формируем запрос вставки
ins_func(NameTable,LstFields){
  let StrFields= '';
  let StrValues = '';
  let LstUndefinedValues=[]; //[?,?] - создаем
  StrFields = unifiedmoduleobj.func_lst_to_str(LstFields)

  for (let i=0;i<LstFields.length;i++){

    LstUndefinedValues.push("?")

  }
  StrValues = unifiedmoduleobj.func_lst_to_str(LstUndefinedValues)

  let qIns= `INSERT INTO ${NameTable} (${StrFields}) VALUES(${StrValues}) `


 return qIns;
}


ins_func_add_values(qIns,LstValues){
db.run(qIns,LstValues,function(err,res){
  if (err){

    console.log("error insert")
  }



})


}
//функция проверяет что для данного токена корректный userID
func_check_correct_token(db,qsel,response){



  db.get(qsel,function(err,res){

    if (err){
   
      return 400;}

    if (res==undefined){

     return 401
    }

  })
}

}

module.exports = {workDB,urlENG,urlGER,urlIVR,urlPWD}