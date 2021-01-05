/**
 * 文件说明：中层考核-支撑满意度评价页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-25
 */
import React from 'react'
import { routerRedux } from 'dva/router';
import Cookies from 'js-cookie'
import { connect } from 'dva';
import Style from '../../../components/employer/employer.less'
import QuestionnaireRes from '../../../components/employer/QuestionnaireRes'

/**
 * 功能：中层考核-支撑满意度评价
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-25
 */
class Support extends React.Component {

  /**
   * 功能：查询指标详情
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-25
   * @param record 中层考核记录
   * @param index 索引
   */
  cardClickHandle=(record)=>{
    const{staff_id,year,state}=record;
    const {dispatch,route}=this.props;

    dispatch(routerRedux.push({
      pathname:`/humanApp/employer/support/${route.name}Detail`,
      query:{
        staff_id,
        year,
        state
      }
    }));
  };
  render(){
    const {list} = this.props;
    return (
      <div className={Style.wrap + ' ' +Style.support}>
        <div>
          <h3>支撑服务满意度评价</h3>
        </div>
        {list.map((item,index) =>
          <QuestionnaireRes {...item} cardClickHandle={() => this.cardClickHandle(item)}/>
        )
        }
      </div>
    )
  }
}
/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-25
 * @param state 状态树
 */
function mapStateToProps(state) {
  const { list} = state.support;
  if(list.length){
    list.map((i,index)=>i.key=index)
  }
  return {
    list,
    loading: state.loading.models.support,
  };
}
export default connect(mapStateToProps)(Support)
