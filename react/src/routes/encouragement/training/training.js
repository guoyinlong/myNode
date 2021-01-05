/**
 * 文件说明：全面激励-晋升激励报告
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */

import { connect } from 'dva';
import TrainingInfoComponent from './training2018'
import { getEncouragementInitYear} from '../../../utils/func.js'
import Cookie from 'js-cookie';

class TrainingInfo extends React.Component {
  componentDidMount(){
    const year = getEncouragementInitYear()-1
    this.init(year)
  }
  init = (year) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'training/fetch',
      year
    })
  }

  render() {
    const { info,template,year,trainName,courseList,isInternalTrainer } = this.props;
    return (
      <div>
        {info && template == '2018'  ?
          <TrainingInfoComponent
            info={info} year={year} onChange = {this.init} trainName={trainName} 
            courseList={courseList} isInternalTrainer={isInternalTrainer}
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
  const { info,template,year,trainName,courseList,isInternalTrainer} = state.training;

  return {
    info,
    template,
    year,
    trainName,
    courseList,
    isInternalTrainer,
    loading: state.loading.models.training,
  };
}
export default connect(mapStateToProps)(TrainingInfo)
