/**
 * 作者：王旭东
 * 创建日期：2019-9-2
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：
 */

import { Col,Row,Icon} from 'antd'
import Style from './training.less'

export default class MyList extends React.Component {

  constructor(){
    super()
    this.state={
      data:[],

    }
  }

  render(){
    const { data } = this.props;
    const contentList = (data||[]).map((item,index)=>
        <div key={index.toString()}>
          <div>{item.title}</div>
          <div>{item.content.reduce(
            (result,item,index2)=>{
              result.push(
                <div key={index2.toString()} style={{display:'inline-block', marginRight: '20px' }}>
                  <Icon style={{ color: '#08c' }} type="check-square-o" />
                  <span>{item}</span>
                </div>)
              return result;
            },
            []
          )}</div>
        </div>
    )

    return <div className={Style.mylist}>{contentList}</div>
  }

}
