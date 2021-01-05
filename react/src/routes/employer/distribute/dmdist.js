/**
 * 文件说明：部门负责人正态分布页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 */
import * as service from '../../../services/employer/empservices';
import { connect } from 'dva';
import {Tabs} from  'antd'
import message from '../../../components/commonApp/message'
import config  from '../../../utils/config';
const TabPane = Tabs.TabPane;
import Style from '../../../components/employer/employer.less'
import ToDistList from '../../../components/employer/ToDistList'
import Cookie from 'js-cookie';

/**
 * 功能：部门负责人正态分布
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 */
class DmDist extends React.Component {
  state = {
    activeKey:'0'
  }

  /**
   * 功能：tabs标签点击事件
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * @param key 标签项索引
   */
  callback =(key) => {
    this.setState({
      activeKey:key
    })
    this.init(key);
  }

  /**
   * 功能：正态分布数据重置
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * @param key 标签项索引
   */
  reset  =(key)=>{
    const {activeKey} = this.state;
    this.init(activeKey);
  }

  /**
   * 功能：数据初始化
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * @param index 标签项索引
   */
  init = (index) =>{
    const {dispatch,distList} = this.props;
    for(var i = 0;distList && i < distList.length;i++){
      distList[i].scores = [];
      distList[i].rank = [];
    }
    if(distList[index].type == '1'){
      dispatch({
        type:'dmdist/deptCompEmpScoreSearch',
        distList,
        index:index
      })
    }else if(distList[index].type == '2'){
      dispatch({
        type:'dmdist/deptPMScoreSearch',
        distList,
        index:index
      })
    }else if(distList[index].type == '4'){
      dispatch({
        type:'dmdist/deptProjEmpScoreSearch',
        distList,
        index:index
      })
    }else if(distList[index].type == '3'){
      if(distList[index].dept_name.indexOf(config.OU_HQ_NAME_CN_PREFIX) != -1){
        //本部-全部员工，含项目经理和小组长
        dispatch({
          type: 'dmdist/deptAllEmpScoreSearch',
          distList,
          index:index
        });
      }else{
        //分院-只包含员工
        dispatch({
          type: 'dmdist/branchDeptOnlyEmpScoreSearch',
          distList,
          index:index
        });
      }
    }
  }

  /**
   * 功能：提交正态分布结果
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * @param rankList 员工正态分布结果
   * @param ratio 下季度考核余数
   */
  submit = async (rankList,ratio) =>{
    const {year,season,distList} = this.props
    const {activeKey} = this.state;
    let arg_params = {
      'arg_year':year,
      'arg_season':season,
      'arg_dept_name':distList[activeKey].dept_name,
      'arg_type':ratio.type,
      'arg_checker_id':Cookie.get('userid'),
      'arg_checker_name':Cookie.get('username'),
      'arg_rank_count':rankList.length,
      "rank":JSON.stringify(rankList),
      "ratio":JSON.stringify(ratio),
    };
    let subRes;
    if(distList[activeKey].type == '1'){
      subRes = await(service.dmCompEmpDistSubmit(arg_params));
    }else if(distList[activeKey].type == '2'){
      subRes = await(service.dmPMDistSubmit(arg_params));
    }else if(distList[activeKey].type == '3' || distList[activeKey].type == '4'){
      subRes = await(service.dmAllEmpDistSubmit(arg_params));
    }

    if(subRes && subRes.RetCode === '1'){
      message.success("提交成功！")
      this.reset(activeKey)
    }else{
      message.error("提交失败！")
    }
  }

  render() {
    const {year,season,distList,loading} = this.props;
    const {activeKey} = this.state;
    return (
      <div className={Style.wrap}>
      <Tabs onChange={(key)=>this.callback(key)} type="card" defaultActiveKey={activeKey} style={{paddingTop: '180px'}}>
        {distList.map((i) =>
          <TabPane tab={i.name} key={i.key}>
            <ToDistList empList={i.scores} rankRatio = {i.rank && i.rank[0]} reset={()=>this.reset(i.key)} loading = {loading}
                        year={year} season={season} checker_info="部门经理" submit={this.submit} isAll={i.type=='3' || i.type == '4' ? 'true': 'false'}
                        score_has_null={i.score_has_null} tableID={i.key}
            />
          </TabPane>
        )}
      </Tabs>
    </div>
    )
  }
}

/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * @param state 状态树
 */
function mapStateToProps(state) {
  const { distList,year,season} = state.dmdist;
  if(distList.length){
    distList.map((i,index)=>i.key=index)
  }
  return {
    distList,
    year,
    season,
    loading: state.loading.models.dmdist,
  };
}
export default connect(mapStateToProps)(DmDist)

