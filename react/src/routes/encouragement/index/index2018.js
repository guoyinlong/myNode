/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 文件说明：2018年首页信息模板
 */
import Cookie from 'js-cookie';
import Style from './index.less'
import Title from '../../../components/encouragement/Title'
import HUMAN from '../../../assets/Images/encouragement/pic01.03ec01ed.png'
import TIXI from '../../../assets/Images/encouragement/pic02.png'
import { getEncouragementInitYear,waterMark,preventCopy,timeStamp,unLockCopy} from '../../../utils/func.js'
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 功能：2018年首页信息模板
 */
class IndexInfoComponent extends React.Component {
  componentDidMount(){
    var myDate = new Date();
    let new_Date=timeStamp(myDate.getTime())
    let temp=`${Cookie.get('username')}${new_Date}`
    waterMark({watermark_txt:temp},this.index_div)
    preventCopy()
  }
  componentWillUnmount(){
    unLockCopy()
  }
  render(){
    const {year,month,day,message,deptName,staffName,age,postInfo,talentInfo}=this.props;
    const deptNameNow = Cookie.get('deptname')
    return(
      <div className={Style.main} ref={(ref)=>this.index_div=ref}>
        <Title title="院长寄语" message={message} imgSrc = {HUMAN}></Title>

        <div className={Style.middle}>
          <div className={Style.left}>
            <div className={Style.content} style={{height:'460px'}}>
              <p>尊敬的<span className={Style.line}>{staffName}</span>:</p>
              <p className={Style.row}>自您<span className={Style.line}>{year}</span>年<span className={Style.line}>{month}</span>月<span className={Style.line}>{day}</span>日
                加入中国联通软件研究院以来，已与我们一起经历了<span className={Style.line}>{age}</span>年同舟共济的日子。</p>
              <p className={Style.row}>您是<span className={Style.line}> {deptNameNow?deptNameNow:deptName} </span>的<span className={Style.line}> {postInfo?postInfo.post:''} </span>，
              {
                talentInfo.length>0?
                <span>是<span className={Style.line}> {talentInfo && talentInfo[0] ? talentInfo[0].name : ''} </span>，</span>
                :
                ''
              }对您所作出的贡献及以往的辛劳付出，我们衷心表示诚挚的感谢。我们将通过构建全面激励体系，跟您分享企业发展成果，展示您的个人价值。</p>
              <p className={Style.row}>对于全面激励体系，我们希望您能理解以下体系内涵：</p>
              <p className={Style.row}>为了回应员工多元化价值需求，赋予员工灵活选择权，显性化呈现员工获得的全部价值，整体提升员工感知, 我们建立并实施全面激励体系。</p>
              <p className={Style.row}>一是整合各类激励资源，构建包括晋升、绩效、培训、认可、荣誉、长期、福利七个子体系的全面激励体系。</p>
              <p className={Style.row}>二是实施弹性激励模式，基于激励子体系设置激励计划，向您授予激励积点，您可以通过弹性激励商城用激励积点灵活兑换福利产品。</p>
            </div>
          </div>
          <div className={Style.right}>
            <div className={Style.sumarize} style={{height:'460px'}}>
              <img className={Style.img2} src={TIXI}/>
              <p className={Style.row}>基于软研院全面激励体系，我们为您专属定制了全面激励报告，通过此报告，您能了解到您的基本信息，以及晋升、绩效、长期、荣誉、认可、培训、福利七大激励子体系中所获得的价值。</p>
              <p className={Style.row}>敬请详阅！</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default IndexInfoComponent;
