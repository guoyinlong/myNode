/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 文件说明：封装保存/提交按钮
 */
import Cookie from 'js-cookie';
import Style from '../../../components/employer/employer.less'
import {Button,Popconfirm} from 'antd'
import message from '../../../components/commonApp/message'
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：保存/提交按钮组件
 */
class PageSubmit extends React.Component {

  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：保存操作
   */
  save  =() => {
    message.success("保存成功！")
  }
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：提交操作
   */
  submit =() => {
    message.success("提交成功！")
  }
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：取消提交操作
   */
  cancel =()=>{

  }
  render(){
    const{save,submit,title,subState,donotTips,hasSave,saveState} = this.props;
    return(
      <div className={Style.div_submit}>

        <Popconfirm title={title} onConfirm={submit?submit:this.submit} onCancel={this.cancel} okText="确定" cancelText="取消">
          <Button  type="primary" title={subState?'可提交':donotTips} disabled={subState != undefined && !subState}>提交</Button>
        </Popconfirm>
      </div>
    )
  }
}
export default PageSubmit;
