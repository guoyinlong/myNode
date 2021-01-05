/**
 * 文件说明：全面激励-晋升激励报告
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */
import Style from './honor.less';
import {Tag} from 'antd';

function changeToNumber(str) {
  let sum = 0;
  for(let i = 0; i < str.length; i++){
    sum += str.charAt(i).charCodeAt();
  }
  return sum % 6;
}
const tagColorMap = {
  0: '#f50',
  1: '#2db7f5',
  2: '#87d068',
  3: '#108ee9',
  4: '#52c41a',
  5: '#f5222d',
};

class Content extends React.Component {
  render() {
    const {list} = this.props;
    return (
      <div>
        {list && list.length ?
          list.map((item, index) => {
            if(item){
              return <span key={index} style={{backgroundColor:tagColorMap[changeToNumber(item)]}} className={Style.name}>{item}</span>
            }else{
              return null
            }
          })
          : null}
      </div>
    )
  }
}
export default Content;
//<Tag color={tagColorMap[changeToNumber(item.content)]}>{item.content}</Tag>
//<span style={{color:tagColorMap[changeToNumber(item.content)]}} className={Style.name}>{item.content}</span>
