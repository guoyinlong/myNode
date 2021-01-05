/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-26
 * 文件说明：试题与答案
 */

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-26
 * 功能：试题与答案
 */
class ChoiceAnswer extends React.Component {

  render(){
    const{index,answer}=this.props;
    return(
      <span style={{"fontFamily":"'Calibri','宋体' !important",
        "textAlign": "left",
        "fontSize": "16px",
        "lineHeight": "150%","float":'left'}}>
        {answer && answer.length?index +"." + answer[0].answer:null}
        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </span>
    )
  }
}
export default ChoiceAnswer;
