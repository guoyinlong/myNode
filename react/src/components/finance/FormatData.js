/**
 * 作者：张楠华
 * 日期：2018-4-18
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：格式化数据
 */
function MoneyComponent(text) {
  if(text === '0.00'){
    return <div style={{textAlign:'right',letterSpacing:1}}>-</div>
  }else{
    return <div style={{textAlign:'right',letterSpacing:1}}>{text}</div>
  }
}
export default { MoneyComponent }
