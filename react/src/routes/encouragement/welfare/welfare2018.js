/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 文件说明：2018年首页信息模板
 */
import Style from './welfare.less'
import Title from '../../../components/encouragement/Title'
import HUMAN from '../../../assets/Images/encouragement/pic16.png'
import IMG from '../../../assets/Images/encouragement/pic09.png'
import {waterMark,preventCopy,timeStamp,unLockCopy} from "../../../utils/func.js"
import Cookie from 'js-cookie'
function getContent() {
  const text = <div>
    <p className={Style.row}>为回应员工多元化价值主张，公司搭建了福利激励体系，涵盖员工健康、生活、医疗等各方面的需求，让员工在工作之外无后顾之忧，包括核心福利及可选福利。</p>
    <p className={Style.row}>核心福利为公司统一为员工配置及管理的福利，主要包括五险一金、补充医疗、特需医疗基金、带薪年假、各类补贴、员工体检等；</p>
    <p className={Style.row}>可选福利主要包括弹性福利、工会活动、企业文化活动等，弹性福利根据弹性激励体系的积点授予规则进行兑现，包括普惠性积点及差异性积点，依托弹性激励商城，您可自由兑现各类商品及服务。</p>
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
    waterMark({watermark_txt:temp},this.welfare_div)
    preventCopy()
  }
  componentWillUnmount(){
    unLockCopy()
  }

  render(){
    const { info,year,onChange }=this.props;
    return(
      <div className={Style.main}  ref={(ref)=>this.welfare_div=ref}>
        <Title title="福利激励报告" year = {year} onChange={onChange}  message={getContent()} imgSrc = {HUMAN}></Title>

        <div className={Style.middle}>
          <div className={Style.left}>
            <div className={Style.content}>
              <p>{year}年，您的核心福利项目如下：</p>
              <div className={Style.classify}>
                <div>五险一金</div>
                <div>
                  <p>公司为您投入社保五险共：<span className={Style.line}>{info.five_insurance}</span></p>
                  <p>公司为您投入住房公积金共：<span className={Style.line}>{info.hosing_fund}</span></p>
                </div>
              </div>
              <div className={Style.classify}>
                <div>关爱福利</div>
                <div>
                  <p>公司为您投入补充医疗共：<span className={Style.line}>{info.total_supplementary_medical}</span></p>
                  <p>公司为您投入特需医疗基金共：<span className={Style.line}>{info.special_medical_fund}</span></p>
                </div>
              </div>
              {
                Number(info["通信补贴"]) || Number(info["就餐补贴"]) || Number(info["绿色出行补贴"]) || Number(info["取暖费"]) || Number(info["防暑降温费"]) || Number(info["过节费"]) || Number(info["交通补贴"]) || Number(info["劳保费"]) || Number(info["独生子女费"]) || Number(info["体检"]) || Number(info["年节福利费"]) || Number(info["探亲费"]) || Number(info["其他福利补贴"]) ?
                  <div className={Style.classify}>
                    <div>福利补贴</div>
                    <div className={Style.welfare}>
                      {Number(info["通信补贴"]) ? <p>您获得的通信补贴共：<span className={Style.line}>{info["通信补贴"]}</span></p> : null}
                      {Number(info["就餐补贴"]) ? <p>您获得的就餐补贴共：<span className={Style.line}>{info["就餐补贴"]}</span></p> : null}
                      {Number(info["绿色出行补贴"]) ? <p>您获得的绿色出行补贴共：<span className={Style.line}>{info["绿色出行补贴"]}</span></p> : null}
                      {Number(info["取暖费"]) ? <p>您获得的取暖费用共：<span className={Style.line}>{info["取暖费"]}</span></p> : null}
                      {Number(info["防暑降温费"]) ? <p>您获得的防暑降温费共：<span className={Style.line}>{info["防暑降温费"]}</span></p> : null}
                      {Number(info["过节费"]) ? <p>您获得的过节费共：<span className={Style.line}>{info["过节费"]}</span></p> : null}
                      {Number(info["交通补贴"]) ? <p>您获得的交通补贴费共：<span className={Style.line}>{info["交通补贴"]}</span></p> : null}
                      {Number(info["劳保费"]) ? <p>您获得的劳保费共：<span className={Style.line}>{info["劳保费"]}</span></p> : null}
                      {Number(info["独生子女费"]) ? <p>您获得的独生子女费共：<span className={Style.line}>{info["独生子女费"]}</span></p> : null}
                      {Number(info["体检"]) ? <p>您获得的体检共：<span className={Style.line}>{info["体检"]}</span></p> : null}
                      {Number(info["年节福利费"]) ? <p>您获得的年节福利费共：<span className={Style.line}>{info["年节福利费"]}</span></p> : null}
                      {Number(info["探亲费"]) ? <p>您获得的探亲福利费共：<span className={Style.line}>{info["探亲费"]}</span></p> : null}
                      {Number(info["其他福利补贴"]) ? <p>您获得的其他福利补贴共：<span className={Style.line}>{info["其他福利补贴"]}</span></p> : null}
                    </div>
                  </div>
                  :
                  null
              }
            </div>
          </div>
          <div className={Style.right}>
            <div className={Style.content}>
              <p>{year}年，根据您的在职情况，您的可选福利项目：</p>
              <div className={Style.classify}>
                <div>基本积点</div>
                <div>
                  <p>根据{year}年软研院整体业绩状况及人工成本空间动态，你获得的基本积点为：<span className={Style.line}>{info.basic_point}</span></p>
                </div>
              </div>
              <div className={Style.classify}>
                <div>年龄积点</div>
                <div>
                  <p>您的年龄为：<span className={Style.line}>{info.age}</span>岁</p>
                  <p>你获得的年龄积点为：<span className={Style.line}>{info.age_point}</span></p>
                </div>
              </div>
              <div className={Style.classify}>
                <div>司龄积点</div>
                <div>
                  <p>您于<span className={Style.line}>{info.join_unicom_year}</span>年加入联通系统，于<span className={Style.line}>{info.join_ryy_year}</span>年加入软研院，你获得的司龄积点为：<span className={Style.line}>{info.company_age_point}</span></p>
                </div>
              </div>
              <div className={Style.classify}>
                <div>职级积点</div>
                <div>
                  <p>你的岗位职级为：<span className={Style.line}>{info.rank_sequence}</span></p>
                  <p>你获得的职级积点为：<span className={Style.line}>{info.rank_point}</span></p>
                </div>
              </div>
              <p className={Style.tip}>{year}年度，您获得的普惠性积点为：<span>{info.total_common_points}</span></p>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
export default TrainingInfoComponent;
