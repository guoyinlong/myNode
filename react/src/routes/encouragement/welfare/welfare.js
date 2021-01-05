/**
 * 文件说明：全面激励-晋升激励报告
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */

import { connect } from 'dva';
import WelfareInfoComponent from './welfare2018'
import { getEncouragementInitYear} from '../../../utils/func.js'
// import {waterMark,preventCopy,timeStamp,unLockCopy} from "../../../utils/func.js"
import Cookie from 'js-cookie';
class WelfareInfo extends React.Component {
  componentDidMount(){
    const year = getEncouragementInitYear()-1;
    this.init(year)
  }
  init = (year) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'welfare/fetch',
      year
    })
  }
  render() {
    const { info,template,year } = this.props;
    return (
      <div>
        {info && template == '2018'  ?
          <WelfareInfoComponent
            info={info} year={year} onChange = {this.init}
          ></WelfareInfoComponent>
          :null}
          {!template ? <div>{year}年报告模板未配置</div> : null}

      </div>
    )
  }
}

/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * @param state 状态树
 */
function mapStateToProps(state) {
  const { info,template,year} = state.welfare;

  return {
    info,
    template,
    year,
    loading: state.loading.models.welfare,
  };
}
export default connect(mapStateToProps)(WelfareInfo)
