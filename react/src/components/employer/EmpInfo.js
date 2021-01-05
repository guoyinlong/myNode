/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-16
 * 文件说明：员工信息组件，展示考核周期及员工基本信息
 */
import Cookie from 'js-cookie';
import Style from './employer.less'
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-16
 * 功能：员工信息组件，展示考核周期及员工基本信息
 */
class EmpInfo extends React.Component {

  render(){
    const{year,season,staff_id,staff_name}=this.props;

    return(
      <div className={Style.nameInfo}>
        <div>
          <p>
            考核周期<br/>
            {year}年<br/>
            第{season}季度
          </p>
        </div>

        <div>
          {staff_name}<br/>
          NO.{staff_id}
        </div>
      </div>
    )
  }
}
export default EmpInfo;
