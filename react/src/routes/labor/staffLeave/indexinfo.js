/**
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-04-25
 * 文件说明：离职信息模板
 */
import Style from './index.less'

class IndexInfoComponent extends React.Component {
  render(){
    const {year,month,day,deptName,staffName,age}=this.props;
    return(
      <div className={Style.main}>
            <div className={Style.content}>
              <p>尊敬的<span className={Style.line}>{staffName}</span>:</p>
              <p className={Style.row}>自您<span className={Style.line}>{year}</span>年<span className={Style.line}>{month}</span>月<span className={Style.line}>{day}</span>日
                加入中国联通软件研究院以来，已与我们一起经历了<span className={Style.line}>{age}</span>年同舟共济的日子。</p>
              <p className={Style.row}>对您在<span className={Style.line}>{deptName}</span>所作出的贡献及以往的辛劳付出，我们衷心表示认可。</p>
              <p className={Style.row}>对于您选择离开，我们深表遗憾！</p>
              <p className={Style.row}>对于您的前程，我们表示深切祝福！</p>
              <p className={Style.row}>请您站好最后一般岗，顺利完成交接工作。</p>
            </div>
          </div>
    )
  }
}
export default IndexInfoComponent;
