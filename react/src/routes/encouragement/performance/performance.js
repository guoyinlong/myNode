/**
 * 文件说明：全面激励-晋升激励报告
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */

import { connect } from 'dva';
import PerformanceInfoComponent2018 from './performance2018'
import { getEncouragementInitYear} from '../../../utils/func.js'
import Cookie from 'js-cookie';
class PerformanceInfo extends React.Component {
  componentDidMount(){
    const year = getEncouragementInitYear()-1;
    this.init(year)
  }
  init = (year) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'performance/fetch',
      year
    })
  }
  render() {
    const { infoList,year,template } = this.props;
    return (
      <div>
        {infoList && infoList.length && template == '2018'  ?
          <PerformanceInfoComponent2018
            infoList = {infoList} year={year} onChange = {this.init}
          ></PerformanceInfoComponent2018>
          :null}

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
  const { infoList,year,template} = state.performance;

  return {
    infoList,
    year,
    template,
    loading: state.loading.models.performance,
  };
}
export default connect(mapStateToProps)(PerformanceInfo)
