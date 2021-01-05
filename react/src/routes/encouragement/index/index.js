/**
 * 文件说明：全面激励报告首页
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */

import { connect } from 'dva';
import IndexInfoComponent2018 from './index2018';
import { getEncouragementInitYear} from '../../../utils/func.js'
import Cookie from 'js-cookie';
class IndexInfo extends React.Component {
  componentDidMount(){
    const year = getEncouragementInitYear();
    this.init(year)
  }
  init = (year) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'index/fetch',
      year
    })
  }
  render() {
    const { info,template,postInfo,talentInfo } = this.props;
    return (
      <div>
        {info && template == '2018'  ?
          <IndexInfoComponent2018 year = {info.joinYear}
                              month = {info.joinMonth}
                              day = {info.joinDay}
                              deptName = {info.deptname}
                              staffName = {info.staff_name}
                              message = {info.content}
                              age = {info.ryyAge}
                              postInfo={postInfo} talentInfo={talentInfo}
          >
          </IndexInfoComponent2018>
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
  const { info,template,postInfo,talentInfo} = state.index;

  return {
    info,
    template,
    postInfo,
    talentInfo,
    loading: state.loading.models.index,
  };
}
export default connect(mapStateToProps)(IndexInfo)
