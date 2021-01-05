/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-26
 * 文件说明：试题与答案
 */
import Cookie from 'js-cookie';
import {Table} from 'antd'
import Style from './questions.less'
import Part from './Part'
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
class TestPaper extends React.Component {

  render(){
    const{post,list,total_score,only_answer}=this.props;
    if(list && list.length){
      list.map((r,i)=>r.key=i+1)
    }
    return(
      <div className={Style.paper} style={{"fontFamily":"Calibri,宋体 !important","fontSize": "16px","lineHeight": "150%"}}>
        <div style={{"fontSize": "16pt",
          "fontWeight": "bold",
          "textAlign": "center","lineHeight": "150%"}}>联通软件研究院招聘笔试</div>
        {only_answer == false ?
          <div>
            <div style={{"textIndent": "2em","lineHeight": "150%"}}>感谢您参加中国联通软件研究院招聘笔试，满分{total_score}分。请耐心作答，祝您取得好成绩。</div>
            <div style={{"lineHeight": "150%"}}>姓名：</div>
            <div style={{"lineHeight": "150%"}}>岗位：{post}</div>
            <div style={{"lineHeight": "150%"}}>日期：</div>
          </div>
          :
          null
        }

        {list && list.length ?
          list.map(function(row,index){
            return (<Part part = {row.part_name} list = {row.types} only_answer = {only_answer}></Part>)
          })
          :null}

      </div>
    )
  }
}
export default TestPaper;
