/**
 * 文件说明：全面激励报告首页
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */

import { connect } from 'dva';
import BasicInfoComponent2018 from './basicinfo2018'
import { getEncouragementInitYear} from '../../../utils/func.js'
class BasicInfo extends React.Component {
  componentDidMount(){
    const year = getEncouragementInitYear();
    this.init(year)
  }

  init = (year) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'basicinfo/fetch',
      year
    })
  }
  render() {
    const { info,optionInfo,template,talentsList,performance,isInternalTrainer } = this.props;
    return (
      <div >
        {info && template == '2018'  ?
          <BasicInfoComponent2018
            info = {info} optionInfo = {optionInfo} talentsList={talentsList}
            performance={performance} isInternalTrainer={isInternalTrainer}
          />
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
  const { info,optionInfo,template,year,talentsList,performance,isInternalTrainer} = state.basicinfo;

  return {
    info,
    optionInfo,
    template,
    year,
    talentsList,
    performance,
    isInternalTrainer,
    loading: state.loading.models.basicinfo,
  };
}
export default connect(mapStateToProps)(BasicInfo)
