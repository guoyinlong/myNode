/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-26
 * 文件说明：试题与答案
 */
import Style from './questions.less'
import {splitEnterSpan} from '../../utils/func'
import {TYPE_SINGLE_CHOICE,TYPE_MULTIPLE_CHOICE,TYPE_GAP_FILLING,TYPE_SHORT_ANSWER} from '../../utils/config'
function convert(num){
  return num <= 26 ?
    String.fromCharCode(num + 64) : convert(~~((num - 1) / 26)) + convert(num % 26 || 26);
}
function isinLine (type,options){
  if(type == TYPE_SINGLE_CHOICE || type == TYPE_MULTIPLE_CHOICE){
    let oneLine = 1;
    let twoLine = 1;
    for(let i = 0 ; options && options.length && i < options.length; i++){
      if(options[i].option_name.length <= 6){
        oneLine &= 1;
      }else{
        oneLine = 0;
      }
      if(options[i].option_name.length <= 12){
        twoLine &= 1;
      }else{
        twoLine = 0;
      }
    }
    if(oneLine == 1){
      return 1;
    }else if(twoLine == 1){
      return 2;
    }else{
      return 0;
    }
  }else{
    return 0;
  }
}
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-26
 * 功能：试题与答案
 */
class QuestionAnswer extends React.Component {

  render(){
    let{index,type,question,options,answer,score}=this.props;
    if(options && options.length){
      options.map((r,i)=>r.key=i+1)
    }
    if(answer && answer.length){
      answer.map((r,i)=>r.key=i+1)
    }

    return(
      <div className={Style.questions} style={{"fontFamily":"'Calibri','宋体' !important","textAlign": "left","fontSize": "16px","lineHeight": "150%"}}>
        <span className={Style.content} style={{"whiteSpace":"pre-wrap"}}>{index ? index + '. ':null}{question}{score?"（"+score+"分）":null}</span>
        <br/>
        {options && options.length?
          <div>
            {isinLine(type,options) == 1?
              options.map(function(t,index){
                return (<span style={{"whiteSpace":"pre-wrap","lineHeight": "150%"}}>{splitEnterSpan(convert(index+1) + '. ' +t.option_name.concat("      "))}</span>)
              })
              :options.map(function (t, index) {
                return (<div style={{"whiteSpace": "pre-wrap","lineHeight": "150%"}}>
                  {type == TYPE_SINGLE_CHOICE || type == TYPE_MULTIPLE_CHOICE ? splitEnterSpan(convert(index + 1) + '. ' + t.option_name) : splitEnterSpan(t.option_name)}</div>)
              })
            }

          </div>

          :null}
        {answer && answer.length?"答案：":null}
        {/*单选&多选*/}
        {(type == TYPE_SINGLE_CHOICE || type == TYPE_MULTIPLE_CHOICE) && answer && answer.length?answer[0].answer:null}
        {/*填空*/}
        { type == TYPE_GAP_FILLING && answer && answer.length?
            answer.map(function(t,index){
            return (<span style={{paddingRight: '40px'}}>{t.answer}</span>)
          })
          : null}
        {/*简答&编程*/}
        <div className={Style.answer}>
          {(TYPE_SHORT_ANSWER.indexOf(type) != -1) &&answer && answer.length?
            answer.map(function(t,index){
              return (<div>{splitEnterSpan(t.answer)}</div>)
            })
            :null}
        </div>

      </div>
    )
  }
}
export default QuestionAnswer;
