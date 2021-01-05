/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-26
 * 文件说明：试题与答案
 */
import Cookie from 'js-cookie';
import {Table} from 'antd'
import Style from './questions.less'
import Type from './Type'
function convert(num){
  return num <= 26 ?
    String.fromCharCode(num + 64) : convert(~~((num - 1) / 26)) + convert(num % 26 || 26);
}
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-26
 * 功能：试题与答案
 */
class Part extends React.Component {

  render(){
    let{part,list,only_answer}=this.props;
    if(list && list.length){
      list.map((r,i)=>r.key=i+1)
    }
    return(
      <div>
        <br/>
        <div style={{"fontSize": "14pt",
          "fontWeight": "bold",
          "textAlign": "center","verticalAlign": "middle"}}>{part}</div>
        <br/>
        {list && list.length ?
          list.map(function(row,index){
            return (<Type index={index} equal={row.is_equal} id = {row.type_uid}  type = {row.type_name}
                          list = {row.questions} total_score={row.type_score} only_answer = {only_answer}
                          count={row.questions && row.questions.length ? row.questions.length : 0}
                          score={row.questions && row.questions.length ? row.type_score / row.questions.length : '0'}></Type>)
          })
          :null}
      </div>
    )
  }
}
export default Part;
