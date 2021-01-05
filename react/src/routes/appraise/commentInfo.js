/**
 * 作者：翟金亭
 * 创建日期：2019-11-19
 * 邮箱：zhaijt3@chinaunicom.cn
 * 文件说明：干部管理-评议内容配置
 */
import React ,{Component} from 'react';
import {connect} from "dva";
import {routerRedux} from "dva/router";
import styles from './commentInfo.less';
import { Button, Table, Input, Spin, Icon, Form, Tabs, Modal, Popconfirm, Tag, Tooltip, message } from 'antd';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {TextArea} = Input;


class CommentInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //提交状态
      isSubmitClickable : true,
      //修改评议项model状态
      modalVisibleEdit: false,
      //修改项名称
      edit_id: '',
      comment_info_name: '',
      //评审内容类型
      commentInfoType : '',

      //修改选项
        tags: [],
        tags_temp:[],
        inputVisible: false,
        inputValue: '',
    };
  };

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

    //原评议内容展示
    old_comment_info_columns = [
      { title: '序号', dataIndex: 'index_id' },
      { title: '评议内容名称', dataIndex: 'comment_info_name' },
      { title: '评议类型', dataIndex: 'comment_info_type' },
      { title: '操作', dataIndex: 'option',
      render: (text,record) => (
        <span>
          <a onClick={()=>this.updateCommentInfo('edit',record)} >修改</a>
          -
          <Popconfirm title="确认删除本条评议内容吗?" onConfirm={() => this.deleteCommentInfo('delete',record)}>
            <a>删除</a>
          </Popconfirm>
        </span>
        )
      },
    ];

    //修改评议内容
    updateCommentInfo = (modalType, record) => {
      if(modalType==='edit'){
        this.setState({
          commentInfoType :record.comment_info_type,
          edit_id: record.comment_info_id,
          comment_info_name: record.comment_info_name,
          tags: record.comment_info_checkbox_name.split(','),
          tags_temp: record.comment_info_checkbox_name.split(',')
        });
        this.setState({
          modalVisibleEdit: true,
        });        
      }
    };
    
    //删除评议项
    deleteCommentInfo = (modalType, record) => {
      if(modalType==='delete'){
        const {dispatch} = this.props;
        let arg_comment_info_id = record.comment_info_id;

        return new Promise((resolve) => {
          dispatch({
            type:'manageAppraiseModel/deleteCommentInfo',
            arg_comment_info_id,
            resolve
          });
        }).then((resolve) => {
          if(resolve === 'success')
          {
            message.info("删除评议内容成功！");
            dispatch({
              type:'manageAppraiseModel/initCommentInfoQuery',
            });
          }
          if(resolve === 'false')
          {
            message.error("删除评议内容失败！");
          }
        }).catch(() => {
        });
      }
    };
    
    //刷新
    freshButton = () => {
      const {dispatch} = this.props;

      dispatch({
        type:'manageAppraiseModel/initCommentInfoQuery',
      });
    };

    //取消修改
    handleConcelEdit = () => {
      this.setState({
        modalVisibleEdit: false
      });
    };

    //提交修改
    handleOKEdit = () => {
      const {dispatch} = this.props;
      let formData = this.props.form.getFieldsValue();
      //封装修改的信息
      let transferUpdateCommentList = [];
      let comment_info_type = '';
      if(this.state.commentInfoType === '单项选择'){
        comment_info_type = '1';
      }else if(this.state.commentInfoType === '多项选择'){
        comment_info_type = '2';
      }else {
        comment_info_type = '3';
      }
      //修改的是选择题还是文本填写
      if( comment_info_type === '1' || comment_info_type === '2' ){

        if( formData.comment_info_name_edit === this.state.comment_info_name && this.state.tags === this.state.tags_temp ){
          message.error("评议名称或者评议选项需做修改！");
          return;
        }else if( comment_info_type === '1' && this.state.tags.length > 4 ){
          message.info("单项选择最多添加四个选项，请修改！");
          return;
        }else{
          this.state.tags.map((item) => {
            let tempDatas ={
              arg_comment_info_id : this.state.edit_id,
              arg_comment_info_type : comment_info_type,
              arg_comment_info_name : formData.comment_info_name_edit,
              arg_comment_info_checkbox_name : item,
            }
            transferUpdateCommentList.push(tempDatas);
          })
        }
      }else{
        if( formData.comment_info_name_edit === this.state.comment_info_name ){
          message.error("评议名称需做修改！");
          return;
        }else{
          let tempDatas ={
            arg_comment_info_id : this.state.edit_id,
            arg_comment_info_type : comment_info_type,
            arg_comment_info_name : formData.comment_info_name_edit,
            arg_comment_info_checkbox_name : '',
          }
          transferUpdateCommentList.push(tempDatas);
        }
      }

      return new Promise((resolve) => {
        dispatch({
          type:'manageAppraiseModel/updateCommentInfo',
          transferUpdateCommentList,
          arg_comment_info_id : this.state.edit_id,
          resolve
        });
      }).then((resolve) => {
        if(resolve === 'success')
        {
          message.info("修改成功！");
          this.setState({
            modalVisibleEdit: false
          });
          dispatch({
            type:'manageAppraiseModel/initCommentInfoQuery',
          });
        }
        if(resolve === 'false')
        {
          message.error("修改出现了问题，请稍后！");
          this.setState({
            modalVisibleEdit: false
          });
          dispatch({
            type:'manageAppraiseModel/initCommentInfoQuery',
          });
        }
      }).catch(() => {
        this.setState({
          modalVisibleEdit: false
        });
      });
    };

    //新增一项评议内容
    handleAdd = () => {
      const {dispatch} = this.props; 
      let query ={
        temp : ''
      }
      dispatch(routerRedux.push({
        pathname:'/humanApp/appraise/commentInfo/newCommentInfoAdd',
        query
      }));
    };


  render(){
    const { tags, inputVisible, inputValue, comment_info_name, commentInfoType } = this.state;

    const commentInfo = this.props.commentInfoDatas;
    if(commentInfo && commentInfo[0]){
      for(let i = 0; i<commentInfo.length; i++){
        commentInfo[i]["index_id"] = i+1;
        if(commentInfo[i].comment_info_type === '1'){
          commentInfo[i].comment_info_type = '单项选择'
        }else if(commentInfo[i].comment_info_type === '2'){
          commentInfo[i].comment_info_type = '多项选择'
        }else if(commentInfo[i].comment_info_type === '3'){
          commentInfo[i].comment_info_type = '文本填写'
        }
      }  
    }
    
    const formItemLayout = {
      labelCol: { span: 8},
      wrapperCol: { span: 12},
      style: {marginBottom: 8}
    };
    const { getFieldDecorator } = this.props.form;

    return (
      <Spin spinning={this.props.loading}>
        <div>
          &nbsp;&nbsp;
          <span>
            <span>共计 </span>
            <span style={{color: 'red', fontWeigh: 'bold'}}>{commentInfo.length}</span>
            <span> 条 评议项</span>
            </span>
            <span style={{float:'right'}}>
                <Button onClick={this.freshButton} type='primary'>
                    <Icon type="reload" />{'刷新'}
                </Button>
            </span>
          </div>
          <br/>
          <div style={{background: 'white', padding: '10px 10px 10px 10px'}}>
              <Tabs
                  defaultActiveKey = 't1'
              >
                  <TabPane tab= {new Date().getFullYear() + '年度选人用人工作民主评议基础评议内容'} key="t1">
                    <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                      新增评议项
                    </Button>
                    <div className={styles.titleBox}>
                      <Table
                        columns={this.old_comment_info_columns}
                        dataSource={commentInfo}
                        pagination={true}
                        width={'100%'}
                        bordered= {true}    
                      />                                  
                    </div>
                  </TabPane>
            </Tabs>
          </div>

          <Modal
            afterClose ={() => this.props.form.resetFields()}
            onOk={() => this.handleOKEdit()}
            onCancel={() => this.handleConcelEdit()}
            width={'70%'}
            minHeight={'70%'}
            visible={this.state.modalVisibleEdit}
            title={'修改'}
          >
            <FormItem label='评议内容名称' {...formItemLayout}>
              {getFieldDecorator('comment_info_name_edit', {
                  rules: [{
                    whitespace: true
                  }],
                  initialValue: comment_info_name
                })(
                  <TextArea
                    style={{ minHeight: 32 }}
                    rows={2}
                    disabled={false}
                  />
                )}
            </FormItem>
            {
              commentInfoType === '单项选择' || commentInfoType === '多项选择' 
              ?     
              <div>         
            <FormItem label='评议内容类型' {...formItemLayout}>
              { commentInfoType === '单项选择' 
                ?
                <span>{'单项选择类型'}</span>
                :
                ( commentInfoType === '多项选择'
                ?
                <span>{'多项选择类型'}</span>
                :
                null
                )
            }
            </FormItem>
            <FormItem label='评议内容选项' {...formItemLayout}>
              {
              (
                <div>
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
            </div>
            :
            <div>
            <FormItem label='评议内容类型' {...formItemLayout}>
              <span>{'文本输入类型'}</span>
            </FormItem>
            <FormItem label='评议内容选项' {...formItemLayout} >
              {getFieldDecorator('comment_info_checkbox_edit', {
                rules: [{
                  whitespace: true
                }],
                initialValue: ''
              })
              (
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder="此处为评审人填写内容，不可修改！"
                    rows={1}
                    disabled={true}
                  />   
              )}
            </FormItem>
            </div>
            }
          </Modal>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
    return {
      loading: state.loading.models.manageAppraiseModel,
      ...state.manageAppraiseModel
    };
  }

CommentInfo = Form.create()(CommentInfo);
export default connect(mapStateToProps)(CommentInfo);