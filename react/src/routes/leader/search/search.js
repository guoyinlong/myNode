/**
 * 文件说明：中层指标查询页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-15
 */
import SearchUI from '../../employer/search/searchUI'
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

/**
 * 文件说明：中层指标查询页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-15
 */
class LeaderSearch extends SearchUI{
  /**
   * 功能：表格数据源
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-09-15
   */
  getHeader=()=>{
    return [
      {
        title:'序号',
        dataIndex:'key'
      },
      {
        title:'年度',
        dataIndex:'year'
      },
      {
        title:'单位',
        dataIndex:'ou',
        width:'25%',
        render:(text)=>{
          return text.split('-')[1]
        }
      },
      {
        title:'部门',
        dataIndex:'dept_name',
        width:'25%',
        render:(text)=>{
          return <p style={{textAlign:'left'}}>{text.split('-')[1]}</p>
        }
      },
      {
        title:'姓名',
        dataIndex:'staff_name',
      },
      {
        title:'状态',
        dataIndex:'state',
        render:(text)=>{
          //return this.stateMap[text]{}
          return <div style={{color:this.stateColor[text]}}>{this.stateMap[text]}</div>
        }
      },
      {
        title:'得分',
        dataIndex:'score'
      },
      {
        title:'考核结果',
        dataIndex:'rank'
      },
/*      {
        title:'中层互评得分(10%)',
        dataIndex:'remark'
      },*/
/*      {
        title:'总分',
        dataIndex:'id'
      }*/
    ]
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
  /**
   * 功能：考核记录单击事件，查询指标详情
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-09-15
   * @param record 考核记录
   * @param index 记录所有
   * @param event 对象
   */
  rowClickHandle=(record, index, event)=>{
    const{staff_id,staff_name,year}=record;
    const {dispatch}=this.props;
    let query={
      staff_id,
      staff_name,
      year
    }
    dispatch(routerRedux.push({
      pathname:'/humanApp/leader/search/detail',query
    }));


  };
  needSearch=['staff_name','dept_name'];

  /**
   * 功能：父组件变化后操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-09-15
   * @param nextProps 父组件参数
   */
  componentWillReceiveProps(nextProps){
    const {list}=nextProps
    if(list.length){
      let filter={key:'ou',filters: []}
      list.forEach(i=>{
        if(!filter.filters.length){
          filter.filters.push({text:i.ou.split('-')[1],value:i.ou})
        }else{
          if(!filter.filters.some(k=>k.value===i.ou)){
            filter.filters.push({text:i.ou.split('-')[1],value:i.ou})
          }
        }

      })
      if(!this.needFilter.some(i=>i.key===filter.key)){
        this.needFilter.push(filter)
      }

    }
    console.log(this.needFilter)
  }
}

/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-15
 * @param state 状态树
 */
function mapStateToProps(state) {
  const { list} = state.leaderSearch;
  if(list.length){
    list.map((i,index)=>i.key=index+1)
  }
  return {
    list:[...list],
    loading: state.loading.models.leaderSearch,
  };
}
export default connect(mapStateToProps)(LeaderSearch)

