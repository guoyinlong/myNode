/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 文件说明：2018年首页信息模板
 */
import { Table } from 'antd'
import Style from './performance.less'
import Title from '../../../components/encouragement/Title'
import HUMAN from '../../../assets/Images/encouragement/pic05.png'
import TIXI from '../../../assets/Images/encouragement/pic18.png'
import Cookie from 'js-cookie'
import {waterMark,preventCopy,timeStamp,unLockCopy} from "../../../utils/func.js"
function getContent() {
  const text = <div>
                  <p className={Style.row}>公司搭建以项目制为核心的自主量化绩效管理体系，考核结果刚性应用，为员工提供公平、公正、透明的绩效激励，鼓励良性竞争，以推进绩效的持续提升，促进员工成长。</p>
              </div>
  return text;
}
const rankMap = {
  'A': '优秀',
  'B': '良好',
  'C': '称职',
  'D': '待改进',
  'E': '不及格',
  '-': '-',
}
const columns1 = [{
      title: '季度',
      key:'season',
      render: (text, row, index) => {
        return <p style={{textAlign:'center'}}>考核结果</p>
      }
    },{
      title: '第一季度',
      dataIndex: 'rank_season1',
      key: 'rank_season1',
      render: (text, row, index) => {
        return <div>
          <p className={Style.rank}>{text}</p>
          <p style={{textAlign:'center'}}>{rankMap[text]}</p>
        </div>
      }
    }, {
  title: '第二季度',
  dataIndex: 'rank_season2',
  key: 'rank_season2',
  render: (text, row, index) => {
    return <div>
      <p className={Style.rank}>{text}</p>
      <p style={{textAlign:'center'}}>{rankMap[text]}</p>
    </div>
  }
}, {
  title: '第三季度',
  dataIndex: 'rank_season3',
  key: 'rank_season3',
  render: (text, row, index) => {
    return <div>
      <p className={Style.rank}>{text}</p>
      <p style={{textAlign:'center'}}>{rankMap[text]}</p>
    </div>
  }
},{
  title: '第四季度',
  dataIndex: 'rank_season4',
  key: 'rank_season4',
  render: (text, row, index) => {
    return <div>
      <p className={Style.rank}>{text}</p>
      <p style={{textAlign:'center'}}>{rankMap[text]}</p>
    </div>
  }
}];
function getColumns(year) {
  return [
    {
      title: '年份',
      key:'year',
      render: (text, row, index) => {
        return <p style={{textAlign:'center'}}>考核结果</p>
      }
    },{
    title: year,
    dataIndex: 'rank_year',
    key: 'rank_year',
    render: (text, row, index) => {
      return <div>
        <p className={Style.rank}>{text}</p>
        <p style={{textAlign:'center'}}>{rankMap[text]}</p>
      </div>
    }
  }, {
    title: year-1,
    dataIndex: 'rank_year1',
    key: 'rank_year1',
    render: (text, row, index) => {
      return <div>
        <p className={Style.rank}>{text}</p>
        <p style={{textAlign:'center'}}>{rankMap[text]}</p>
      </div>
    }
  }, {
    title: year-2,
    dataIndex: 'rank_year2',
    key: 'rank_year2',
    render: (text, row, index) => {
      return <div>
        <p className={Style.rank}>{text}</p>
        <p style={{textAlign:'center'}}>{rankMap[text]}</p>
      </div>
    }
  },{
    title: year-3,
    dataIndex: 'rank_year3',
    key: 'rank_year3',
    render: (text, row, index) => {
      return <div>
        <p className={Style.rank}>{text}</p>
        <p style={{textAlign:'center'}}>{rankMap[text]}</p>
      </div>
    }
  },{
    title: year-4,
    dataIndex: 'rank_year4',
    key: 'rank_year4',
    render: (text, row, index) => {
      return <div>
        <p className={Style.rank}>{text}</p>
        <p style={{textAlign:'center'}}>{rankMap[text]}</p>
      </div>
    }
  }];
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 功能：2018年首页信息模板
 */
class PromotionInfoComponent extends React.Component {
  componentDidMount(){
    var myDate = new Date();
    let new_Date=timeStamp(myDate.getTime())
    let temp=`${Cookie.get('username')}${new_Date}`
    waterMark({watermark_txt:temp},this.performance_div)
    preventCopy()
  }

 componentWillUnmount(){
  unLockCopy()
 }
  render(){
    const { infoList,year,onChange }=this.props;
    infoList.forEach((i,index)=>{
      i.key = index;
    });
    return(
      <div className={Style.main} ref={(ref)=>this.performance_div=ref}>
        <Title title="绩效激励报告" year = {year} onChange={onChange} message={getContent()} imgSrc = {HUMAN}></Title>

        <div className={Style.middle}>
          <div className={Style.left}>
            <div className={Style.content}>
              <p className={Style.tip1}>{year}年，您的季度考核结果为：</p>
              <Table dataSource={infoList} columns={columns1} pagination={false}></Table>
              <p className={Style.tip3}>综合季度考核及员工职业素养<br/>评价，您的年度考核结果为：</p>
              <p className={Style.tip4}>{infoList && infoList.length ? infoList[0].rank_year : '-'}</p>
            </div>
          </div>
          <div className={Style.right}>
            <div className={Style.content}>
              <p className={Style.tip2}>近五年来，您的考核结果为：</p>
              <Table dataSource={infoList} columns={getColumns(year)} pagination={false}></Table>
            </div>
          </div>
        </div>



        <div className={Style.bottom}>
          <div className={Style.img_div}>
            <img className={Style.img} src={TIXI}/>
          </div>
        </div>

      </div>
    )
  }
}
export default PromotionInfoComponent;
