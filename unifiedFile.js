class SpecialFunctions{
  //собираем строку в нужный формат
  func_prepare_string(dateOld){
    let mydate =  dateOld.split("_")[0]+"-"+dateOld.split("_")[1]+"-"+dateOld.split("_")[2]+" "+dateOld.split("_")[3]+":"+dateOld.split("_")[4]
    return mydate;

  }
func_dateDifferenceInMinutes(dateInitial, dateFinal){
return   (dateFinal - dateInitial) / (1000*60);

}

  //функция проверки экспирации токена
  func_check_date_token(dateOld,currentDate){

    

   //'2024_4_23_10_50'
 let date1 = new Date(this.func_prepare_string(dateOld)+":00")

 let date2 = new Date(this.func_prepare_string(currentDate)+":00");



//получаем разницу времени из бд и текущего времени
let diff1 = this.func_dateDifferenceInMinutes(
  date1,
  date2
);
if (diff1 <60){
return true;
}
else{
  return false;
}
  }
}

class ClsUnit{
  //возвращает текущую дату создания
func_return_current_date(){
  let now = new Date();
  let date_ = now.getFullYear()+"_"+(now.getMonth()+1)+"_"+now.getDate()+"_"+now.getHours()+"_"+now.getMinutes()
  return date_;

}
//определяет тип устройства
func_define_device(navigator){


    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // код для мобильных устройств
        return 1;
      } else {
        return 2;
        // код для обычных устройств
      }
}
//здесь мы объединяем названия полей в строку
func_lst_to_str(Lst){
    let StrValue = '';
    for (let i=0;i<Lst.length;i++){
    if (i!=Lst.length-1){
        StrValue+=Lst[i]+",";
      }
    else{
        StrValue+=Lst[i];
    }
}
    return StrValue;

}

}

module.exports = {ClsUnit,SpecialFunctions}