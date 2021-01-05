/**
 * 文件说明：中层指标评价页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-25
 */
import React from 'react'
import { routerRedux } from 'dva/router';
import Cookies from 'js-cookie'
import { connect } from 'dva';
import CheckUI from '../../../components/employer/checkUI'
import Style from '../../../components/employer/searchDetail.less'
import style from './progress.less'
/**
 * 功能：中层指标评价
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-25
 */
class LeaderValue extends CheckUI {
  constructor(props){
    super(props)
  }
  stateColor={
    1:'#FF7F24',
    2:'red',
    3:'#FF7F24',
    4:'#FF7F24',
    5:'#FF7F24',
    6:'red',
    7:'green'
  }
  stateMap={
    1:"待审核",
    2:"审核未通过",
    3:"待评价",
    4:"二级待审核",
    5:"评分待审核",
    6:"评分审核未通过",
    7:"评价完成"
  };
  thead=[
    {
      title:'序号',
      dataIndex:'key'
    },
    {
      title:'年度',
      dataIndex:'year'
    },
    {
      title:'部门名称',
      dataIndex:'dept_name',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title:'姓名',
      dataIndex:'staff_name'
    },
    {
      title:'状态',
      dataIndex:'state',
      render:(text, row, index)=>{
        if(row.level == '2' && text == '3'){
          return <div style={{color:'grey'}}>{row.checker_name + this.stateMap[text]}</div>;
        }
        return <div style={{color:this.stateColor[text]}}>{this.stateMap[text]}</div>
      }
    },
  ];
  /**
   * 功能：查询指标详情
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-10-25
   * @param record 中层考核记录
   * @param index 索引
   */
  rowClickHandle=(record, index, event)=>{
    const{staff_id,year,level,state}=record;
    const {dispatch,route}=this.props;

    dispatch(routerRedux.push({
      pathname:`/humanApp/leader/${route.name}/${route.name}Detail`,
      query:{
        staff_id,
        year,
        checker_id:Cookies.get('userid'),
        level,
        state
      }
    }));
  };

  /**
   * 功能：待评价列表
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-04
   */
  toValue = () =>{
    const{dispatch}=this.props;
    let query={
      flag:"0"
    }
    dispatch(routerRedux.push({
      pathname:'/humanApp/leader/value',query
    }));
  }
  /**
   * 功能：评价待审核列表
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-04
   */
  toCheck = () =>{
    const{dispatch}=this.props;
    let query={
      flag:"1"
    }
    dispatch(routerRedux.push({
      pathname:'/humanApp/leader/value',query
    }));
  }
  /**
   * 功能：待评价列表
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-04
   */
  valuedFinish = () =>{
    const{dispatch}=this.props;
    let query={
      flag:"2"
    }
    dispatch(routerRedux.push({
      pathname:'/humanApp/leader/value',query
    }));
  }
  /**
   * 功能：评价待审核列表
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-04
   */
  checkedFinish = () =>{
    const{dispatch}=this.props;
    let query={
      flag:"3"
    }
    dispatch(routerRedux.push({
      pathname:'/humanApp/leader/value',query
    }));
  }
  /**
   * 功能：审核通过记录查询
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-04
   */
  checkedSearch = () =>{
    const{dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/humanApp/leader/value'
    }));
  }

  render(){
    const {stage}=this.props;
    return(
      <div className={Style.wrap}>
        {stage && stage.count?
          <div className={style.progress}>
            <div className={style.left}>
              <div className={style.terminus}>开始</div>
              <div className={style.line}>
                <div></div>
              </div>
              {/*<div className={style.procedure + " "+ style.finish} onClick={this.checkedSearch}>审核完成 ({stage.count})</div>
              <div className={style.line}>
                <div></div>
              </div>*/}
            </div>


            {stage.hasSecond == true ?
              <div style={{"float":'left','marginTop':'-10px','width':'288px'}}>
                <div className={style.verticalLine}></div>

                <div className={style.line2}>
                  <div className={style.line}><div></div></div>
                  {stage.tovalue1 == 0 ?
                    <div className={style.procedure + " "+ style.finish} onClick={this.valuedFinish}>评价完成 ({stage.count1})</div>
                    :
                    <div className={style.procedure} onClick={this.toValue}>待评价 ({stage.tovalue1})</div>
                  }
                  <div className={style.line}><div></div></div>
                </div>

                <div className={style.line2}>
                  <div className={style.line}><div></div></div>
                  {stage.tovalue2 == 0 ?
                    <div className={style.procedure + " "+ style.finish} onClick={this.checkedFinish}>评价审核完成 ({stage.count2})</div>
                    :
                    <div className={style.procedure} onClick={this.toCheck}>评价待审核 ({stage.tovalue2})</div>
                  }
                  <div className={style.line}><div></div></div>
                </div>

                <div className={style.verticalLine} style={{"marginTop":"-118px", "float": "right"}}></div>
              </div>
              :
              <div style={{"float":'left','marginTop':'30px','width':'160px'}}>
                {stage.tovalue1 == 0 ?
                  <div className={style.procedure + " "+ style.finish} onClick={this.valuedFinish}>评价完成 ({stage.count})</div>
                  :
                  <div className={style.procedure} onClick={this.toValue}>待评价 ({stage.tovalue1})</div>
                }
              </div>
            }
            <div className={style.right}>
              <div className={style.line}>
                <div></div>
              </div>
              <div className={style.terminus}>结束</div>
            </div>

          </div>
          :null}
        <div  style={{"clear":'both'}}>
          {super.render()}
        </div>

      </div>
    )}




}
/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-25
 * @param state 状态树
 */
function mapStateToProps(state) {
  const { list,stage} = state.leaderValue;
  if(list.length){
    list.map((i,index)=>i.key=index+1)
  }
  return {
    list,
    stage,
    loading: state.loading.models.leaderValue,
  };
}
export default connect(mapStateToProps)(LeaderValue)
