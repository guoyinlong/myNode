/**
 * 文件说明：全面激励-晋升激励报告
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */

import { connect } from 'dva';
import HonorInfoComponent from './honor2018'
import { getEncouragementInitYear} from '../../../utils/func.js'
import Cookie from 'js-cookie';
class HonorInfo extends React.Component {
  componentDidMount(){
    const year = getEncouragementInitYear()-1;
    this.init(year)
  }

  init = (year) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'honor/fetch',
      year
    })
  }
  render() {
    const { info,template,year } = this.props;
    return (
      <div>
        {info && template == '2018'  ?
          <HonorInfoComponent
            info={info} year={year} onChange = {this.init}
          ></HonorInfoComponent>
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
  const { info,template,year} = state.honor;

  return {
    info,
    template,
    year,
    loading: state.loading.models.honor,
  };
}
export default connect(mapStateToProps)(HonorInfo)
