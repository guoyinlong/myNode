/**
 * 文件说明：干部管理-新增评审内容
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-11-21
 */
import React, {Component} from 'react';
import {routerRedux} from "dva/router";
import {connect} from "dva";
import styles from "./style.less";

import { Form, Row, Col, Input, Button , Select, Card, Icon, Tag, Tooltip, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class NewCommentInfoAdd extends Component {
  constructor (props) {
    super(props);
    this.state = {
      comment_add_type:'1',
      //修改选项
      tags: [],
      inputVisible: false,
      inputValue: '',
      isSubmitClickable:true,

    }
  }

  //选项内容修改
  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = input => (this.input = input);

  //结束关闭
  goBack = () => {
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'humanApp/appraise/commentInfo'
    }));
  }

  //提交新增评审内容信息
  handleOk = () =>{
    this.setState({
      isSubmitClickable: false
    });
    const{dispatch} = this.props;
    let formData = this.props.form.getFieldsValue();
    if(this.state.comment_add_type === '1' || this.state.comment_add_type === '2'){
      if( formData.commentAddName === '' || formData.commentAddName === undefined ){
        message.error("请填写评议内容名称！");
        this.setState({
          isSubmitClickable: true
        });
        return;
      }
      if( !this.state.tags || !this.state.tags[0] ){
        message.error("请添加内容名称！");
        this.setState({
          isSubmitClickable: true
        });
        return;
      }else if(this.state.comment_add_type === '1' && this.state.tags.length > 4 ){
        message.info("单项选择最多添加四个选项，请修改！");
        this.setState({
          isSubmitClickable: true
        });        
        return;
      }
      //封装修改的信息
      let transferAddCommentList = [];
      this.state.tags.map((item) => {
        let tempDatas ={
          arg_comment_info_type : this.state.comment_add_type,
          arg_comment_info_name : formData.commentAddName,
          arg_comment_info_checkbox_name : item,
        }
        transferAddCommentList.push(tempDatas);
      })
      return new Promise((resolve) => {
        dispatch({
          type:'manageAppraiseModel/addCommentInfo',
          transferAddCommentList,
          resolve
        });
      }).then((resolve) => {
        if(resolve === 'success')
        {
          message.info("新增成功！");
          this.setState({
            isSubmitClickable: true
          });
          dispatch(routerRedux.push({
            pathname:'/humanApp/appraise/commentInfo',
          }));
        }
        if(resolve === 'false')
        {
          message.error("新增出现了问题，请稍后！");
          this.setState({
            isSubmitClickable: false
          });
        }
      }).catch(() => {
        this.setState({
          isSubmitClickable: false
        });
      });
    }else{
      if( formData.commentAddName === '' || formData.commentAddName === undefined ){
        message.error("请填写评议内容名称！");
        this.setState({
          isSubmitClickable: true
        });
        return;
      }else{
        //封装修改的信息
        let transferAddCommentList = [];
          let tempDatas ={
            arg_comment_info_type : this.state.comment_add_type,
            arg_comment_info_name : formData.commentAddName,
            arg_comment_info_checkbox_name : '',
          }
          transferAddCommentList.push(tempDatas);

        return new Promise((resolve) => {
          dispatch({
            type:'manageAppraiseModel/addCommentInfo',
            transferAddCommentList,
            resolve
          });
        }).then((resolve) => {
          if(resolve === 'success')
          {
            message.info("新增成功！");
            this.setState({
              isSubmitClickable: true
            });
            dispatch(routerRedux.push({
              pathname:'/humanApp/appraise/commentInfo',
            }));
          }
          if(resolve === 'false')
          {
            message.error("新增出现了问题，请稍后！");
            this.setState({
              isSubmitClickable: true
            });
          }
        }).catch(() => {
          this.setState({
            isSubmitClickable: false
          });
        });
      }
    }
  };

  //选择新增类型：单项选择培训，多项选择，文本输入
  addType = (value)=>{
    this.setState({
      comment_add_type : value,
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { tags, inputVisible, inputValue } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>新增选人用人工作民主评议基础评议内容</h1></Row>
        <br/>
        <Form>
            <br/>
          <Card title="新增评议内容信息" className={styles.r}>
            {/* 评议培训类型 */}
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="请选择评议内容类型" hasFeedback {...formItemLayout}>
              {getFieldDecorator('commentAddType',{
                    initialValue:'1',
                    rules: [
                      {
                        required: true,
                        message: '请选择评议内容类型'
                      },
                    ],
                  })(
                    <Select placeholder="请选择类型" defaultValue='1' disabled={false} onChange={this.addType.bind(this)}>
                      <Option value="1">单项选择</Option>
                      <Option value="2">多项选择</Option>
                      <Option value="3">文本</Option>
                    </Select>
                )}                
              </FormItem>
            </Row>
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="请输入评议内容名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('commentAddName',{
                    initialValue:'',
                    rules: [
                      {
                        required: true,
                        message: '请输入评议内容名称'
                      },
                    ],
                  })(
                      <Input placeholder="请输入评议内容名称 " />
                    )}                
              </FormItem>
            </Row>
            {
              this.state.comment_add_type === '1' || this.state.comment_add_type === '2'
              ?
                <Row style={{ textAlign: 'center' }}>
                  <FormItem label='评议内容选项' {...formItemLayout}>
                    {
                    (
                      <div style={{ textAlign: 'left' }}>
                        {
                          tags.map((tag, index) => {
                            const isLongTag = tag.length > 200;
                            const tagElem = (
                              <Tag key={tag} closable={index >= 0} onClose={() => this.handleClose(tag)}>
                                {isLongTag ? `${tag.slice(0, 200)}...` : tag}
                              </Tag>
                            );
                            return isLongTag ? (
                              <Tooltip title={tag} key={tag}>
                                {tagElem}
                              </Tooltip>
                            ) : (
                              tagElem
                            );
                          })
                        }
                        
                        {
                          inputVisible && (
                            <Input
                              ref={this.saveInputRef}
                              type="text"
                              size="small"
                              style={{ width: 78 }}
                              value={inputValue}
                              onChange={this.handleInputChange}
                              onBlur={this.handleInputConfirm}
                              onPressEnter={this.handleInputConfirm}
                            />
                          )
                        }
                        {
                          !inputVisible && (
                            <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                              <Icon type="plus" /> 新增选项
                            </Tag>
                          )
                        }
                      </div>      
                    )}
                  </FormItem>
                </Row>
              :
                null
            }
            
            <br/>

              <Col span={24} style={{ textAlign: 'center' }}>
                <Button onClick={this.goBack}>{'取消'}</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" htmlType="submit" onClick={this.handleOk} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}</Button>
              </Col>
          </Card>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.manageAppraiseModel,
    ...state.manageAppraiseModel
  };
}

NewCommentInfoAdd = Form.create()(NewCommentInfoAdd);
export default connect(mapStateToProps)(NewCommentInfoAdd);
