/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 文件说明：2018年首页信息模板
 */
import Style from './promotion.less'
import Title from '../../../components/encouragement/Title'
import HUMAN from '../../../assets/Images/encouragement/pic03.png'
import TIXI from '../../../assets/Images/encouragement/pic04.png'
import { Tooltip } from 'antd'
import Cookie from 'js-cookie'
import {waterMark,preventCopy,timeStamp,unLockCopy} from "../../../utils/func.js"
function getContent(old_post,new_post,adjust_mode,remain_points) {
  const text = <div>
                  <p className={Style.row}>公司搭建了包括”两大体系、三种方式、九条路径“的晋升激励体系，为全体员工提供公平、公正、透明的晋升发展平台，每位员工发展机会均等，都能找到适合自己的发展方向。</p>
                  <p className={Style.row}>您上年度职级薪档为：<span className={Style.line}>{old_post}</span>，本年度职级薪档为：<span className={Style.line}>{new_post}</span>，职级薪档调整后剩余积分为：<span className={Style.line}>{remain_points}</span>，
                    您的职级薪档调整路径为：<span className={Style.line}>{adjust_mode}</span>。</p>
              </div>
  return text;
}
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 功能：2018年首页信息模板
 */
class PromotionInfoComponent extends React.Component {
  componentDidMount() {
    var myDate = new Date();
    let new_Date=timeStamp(myDate.getTime())
    let temp=`${Cookie.get('username')}${new_Date}`
    waterMark({watermark_txt:temp},this.promotion_div)
    preventCopy()
  }

  componentWillUnmount(){
    unLockCopy()
  }
  render(){
    const {year,old_post,new_post,adjust_mode,remain_points,onChange}=this.props;
    return(
      <div className={Style.main} ref={(ref)=>this.promotion_div=ref}>
        <Title title="晋升激励报告" year = {year} onChange={onChange} message={getContent(old_post,new_post,adjust_mode,remain_points)} imgSrc = {HUMAN}></Title>
        <div className={Style.bottom}>
          <div className={Style.img_div}>
            <div className={Style.imgReative} >
              <img className={Style.img} src={TIXI}/>
              <Tooltip placement="topLeft" title={<div><div>纳入骨干及以上人才队伍</div><div>人才年审“优秀”常速晋升</div><div>低于人才职称带宽</div></div>}>
                <div className={Style.img01}>

                </div>
              </Tooltip>
              <Tooltip placement="topLeft" title={<div>退出人才并因人才晋升过职级，下降一级</div>}>
                <div className={Style.img02}>

                </div>
              </Tooltip>
              <Tooltip placement="topLeft" title={<div><div>5年未晋升过职级</div><div>“称职”及以上</div></div>}>
                <div className={Style.img03}>

                </div>
              </Tooltip>
              <Tooltip placement="topLeft" title={<div><div>T1.1-1.2薪档达D档</div><div>T1.3及以上薪档达G档满两年</div><div>2017年考核“称职”及以上</div><div>连续两年考核“良好”及以上</div></div>}>
                <div className={Style.img04}>

                </div>
              </Tooltip>
              <Tooltip placement="topLeft" title={<div><div>分群体</div><div>10%左右</div></div>}>
                <div className={Style.img05}>

                </div>
              </Tooltip>
              <Tooltip placement="topLeft" title={<div><div>2017年度绩效考核等级为“不称职”</div><div>违纪违规</div></div>}>
                <div className={Style.img06}>

                </div>
              </Tooltip>
              <Tooltip placement="topLeft" title={<div>根据评分累计情况调整</div>}>
                <div className={Style.img07}>

                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default PromotionInfoComponent;
