/**
 * 作者：王旭东
 * 创建日期：2019-9-2
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：没有激励信息时展示加油图片
 */

import Fighting from '../../../assets/Images/encouragement/fighting.gif'
import Style from '../recognized/recognized.less'

export default class NodataShow extends React.Component{
  render(){
    return (
      <div className={Style.noneShow}>
        {this.props.title || '您还没有激励信息，需要加油哦！'}
        <div>
          <img className={Style.imgFighting} src={this.props.impUrl || Fighting}/>
        </div>
      </div>
    )
  }
}
