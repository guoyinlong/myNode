/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-25
 * 文件说明：正态分布余数信息展示
 */
import Cookie from 'js-cookie';
import {Table} from 'antd'
import Style from './employer.less'
const columns  = [
  {
    title:'',
    dataIndex:'name',
    width:'28%',
    render:(text,row,index)=>{
      return <p style={{color:'#333',fontWeight:'700'}}>{text}</p>

    }
  },
  {
    title:'A',
    dataIndex:'A',
    width:'18%',
    render:(text,row,index)=>{
      return <p style={{color:index=='4' && text <= -1?'red':'#4D7DC5'}}>{row['A+'] ? <span><span>{text}</span><span className={Style.key_count}>{'+'+row['A+']}</span></span> : text}</p>

    }

  },
  {
    title:'AB',
    dataIndex:'AB',
    width:'18%',
    render:(text,row,index)=>{
      return{
        children:<p style={{color:index=='4' && text <= -1?'red':'#4D7DC5'}}>{row['AB+'] ? <span><span>{text}</span><span className={Style.key_count}>{'+'+row['AB+']}</span></span> : text}</p>
      }
    }
  },
  {
    title:'C',
    dataIndex:'C',
    width:'18%',
    render:(text,row,index)=>{
      return{
        children:<p style={{color:'#4D7DC5'}}>{row['C+'] ? <span><span>{text}</span><span className={Style.key_count}>{'+'+row['C+']}</span></span> : text}</p>
      }
    }
  },
  {
    title:'DE',
    dataIndex:'D',
    width:'18%',
    render:(text,row,index)=>{
      return{
        children:<p style={{color:index=='4' && text >= 1?'red':'#4D7DC5'}}>{row['D+'] ? <span><span>{text}</span><span className={Style.key_count}>{'+'+row['D+']}</span></span> : text}</p>
      }
    }
  }
];
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-25
 * 功能：正态分布余数信息组件，展示评级比例、上季度余数、建议数量、实际数量、本季度余数
 */
class RemainderInfo extends React.Component {
  render(){
    const{tips,loading}=this.props;
    return(
      <div>
        <Table className={Style.remainder} size="small" bordered={true} columns={columns} dataSource={tips} loading={loading} pagination={false}/>
      </div>
    )
  }
}
export default RemainderInfo;
