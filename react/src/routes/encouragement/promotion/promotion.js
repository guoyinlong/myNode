/**
 * 文件说明：全面激励-晋升激励报告
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */

import {connect} from 'dva';
import PromotionInfoComponent2018 from './promotion2018'
import {getEncouragementInitYear} from '../../../utils/func.js'
import Cookie from 'js-cookie';
import Style from './promotion.less'
class PromotionInfo extends React.Component{

  init = (year) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'promotion/fetch',
      year
    })
  }

  componentDidMount() {
    const year = getEncouragementInitYear()-1;
    this.init(year)
  }
  render() {
    const {info, year, template} = this.props;
    return (
      <div 
        // className={Style.symbol_div}
     >
        {info && template == '2018' ?
          <PromotionInfoComponent2018
            adjust_mode={info.adjust_mode}
            new_post={info.new_post}
            old_post={info.old_post}
            remain_points={info.remain_points}
            year={year}
            onChange={this.init}
          />
          : null}

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
  const {info, template, year} = state.promotion;

  return {
    info,
    template,
    year,
    loading: state.loading.models.promotion,
  };
}

export default connect(mapStateToProps)(PromotionInfo)
