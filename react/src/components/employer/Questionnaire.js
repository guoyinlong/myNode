/**
 * 文件说明：调查问卷试题组件文件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-30
 */
import Style from './employer.less'
import {splitEnter} from '../../utils/func'
import { Radio } from 'antd';
const RadioGroup = Radio.Group;
/**
 * 功能：调查问卷试题组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-30
 */
class Questionnaire extends React.Component {

  //评分标准：非常满意5分，比较满意4分，一般3分，不太满意2分，非常不满意1分及以下
  resultMap=[{"value":5,"text":'5分'},
    {"value":4,"text":'4分'},
    {"value":3,"text":'3分'},
    {"value":2,"text":'2分'},
    {"value":1,"text":'1分'},
    {"value":0,"text":'0分'}]


  render(){
    const{item,onChange,edit}=this.props;
    return(

        <div className={Style.support_div}>
          {/*<p>{(item.key + 1)+'.' + item.dept_name.split('-')[1] +'-' + item.staff_name }</p>*/}
          <p>{item.dept_name ? item.dept_name.split('-')[1] : ''}</p>
          <div style={{marginBottom: 10}}>{splitEnter(item.kpi_target)}</div>
          <div>
            <RadioGroup name="radiogroup" onChange={onChange} defaultValue = {parseInt(item.score)}>
              {this.resultMap.map((item, index) =>
                <Radio className={Style.support_radio} value = {item.value} disabled = {edit} key={index}>{item.text}</Radio>
                )
              }
            </RadioGroup>
          </div>
        </div>


    )
  }
}
export default Questionnaire;
