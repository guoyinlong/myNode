/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-31
 * 文件说明：正态分布组件，展示考核周期及分布群体信息
 */
import Cookie from 'js-cookie';
import {Table} from 'antd'
import Style from './employer.less'
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-31
 * 功能：正态分布组件，展示考核周期及分布群体信息
 */
class DistInfo extends React.Component {
  render(){
    const{year,season,checker_info,checker_name,team_count,key_count}=this.props;
    return(
      <div className={Style.distTitle}>
        <div>
          <h3>{season!='0' ? <div>{year}年 第{season}季度 正态分布</div>: <div>{year}年 年度考核 正态分布</div>} </h3>
        </div>
        <div>
          <span>{checker_info} : {checker_name}</span>
          <span>成员数量 :  {key_count ? <span>{team_count}<span className={Style.key_count}>{'+'+key_count}</span></span> : <span>{team_count}</span>}   个</span>
        </div>
      </div>
    )
  }
}
export default DistInfo;
