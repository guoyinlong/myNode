/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 文件说明：2018年首页信息模板
 */
import Style from './longterm.less'
import Title from '../../../components/encouragement/Title'
import HUMAN from '../../../assets/Images/encouragement/pic14.png'
import IMG from '../../../assets/Images/encouragement/pic15.png'
import NodataShow from "../common/NodataShow";
import Cookie from 'js-cookie'
import {waterMark,preventCopy,timeStamp,unLockCopy} from "../../../utils/func.js"
function getContent() {
  const text = <div>
    <p className={Style.row}>根据集团及软研院的发展要求和管理导向，通过长期激励体系激励员工与经营管理者共同努力，为公司更快更好的发展的贡献力量，软件研究院长期激励子体系包括企业年金激励与股权激励。</p>
  </div>
  return text;
}
function openInNewTab(url) {
  let win = window.open(url, '_blank');
  win.focus();
}
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 功能：2018年首页信息模板
 */
class LongtermInfoComponent extends React.Component {
  componentDidMount(){
    var myDate = new Date();
    let new_Date=timeStamp(myDate.getTime())
    let temp=`${Cookie.get('username')}${new_Date}`
    waterMark({watermark_txt:temp},this.longterm_div)
    preventCopy()
  }
  componentWillUnmount(){
    unLockCopy()
  }
  render(){
    const {info,year,onChange}=this.props;
    
    return(
      <div className={Style.main} ref={(ref)=>this.longterm_div=ref}>
        <Title title="长期激励报告" year = {year} onChange={onChange}  message={getContent()} imgSrc = {HUMAN}></Title>

        <div className={Style.middle}>
          <div className={Style.left}>
            {
              JSON.stringify(info)==='[]' || JSON.stringify(info)==='{}'?
                <div className={Style.content}>
                  <NodataShow
                    title={'您还没有长期激励信息，需要加油哦！'}
                    imgUrl={'../../../assets/Images/encouragement/fighting.gif'}
                  />
                </div>
                :
                <div className={Style.content}>
                  <p className={Style.first}>你于<span className={Style.line}>{info.company_annuity_join_year}</span>年，自愿加入企业年金计划</p>
                  <p>至今，您加入企业年金计划已<span className={Style.line}>{info.company_annuity_join_age}</span>年</p>

                  <p className={Style.first}>自加入企业年金计划始，</p>
                  <p>您每月向企业年金账户缴纳个人社保基数的1.75%，</p>
                  <p>公司每月向您的企业年金账户缴纳个人社保基数的7%。</p>

                  <p className={Style.first}>作为补充养老保险，</p>
                  <p>企业年金账户中的金额将在您退休时可以办理领取。</p>

                  <p className={Style.first}>{year}年，您个人支付企业年金：<span className={Style.line}>{info.occupational_pension_personal}</span>元，</p>
                  <p>企业为您支付企业年金：<span className={Style.line}>{info.occupational_pension_company}</span>元。</p>

                  <p className={Style.first}>企业年金个人补缴：<span className={Style.line}>{info.occupational_pension_add_personal}</span>元，企业为您补缴<span className={Style.line}>{info.occupational_pension_add_company}</span>元。</p>
                  <p className={Style.first}>因缴费比例调整（个人：1%-1.75%；企业：4%-7%）带来的企业年金补缴已在2020年3月完成；2020年预计完成企业年金建账前员工在系统内原单位的补缴。</p>
                  <div className={Style.link}>
                    <p>关于企业年金的更多详情，请查询：</p>
                    <p onClick={() =>openInNewTab("http://www.boc.cn/")}>http://www.boc.cn/</p>
                  </div>

                </div>
            }

          </div>
          <div className={Style.right}>
            <div className={Style.content}>
              <p>期待您在未来的时间里，</p>
              <p>继续与软研院共同成长，共同进步，</p>
              <p>荣辱与共，风雨同舟，</p>
              <p>您的每一分努力和贡献都是推进软研院</p>
              <p>自主研发能力提升不可或缺的力量。</p>
              <img className={Style.img} src={IMG}/>
            </div>
          </div>
        </div>


      </div>
    )
  }
}
export default LongtermInfoComponent;
