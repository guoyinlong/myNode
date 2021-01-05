/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 文件说明：2018年首页信息模板
 */
import Style from './recognized.less'
import Title from '../../../components/encouragement/Title'
import HUMAN from '../../../assets/Images/encouragement/pic10.png'
import IMG from '../../../assets/Images/encouragement/pic11.png'
import NodataShow from '../common/NodataShow'
import {waterMark,preventCopy,timeStamp,unLockCopy} from "../../../utils/func.js"
import Cookie from 'js-cookie'
function getContent() {
  const text = <div>
    <p className={Style.row}>根据公司发展要求和管理导向，针对员工的工作过程及工作行为，搭建认可激励体系，承认员工的贡献并对员工的努力给予认可及肯定，并给予一定奖励，这些行为包括：忠诚行为、创新行为、分享行为及专注行为。</p>
  </div>
  return text;
}
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 功能：2018年首页信息模板
 */
class RecognizedInfoComponent extends React.Component {
  componentDidMount(){
    var myDate = new Date();
    let new_Date=timeStamp(myDate.getTime())
    let temp=`${Cookie.get('username')}${new_Date}`
    waterMark({watermark_txt:temp},this.recognized_div)
    preventCopy()
  }
  componentWillUnmount(){
    unLockCopy()
  }
  render(){
    const {info,year,onChange}=this.props;
    
    return(
      <div className={Style.main}  ref={(ref)=>this.recognized_div=ref}>
        <Title title="认可激励报告" year={year} onChange = {onChange} message={getContent()} imgSrc = {HUMAN}></Title>

        <div className={Style.middle}>
          <div className={Style.left}>
            <div className={Style.content}>
              <p>{year}年，您的认可激励报告如下：</p>
              <div className={Style.classify} style={{display: (!info.NT && !info.MSXJ)? 'none': 'block'}}>
                <div>忠诚行为</div>
                <div>
                  <p>为公司推荐人才并成功录取：<span className={Style.line}>{info.NT || '0'}</span>人</p>
                  <p>担任公司春招、秋招面试官、宣讲人共：<span className={Style.line}>{info.MSXJ|| '0'}</span>天</p>
                </div>
              </div>

              <div className={Style.classify} style={{display: (!info.ZL && !info.CXCGJ)? 'none': 'block'}}>
                <div>创新行为</div>
                <div>
                  <p>获得与工作领域相关的专利并得到集团技术部认定：<span className={Style.line}>{info.kwh|| '0'}</span>项</p>
                  <p>获得创新成果奖得到集团技术部认定：<span className={Style.line}>{info.CXCGJ|| '0'}</span>项</p>
                </div>
              </div>

              <div className={Style.classify} style={{display: (!info.NXSC && !info.XYGDS)? 'none': 'block'}}>
                <div>分享行为</div>
                <div>
                  <p>作为内部培训讲师对员工开展培训：<span className={Style.line}>{info.NXSC|| '0'}</span>小时</p>
                  <p>作为新员工导师指导新员工通过试用期转正：<span className={Style.line}>{info.XYGDS|| '0'}</span>人</p>
                </div>
              </div>

              <div className={Style.classify} style={{display: (!info.XSJ && !info.QKLW && !info.ZYRZ)? 'none': 'block'}}>
                <div>专注行为</div>
                <div>
                  <p>在专业领域学术上获得奖项：<span className={Style.line}>{info.XSJ|| '0'}</span>项</p>
                  <p>在专业领域学术上有相关论文著作发于各类期刊：<span className={Style.line}>{info.QKLW|| '0'}</span>次</p>
                  <p>获取与岗位工作一致的高级或中级专业认证：<span className={Style.line}>{info.ZYRZ|| '0'}</span>项</p>
                </div>
              </div>

              { JSON.stringify(info) === "{}"  ?
                <NodataShow
                  title={'您还没有认可激励信息，需要加油哦！'}
                  imgUrl={'../../../assets/Images/encouragement/fighting.gif'}
                />
                :
                ''
              }

            </div>
          </div>
          <div className={Style.right}>
            <div className={Style.content}>
              <p className={Style.first}>本年度，通过您的各类认可行为，</p><p>您共获得：</p>
              <p><span className={Style.line}>{info.recognized_point|| '0'}</span>认可积点</p>
              <p><span className={Style.line}>{info.recognized_reward|| '0'}</span>认可奖励</p>
              <p className={Style.first}>期待您在下一年里，</p>
              <p>能够做出更多忠诚、创新、分享、专注等符合集团、软研院战略及企业文化的认可行为,</p>
              <p>推进软研院自主研发能力不断提升。</p>
              <img className={Style.img} src={IMG}/>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
export default RecognizedInfoComponent;
