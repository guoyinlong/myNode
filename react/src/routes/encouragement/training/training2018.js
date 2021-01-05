/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 文件说明：2018年首页信息模板
 */

import {Avatar,Table} from 'antd'
import Style from './training.less'
import Title from '../../../components/encouragement/Title'
import HUMAN from '../../../assets/Images/encouragement/pic08.png'
import IMG from '../../../assets/Images/encouragement/pic09.png'
import MyList from './MyList'
import {waterMark,preventCopy,timeStamp,unLockCopy} from "../../../utils/func.js"
import Cookie from 'js-cookie'
function getContent() {
  const text = <div>
    <p className={Style.row}>公司整合院内院外、线上线下各种资源，建立基于战略传导机制和能力贯穿，搭建了全生命周期培训体系，根据不同的群体设置不同的课程，鼓励员工学习成长，不断进步。</p>
  </div>
  return text;
}
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 功能：2018年首页信息模板
 */
class TrainingInfoComponent extends React.Component {
  componentDidMount(){
    var myDate = new Date();
    let new_Date=timeStamp(myDate.getTime())
    let temp=`${Cookie.get('username')}${new_Date}`
    waterMark({watermark_txt:temp},this.training_div)
    preventCopy()
  }
  componentWillUnmount(){
    unLockCopy()
  }
  render(){
    const {info,year,onChange,trainName,courseList,isInternalTrainer}=this.props;
    // const data = [
    //   {
    //     title: '线下培训',
    //     content: ['某年某月的培训呢','某年某月的培训呢','某年某月的培训呢','某年某月的培训呢','某年某月的培训呢','某年某月的培训呢','某年某月的培训呢','某年某月的培训呢','某年某月的培训呢','某年某月的培训呢']
    //   },
    //   {
    //     title: '线上培训',
    //     content: ['某年某月的培训呢','某年某月的培训呢']
    //   },
    //   {
    //     title: '必修课',
    //     content: ['某年某月的培训呢','某年某月的培训呢']
    //   },
    //   {
    //     title: '选修课',
    //     content: ['某年某月的培训呢','某年某月的培训呢']
    //   },
    // ];

    return(
      <div className={Style.main} ref={(ref)=>this.training_div=ref}>
        <Title title="培训激励报告" year={year} onChange = {onChange} message={getContent()} imgSrc = {HUMAN}></Title>

        <div className={Style.middle}>
          <div className={Style.left}>
            <div className={Style.content} style={{overflow:'auto'}}>
              <p>{year}年，您的培训情况如下：</p>
              {
                courseList.length >= 1 ?
                courseList.map((item,index)=>{
                    // if (item[year] && item[2020] == year) {
                    return <p key={index+1}>{item.class_type ? "参加"+item.class_type+"：" : "参加"}<span className={Style.line}>{item.class_name || ''}</span>,属于{item.train_kind}</p>
                    // }
                })
                :
                ''
              }
            </div>
          </div>
          <div className={Style.right}>
            <div className={Style.content}>
              <p>{year}年，您作为新员工导师，辅导新员工：<span className={Style.line}>{info.stuNum|| ''}</span>人</p>
              <p>感谢您为辅导新员工付出的辛劳与汗水，<br/>
                新员工在软研院的茁壮成长，<br/>
                离不开您悉心的指导与耐心的解答，<br/>
                希望您再接再厉，为软研院培养人才继续贡献力量。</p>
              <p className={Style.tip}>本年度，您获得的培训积点为：<span className={Style.line}>{info.training_point|| ''}</span></p>
            </div>
          </div>
        </div>

        {
          trainName&&trainName.length !== 0 ?
            <div className={Style.bottom}>
              <MyList
                data={trainName}
              />
            </div>
            :
            ''
        }
      </div>
    )
  }
}
export default TrainingInfoComponent;
