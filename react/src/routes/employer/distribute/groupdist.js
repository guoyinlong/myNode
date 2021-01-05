/**
 * 文件说明：小组长正态分布页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 */
import SearchUI from '../search/searchUI'
import * as service from '../../../services/employer/empservices';
import { connect } from 'dva';
import {Tabs} from  'antd'
import message from '../../../components/commonApp/message'
const TabPane = Tabs.TabPane;
import Cookie from 'js-cookie';
import Style from '../../../components/employer/employer.less'
import ToDistList from '../../../components/employer/ToDistList'

/**
 * 功能：小组长正态分布
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 */
function GroupDist(SearchUI) {
      return class GroupDist extends React.Component {
        state = {
          activeKey:'0',
        }

    /**
     * 功能：正态分布数据重置
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     */
    reset  =()=>{
      const {dispatch} = this.props;
      dispatch({
        type:'groupdist/groupEmpScoreSearch'
      })
    }

    /**
     * 功能：提交正态分布结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param rankList 员工正态分布结果
     * @param ratio 下季度考核余数
     */
    submit = async(rankList,ratio) =>{
      const {dispatch} = this.props;
      const {year,season,group_id} = this.props

      let arg_params = {
        'arg_year':year,
        'arg_season':season,
        'arg_group_id':group_id,
        'arg_type':'0',
        'arg_checker_id':Cookie.get('userid'),
        'arg_checker_name':Cookie.get('username'),
        'arg_rank_count':rankList.length,
        "rank":JSON.stringify(rankList),
        "ratio":JSON.stringify(ratio),
      };
      const subRes = await(service.groupEmpDistSubmit(arg_params));
      if(subRes.RetCode === '1'){
        message.success("提交成功！")
        dispatch({
          type:'groupdist/groupEmpScoreSearch',
        })
      }else{
        message.error(subRes.RetVal)
      }
    }

    render() {
      const {projList,year,season,rank,loading,score_has_null} = this.props;
      const {activeKey} = this.state;
      return <div className={Style.wrap}>
        <Tabs  type="card" defaultActiveKey={activeKey} style={{paddingTop: '180px'}}>
            <TabPane tab='小组成员' key={activeKey}>
              {rank?<ToDistList empList={projList} rankRatio = {rank[0]} reset={this.reset} loading = {loading}
                year={year} season={season} checker_info="小组长" submit={this.submit} score_has_null={score_has_null}
                />:
                <div>该项目暂未配置评级比例信息</div>}
          </TabPane>

        </Tabs>
      </div>
    }
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
  const { projList,year,season,group_id,rank,score_has_null} = state.groupdist;
  return {
    projList,
    loading: state.loading.models.groupdist,
    year,
    season,
    group_id,
    rank,
    score_has_null
  };
}
export default connect(mapStateToProps)(GroupDist(SearchUI))

