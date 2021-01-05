/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 文件说明：2018年首页信息模板
 */
import Style from './honor.less'
import Title from '../../../components/encouragement/Title'
import Category from './Category';
import HUMAN from '../../../assets/Images/encouragement/pic12.png'
import IMG from '../../../assets/Images/encouragement/pic13.png'
import NodataShow from "../common/NodataShow";
import Cookie from 'js-cookie';
import {waterMark,preventCopy,timeStamp,unLockCopy} from "../../../utils/func.js"
function getContent() {
  const text = <div>
    <p className={Style.row}>根据集团及软研院的发展要求和管理导向，对在公司生产和发展过程中做出突出贡献的个人和团体进行表彰，通过荣誉激励体系给予兑现，公开肯定员工的贡献，充分调动全员主观能动性，增加员工的自豪感。</p>
  </div>
  return text;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * 功能：2018年首页信息模板
 */
class HonorInfoComponent extends React.Component {
  componentDidMount(){
    var myDate = new Date();
    let new_Date=timeStamp(myDate.getTime())
    let temp=`${Cookie.get('username')}${new_Date}`
    waterMark({watermark_txt:temp},this.honor_div)
    preventCopy()
  }
  componentWillUnmount(){
    unLockCopy()
  }
  render(){
    const {info,year,onChange}=this.props;
    const honorList = info.honors
    return(
      <div className={Style.main} ref={(ref)=>this.honor_div=ref}>
        <Title title="荣誉激励报告" year={year} onChange = {onChange} message={getContent()} imgSrc = {HUMAN}></Title>

        <div className={Style.middle}>
          <div className={Style.left}>
            <div className={Style.content}>
            {
              honorList&&honorList.length?
              honorList.map((honors,index) => {
                return <div key={index}>
                  <p style={{fontSize:'20px'}}>{honors.year}年，您的荣誉激励报告如下：</p>
                  {honors.data && honors.data.length ?
                    <div>
                      {honors.data.map((item,indexs) => {
                        return <div key={indexs} className={Style.classify}>
                          <div>{item.level}</div> 
                          <Category list ={item.data}/>
                        </div>
                      })}
                    </div>
                    :
                      ''
                  }
                </div>
              })
              :
              <NodataShow
                title={'您还没有荣誉激励信息，需要加油哦！'}
                imgUrl={'../../../assets/Images/encouragement/fighting.gif'}

              />
            }

            </div>
          </div>
          <div className={Style.right}>
            <div className={Style.content}>
              <p className={Style.first}>本年度，通过荣誉激励体系，</p><p>您共获得：</p>
              <p><span className={Style.line}>{info.honor_point|| '0'}</span>荣誉积点</p>
              <p><span className={Style.line}>{info.honor_reward|| '0'}</span>荣誉奖励</p>
              <p className={Style.first}>期待您在下一年里，</p>
              <p>不断发挥自身及团队的能动性,</p>
              <p>做出更多被国家、省部级、集团及软研院公开认可的贡献，</p>
              <p>与软研院共同进步。</p>
              <img className={Style.img} src={IMG}/>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default HonorInfoComponent;
