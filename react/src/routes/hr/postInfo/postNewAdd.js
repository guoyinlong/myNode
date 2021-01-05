/**
 *  作者: 耿倩倩
 *  创建日期: 2017-08-17
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现组织单元职务添加功能
 */

import React from 'react'
import { Modal,Form,message,Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
/**
 * 作者：耿倩倩
 * 创建日期：2017-08-19
 * 功能：实现组织单元职务添加对话框功能
 */
class PostNewAdd extends React.Component{
  constructor(props){super(props)}
  state = { visible: false,
           postOption:undefined,
           postOptionList:[]
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：显示添加职务对话框
   */
  showModal = () => {
    let  postOptionListTemp = [];
    for (let i = 0; i < this.props.optionList.length; i++) {
      postOptionListTemp.push(<Option key={this.props.optionList[i].post_name}>{this.props.optionList[i].post_name}</Option>);
    }
    this.setState({
      postOption:undefined,
      visible: true,
      postOptionList:postOptionListTemp
    });
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：选择职务后点击确定按钮
   */
  handleOk = () => {
    let option_in_list = false;
    //判断新增加的职务是否已经出现在列表里面
    for(let i = 0; i<this.props.list.length;i++){
      if (this.props.list[i].post_name === this.state.postOption){
        option_in_list = true;
        break;
      }
    }
    if (option_in_list === true){
      this.setState({ visible: false});
      message.error("所选职务已经出现在列表中");
    }else{
      let postData = {};
      //获取选择的下拉菜单职务名称对应的职务名称ID,并作为请求参数
      for(let i=0;i<this.props.optionList.length;i++){
        if(this.props.optionList[i].post_name === this.state.postOption){
          postData['arg_op_postid'] = this.props.optionList[i].post_id;
          break;
        }
      }
      postData['arg_op_ouid'] = this.props.ouID;
      postData['current_ou_name'] = this.props.current_ou_name;
      const {dispatch} = this.props;
      dispatch({
        type:'hrPostInfo/newPostSend',
        param:postData
      });
      this.setState({ //关闭对话框
        visible: false
      });
    }
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：取消按钮
   */
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：选择职务后更新
   */
  newAddPost = (value) =>{
    this.setState({
      postOption:value
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 6
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 14
        }
      }
    };
    return (
      <div>
        <Modal
          title="职务新增"
          visible={this.state.visible}
          onOk={this.handleOk}
          okText = "确定"
          onCancel={this.handleCancel}
        >
          <Form className="login-form">
            <FormItem label="职务名称" {...formItemLayout}>
              <Select  style={{width: '100%' }} onSelect={this.newAddPost} value={this.state.postOption}>
                {this.state.postOptionList}
              </Select>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default PostNewAdd;
