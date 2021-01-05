/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-31
 * 文件说明：正态分布组件，展示考核周期及分布群体信息
 */
import Style from './Title.less';
import { Select } from 'antd';
const Option = Select.Option;
import { getEncouragementInitYear} from '../../utils/func';

function getYearList(){
  const year = getEncouragementInitYear();
  let list = [];
  for( let i = 2018; i <= year;i++ ){
      list.push({"year":i.toString()});
  }
  return list;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-31
 * 功能：正态分布组件，展示考核周期及分布群体信息
 */
class Title extends React.Component {
  state = {
    isEdit:false,
    yearList:getYearList()
  }
  editHandle=()=>{
    this.setState({
      isEdit:true
    })
  }
  itemSelectChange = (e) =>{
    this.props.onChange(e);
    this.setState({
      isEdit:false
    })
  }
  itemSelect =(e)=>{
    this.setState({
      isEdit:false
    })
  }
  render(){
    const{title,message,imgSrc,year}=this.props;
    const { isEdit,yearList} = this.state;
    return(
      <div className={Style.top}>
        <div className={Style.title}>
          <div className={Style.tip}>
          {isEdit ?
            <Select className={Style.btnGroup}
                    defaultOpen = {true}
                    defaultValue={year?year.toString():''}
                    autoClearSearchValue = {true}
                    onChange={this.itemSelectChange}
                    onSelect={this.itemSelect}>

                    {yearList.map((i,index)=>
                          <Option key={index} value={i.year}>{i.year}</Option>)}
            </Select>
          :
            <span className={Style.yearSpan} onClick={this.editHandle}>{year}</span>
          }
          {title}</div>
          <img className={Style.img} src={imgSrc}/>
        </div>
        <div className={Style.message}>{message}</div>
      </div>
    )
  }
}
export default Title;
