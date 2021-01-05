/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-26
 * 文件说明：试题与答案
 */
import Cookie from 'js-cookie';
import {Table} from 'antd'
import Style from './questions.less'
import QuestionAnswer from './QuestionAnswer'
import Answer from './Answer'
import ChoiceAnswer from './ChoiceAnswer'
import {TYPE_SINGLE_CHOICE,TYPE_MULTIPLE_CHOICE,TYPE_GAP_FILLING,TYPE_SHORT_ANSWER} from '../../utils/config'
function convert(num){
  const Upper = ["一","二","三","四","五","六","七","八","九","十"];
  return num <= 9 ?
    Upper[num] : convert(~~((num - 1) / 9)) + convert(num % 9 || 9);
}
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-26
 * 功能：试题与答案
 */
class Type extends React.Component {

  render(){
    let{index,equal,id,type,score,total_score,count,list,only_answer}=this.props;
    if(list && list.length){
      list.map((r,i)=>r.key=i+1)
    }
    return(
      <div >
        <div style={{"clear":'both',"lineHeight": "150%"}}>
          <span style={{"fontSize": "14pt",
            "fontWeight": "bold"}}>{convert(index) + '、' + type}</span>
          {equal == false?
            <span>{"（共 "+count+" 道题，共计 "+total_score+" 分）"}</span>
            :
            <span>{"（每题 "+score+" 分，共计 "+total_score+" 分）"}</span>
          }
        </div>

        {count && (id == TYPE_SINGLE_CHOICE || id == TYPE_MULTIPLE_CHOICE) && only_answer == true?
          list.map(function(row,index){
            return (<ChoiceAnswer index={index+1} answer = {row.answer} type={row.type_uid}></ChoiceAnswer>)}
            )
          :null
        }

          {count && id != TYPE_SINGLE_CHOICE && id != TYPE_MULTIPLE_CHOICE && only_answer == true?
            list.map(function(row,index){
              return (<Answer index={index+1} answer = {row.answer} type={row.type_uid}></Answer>)
            })
          :null
          }

          {count &&  only_answer == false?
          list.map(function(row,index){
            return (<QuestionAnswer index={index+1} type = {row.type_uid} question = {row.question_name} options = {row.options}
                                    score={TYPE_SHORT_ANSWER.indexOf(id) != -1?row.question_score:null}></QuestionAnswer>
              )
          })
          :null}
      </div>
    )
  }
}
export default Type;
