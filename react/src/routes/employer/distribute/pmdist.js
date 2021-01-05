/**
 * 文件说明：项目经理正态分布
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 */
import * as service from '../../../services/employer/empservices';
import SearchUI from '../search/searchUI'
import { connect } from 'dva';
import {Tabs} from  'antd'
const TabPane = Tabs.TabPane;
import Style from '../../../components/employer/employer.less'
import ToDistList from '../../../components/employer/ToDistList'
import Cookie from 'js-cookie';
import message from '../../../components/commonApp/message'

/**
 * 功能：项目经理正态分布
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 */
function PmDist(SearchUI) {
  return class PmDist extends React.Component {
    state = {
      activeKey:'0',
      proj_id:''
    }

    /**
     * 功能：组件渲染完后执行操作
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     */
    componentDidMount(){
      this.init()
    }

    /**
     * 功能：父组件变化后执行操作
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     */
    componentWillReceiveProps(){
      this.init()
    }

    /**
     * 功能：数据初始化
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     */
    init(){
      const {projList} = this.props;
     // debugger
      if(projList && projList.length){
        this.setState({
          activeKey:'0',
          proj_id:projList[0].proj_id
        })
      }
    }

    /**
     * 功能：tabs标签点击事件
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param key 标签项索引
     */
    callback =(key) => {
      const {projList} = this.props;
      this.setState({
        activeKey:key,
        proj_id:projList[key].proj_id
      })
    }

    /**
     * 功能：正态分布数据重置
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     */
    reset  =(key)=>{
      const {dispatch,projList} = this.props;
      dispatch({
        type:'pmdist/pmEmpScoresSearch'
      })
      this.setState({
        activeKey:key,
        proj_id:projList[key].proj_id
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
      //debugger
      // const {dispatch} = this.props;
      const {year,season,projList} = this.props
      const {activeKey,proj_id} = this.state;
     //debugger
      // const {activeKey} = this.state;
      // dispatch({
      //   type:'pmdist/pmEmpDistSubmit',
      //   proj_id:proj_id,
      //   rankList,
      //   ratio
      // })


      let arg_params = {
        'arg_year':year,
        'arg_season':season,
        'arg_checker_id':Cookie.get('userid'),
        'arg_checker_name':Cookie.get('username'),
        "rank":JSON.stringify(rankList),
        "ratio":JSON.stringify(ratio),
        "arg_proj_id":proj_id?proj_id:projList[0].proj_id,//只有一个项目的时候可能会取不到项目id
      };
      try{
        let subRes = await(service.pmEmpDistSubmit(arg_params));

        if(subRes && subRes.RetCode === '1'){
          message.success("提交成功！")
          this.reset(activeKey);
        }else{
          message.error(subRes.RetVal)
        }
      }catch (e){
        message.error(e.message)
      }

    }

    render() {
      const {projList,year,season,loading} = this.props;
      const {activeKey} = this.state;
      return <div className={Style.wrap}>
        <Tabs onChange={(key)=>this.callback(key)} type="card" activeKey={activeKey} style={{paddingTop: '180px'}}>
          {projList.map((i) =>
            <TabPane tab={i.proj_name} key={i.key}>
              <ToDistList empList={i.scores} rankRatio = {i.rank && i.rank[0]} reset={()=>this.reset(i.key)} dispatch={this.props.dispatch} proid={i.proj_id}
                year={year} season={season} checker_info="项目经理" submit={this.submit} loading = {loading} score_has_null={i.score_has_null} tableID={i.key}
                />
          </TabPane>
          )}
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
  const { projList,year,season} = state.pmdist;
  if(projList.length){
    projList.map((i,index)=>i.key=index)
  }
  return {
    projList,
    loading: state.loading.models.pmdist,
    year,
    season
  };
}
export default connect(mapStateToProps)(PmDist(SearchUI))

