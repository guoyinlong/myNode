/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-05
 * 文件说明：员工考核结果卡片式组件
 */
import Cookie from 'js-cookie';
import {Progress,Tooltip,Icon} from 'antd'
import Style from './employer.less'
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-05
 * 功能：员工考核结果卡片式组件，展示考核周期、考核结果、考核得分、贡献度
 */
class QuestionnaireRes extends React.Component {
  stateMap={
    0:{state:'待提交',percent:60},
    1:{state:'已提交',percent:100},
  };
  render(){
    const{state,year,cardClickHandle}=this.props;
    return(
      <div className={Style.res_div} onClick={cardClickHandle}>
          <div style={{"width":'324px',"height":'192px'}}>
              <div style={{"float":'left',"width":'124px','fontFamily':'PingFangSC-Regular','color':'#000',
                'fontSize':'24px','paddingTop':'74px','paddingLeft':'40px'}}>
                <p>{year + '年'}</p>
              </div>
              <div style={{"float":'left',"width":'200px','marginTop': '20px','paddingLeft': '25px'}}>
                <Progress className={Style.progress} style={{color:state == '0'?'#8EB1CB':null}} gapPosition = {'bottom'} width={96} strokeWidth={6}  type="circle" percent={state !== undefined ? this.stateMap[state].percent:0} format={()=>state !== undefined ?this.stateMap[state].state:''} />
              </div>
          </div>
      </div>
    )
  }
}
export default QuestionnaireRes;
