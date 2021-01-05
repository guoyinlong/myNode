/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-26
 * 文件说明：试题与答案
 */
import {splitEnterSpan} from '../../utils/func'
import {TYPE_SINGLE_CHOICE,TYPE_MULTIPLE_CHOICE,TYPE_GAP_FILLING,TYPE_SHORT_ANSWER} from '../../utils/config'

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-26
 * 功能：试题与答案
 */
class Answer extends React.Component {

  render(){
    const{index,type,answer}=this.props;
    return(
      <div style={{"fontFamily":"'Calibri','宋体' !important",
        "textAlign": "left",
        "fontSize": "16px",
        "lineHeight": "150%"}}>
        {answer && answer.length?index +".  ":null}
        {(type == TYPE_SINGLE_CHOICE || type == TYPE_MULTIPLE_CHOICE) && answer && answer.length?answer[0].answer:null}
        { type == TYPE_GAP_FILLING && answer && answer.length?
            answer.map(function(t){
            return (<span style={{"marginRight":'50px'}}>{t.answer}</span>)
          })
          : null}
        <div style={{'paddingLeft': '10px'}}>
          {(TYPE_SHORT_ANSWER.indexOf(type) != -1) && answer && answer.length?
            answer.map(function(t){
              return (<div style={{"marginLeft":'10px'}}>{splitEnterSpan(t.answer)}</div>)
            })
            :null}
        </div>

      </div>
    )
  }
}
export default Answer;
