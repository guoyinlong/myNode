/**
 * 文件说明：全面激励-晋升激励报告
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */

import { connect } from 'dva';
import WageInfoComponent from './wage2018';
import { getEncouragementInitYear} from '../../../utils/func.js'
import Cookie from 'js-cookie';
class WageInfo extends React.Component {
  componentDidMount(){
    const year = getEncouragementInitYear()-1||2020;
    this.init(year)
  }
  init = (year) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'wage/fetch',
      year
    })
  }

  render() {
    const { info,template,year } = this.props;
    return (
      <div>
        {info && template == '2018'  ?
          <WageInfoComponent
            info={info} year={year} onChange = {this.init}
          ></WageInfoComponent>
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
  const { info,template,year} = state.wage;

  return {
    info,
    template,
    year,
    loading: state.loading.models.wage,
  };
}
export default connect(mapStateToProps)(WageInfo)
