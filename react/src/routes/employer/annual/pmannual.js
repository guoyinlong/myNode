/**
 * 文件说明：项目经理查看成员年度考核结果页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-15
 */
import { connect } from 'dva';
import {Tabs,Table,Button} from  'antd'
const TabPane = Tabs.TabPane;
import DistInfo from '../../../components/employer/DistInfo'
import Style from '../../../components/employer/employer.less'
import tableStyle from '../../../components/common/table.less'
import exportExl from '../../../components/commonApp/exportExl'
import Cookie from 'js-cookie';
/**
 * 功能：项目经理查看成员年度考核结果
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-15
 */
class PmAnnual extends React.Component {
  state = {
    activeKey:'0'
  }
  columns = [
    {
      title: '序号',
      dataIndex: 'order',
      width:'30px',
      render: (text, row, index) => {
        return  <div>
                  <p style={{textAlign:'right'}}>{index+1}</p>
                </div>
      }
    },
    {
      title: '姓名',
      dataIndex: 'staff_name',
      width:'80px',
      render: (text, row, index) => {
        return <p>{text}</p>
      }
    },
    {
      title: '第一季度',
      dataIndex: 'rank_1',
      width:'35px',
      render: (text, row, index) => {
        return <div>
          {row.state_1 ? row.state_1 === '10' ? <p style={{textAlign:'center'}}>{text}</p> : '?'  :'-'}
        </div>
      }
    },
    {
      title: '第二季度',
      dataIndex: 'rank_2',
      width:'35px',
      render: (text, row, index) => {
        return <div>
          {row.state_2 ? row.state_2 === '10' ? <p style={{textAlign:'center'}}>{text}</p> : '?'  :'-'}
        </div>
      }
    },
    {
      title: '第三季度',
      dataIndex: 'rank_3',
      width:'35px',
      render: (text, row, index) => {
        return <div>
          {row.state_3 ? row.state_3 === '10' ? <p style={{textAlign:'center'}}>{text}</p> : '?'  :'-'}
        </div>
      }
    },
    {
      title: '第四季度',
      dataIndex: 'rank_4',
      width:'35px',
      render: (text, row, index) => {
        return <div>
          {row.state_4 ? row.state_4 === '10' ? <p style={{textAlign:'center'}}>{text}</p> : '?'  :'-'}
        </div>
      }
    },
    {
      title: '员工互评',
      dataIndex: 'mutualScore',
      width:'35px',
      render: (text, row, index) => {
        return <div>
          <p style={{textAlign:'right'}}>{text}</p>
        </div>
      }
    },
    {
      title: '得分',
      dataIndex: 'score',
      width:'35px',
      render: (text, row, index) => {
        return <div>
          <p style={{textAlign:'right'}}>{text}</p>
        </div>
      }
    },
    {
      title: '贡献度',
      dataIndex: 'cont_degree',
      width:'65px',
      render: (text, row, index) => {
        return  <div>
                  <p style={{textAlign:'right'}}>{text || ''}</p>
                </div>
      }
    },
    {
      title: '贡献度调整说明',
      dataIndex: 'adjust_reason',
      width: '20%',
      render: (text, row, index) => {
        return  <div>
                  <p style={{textAlign:'left'}}>{text}</p>
                </div>
      }
    },
    {
      title: '得分*贡献度',
      dataIndex: 'lastScore',
      width:'80px',
      render: (text, row, index) => {
        return <p style={{textAlign:'right'}}>{text}</p>
      }
    },
    {
      title: '考核评级',
      dataIndex: 'rank',
      width: '65px',
      render: (text, row, index) => {
        return <div>
                  <p style={{'width': '60px',textAlign:'center'}}>{text}</p>
                </div>
      }
    }
  ];
  /**
   * 功能：tabs标签点击事件
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-15
   * @param key 标签项索引
   */
  callback =(key) => {
    this.setState({
      activeKey:key
    })
    this.init(key);
  }

  /**
   * 功能：数据初始化
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-15
   * @param index 标签项索引
   */
  init = (index) =>{
    const {dispatch,projList} = this.props;
    for(var i = 0;projList && i < projList.length;i++){
      projList[i].scores = [];
    }
      dispatch({
        type:'pmannual/tabEmpScoreSearch',
        projList,
        index:index
      })

  }
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：分布结果导出
   */
  expExl=(key)=>{
    let tab=document.querySelector(`#table${key} table`)
    exportExl()(tab,'正态分布')
  }
  render() {
    const {year,projList,loading} = this.props;
    const {activeKey} = this.state;
    return (
      <div className={Style.wrap}>
        <div style={{float: 'left',marginTop: '-16px'}}>
          <div className={Style.distTitle}>
            <div>
              <h3><div>{year}年 团队成员 年度考核</div></h3>
            </div>
          </div>
        </div>
      <Tabs onChange={(key)=>this.callback(key)} type="card" defaultActiveKey={activeKey} style={{marginTop: '52px'}}>
        {projList.map((i) =>
          <TabPane tab={i.proj_name} key={i.key}>
            <div className={Style.div_dist_show} style={{marginTop: '-47px'}}>
              <Button onClick={(key) => this.expExl(i.key)}>导出</Button>
            </div>:null
            <div className={tableStyle.orderTable} id={'table' + i.key}>
            <Table id='table1' style={{width:'100%',marginTop: '-33px'}} size='small' bordered={true}
                   columns={this.columns} dataSource={i.scores} loading={loading} pagination={false}/>
            </div>
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
 * 创建日期：2018-01-15
 * @param state 状态树
 */
function mapStateToProps(state) {
  const { projList,year} = state.pmannual;
  if(projList && projList.length){
    projList.map((i,index)=>i.key=index)
  }
  return {
    projList,
    year,
    loading: state.loading.models.pmannual,
  };
}
export default connect(mapStateToProps)(PmAnnual)

