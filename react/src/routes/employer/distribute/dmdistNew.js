/**
 * 文件说明：部门负责人正态分布页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 */
import * as service from '../../../services/employer/empservices';
import {connect} from 'dva';
import {Tabs} from 'antd'
import message from '../../../components/commonApp/message'

const TabPane = Tabs.TabPane;
import Style from '../../../components/employer/employer.less'
import ToDistList from '../../../components/employer/ToDistListNew'
import Cookie from 'js-cookie';

/**
 * 功能：部门负责人正态分布
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 */
class DmDist extends React.Component {
    state = {
        activeKey: '0'
    }

    /**
     * 功能：tabs标签点击事件
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param key 标签项索引
     */
    callback = (key) => {
        this.setState({
            activeKey: key
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
    reset = (key) => {
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
    init = (index) => {
        const {dispatch, distList} = this.props;
        for (var i = 0; distList && i < distList.length; i++) {
            distList[i].scores = [];
            distList[i].rank = [];
        }
        dispatch({
            type: 'dmdist/tabEmpScoreSearch',
            distList,
            index: index
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
    submit = async (rankList, ratio) => {
        const {year, season, distList} = this.props
        const {activeKey} = this.state;
        let arg_params = {
            'arg_year': year,
            'arg_season': season,
            'arg_dept_name': distList[activeKey].dept_name,
            'arg_type': ratio.type,
            'arg_checker_id': Cookie.get('userid'),
            'arg_checker_name': Cookie.get('username'),
            'arg_rank_count': rankList.length,
            "rank": JSON.stringify(rankList),
            "ratio": JSON.stringify(ratio),
          
        };

        let subRes;
        /*if(distList[activeKey].type == '1'){
          subRes = await(service.dmCompEmpDistSubmit(arg_params));
        }else if(distList[activeKey].type == '2'){
          subRes = await(service.dmPMDistSubmit(arg_params));
        }else if(distList[activeKey].type == '3' || distList[activeKey].type == '4'){
          subRes = await(service.dmAllEmpDistSubmit(arg_params));
        }*/
        // 1


        try {
            if (ratio.type == '1' || ratio.type == '5') {//综合绩效员工 + 常设机构负责人
              if(ratio.type == '1'&&distList[activeKey].tabid=="16"){
               //debugger
                //subRes = await(service.dmAllEmpDistSubmit(arg_params));
                subRes = await(service.allCommissionDistributeNew(arg_params));
                
              }
                else{
                //debugger
                subRes = await(service.dmCompEmpDistSubmit(arg_params));
              }
            } else if (ratio.type == '2') {//关键岗位  ->本院核心岗
                subRes = await(service.psPMDistSubmit(arg_params));
            } else if (ratio.type == '3' || ratio.type == '4' ) {//项目绩效员工 + 所有员工 + 分院按部门/院的核心岗
                subRes = await(service.dmAllEmpDistSubmit(arg_params));
            } else if(ratio.type == '7' || ratio.type == '8'||ratio.type == '12'||ratio.type == '13'){  // 季度分院按部门的关键岗位员工  12 13 核心岗
                subRes = await(service.branchcoredistributepostbybranch(arg_params));
            } else if (ratio.type == '6') { // 事业部垂直管理的分院核心岗  改考核规则之后没有 6
                subRes = await(service.dmBranchPMDistSubmit(arg_params));
            } else if(ratio.type == '9'){   //  新加：归口部门核心岗
                subRes = await(service.dmBranchPMDistSubmit(arg_params));
            }else if(ratio.type == '10'&&distList[activeKey].tabid=="14"){   
              //debugger
              subRes = await(service.comMissionDistributeNew(arg_params));
            }
            else if(ratio.type == '11'&&distList[activeKey].tabid=="15"){  
              //debugger
              subRes = await(service.comMissionDistributeNew(arg_params));
            } 
        

            // 9 本院归口部门经理

            if (subRes && subRes.RetCode === '1') {
                message.success("提交成功！")
                this.reset(activeKey)
            } else {
               message.error(subRes?subRes.RetVal:"提交失败")
            }
        } catch (e) {
            message.error(e.message)
        }

    }

    render() {
        const {year, season, distList, keyTips, loading, disableFlag, rankNullFlag} = this.props;
        const {activeKey} = this.state;
        return (
            <div className={Style.wrap}>
                <Tabs onChange={(key) => this.callback(key)} type="card" defaultActiveKey={activeKey}
                      style={{paddingTop: "180px"}}>
                    {distList.map((i) =>
                        <TabPane tab={i.name} key={i.key}>
                            <ToDistList disableFlag={disableFlag} rankNullFlag={rankNullFlag} empList={i.scores}
                                        rankRatio={i.rank && i.rank[0]} reset={() => this.reset(i.key)}
                                        loading={loading}
                                        year={year} season={season} checker_info="部门经理" submit={this.submit}
                                        isAll={i.type == '3' || i.type == '4' ? 'true' : 'false'}
                                        score_has_null={i.score_has_null} tableID={i.key} keyTips={keyTips}
                                        dispatch={this.props.dispatch} tabid={i.tabid} dept_name={i.dept_name}
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
    const {distList, year, season, keyTips, disableFlag,rankNullFlag} = state.dmdist;
    if (distList.length) {
        distList.map((i, index) => i.key = index)
    }
    return {
        distList,
        keyTips,
        year,
        season,
        disableFlag,
      rankNullFlag,
        loading: state.loading.models.dmdist,
    };
}

export default connect(mapStateToProps)(DmDist)

