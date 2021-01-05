/**
 * 文件说明：人力培训接口人-导入人岗（一般一年导入一次）
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-08-19
 **/
import React, { Component } from 'react';
import { connect } from "dva";
import { Button, Card, Form, Row, Select, Table, Input, message } from "antd";
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";
import ExcelPersonPost from "./ExcelPersonPost";
const { Option } = Select;
const FormItem = Form.Item;

class ImportPersonPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaveClickable: true,
      isSuccess: false,
      isSaveClickableEdit: true,
      isSuccessEdit: false,
      personPostDataList: [],
      ou_name: Cookie.get("OU"),
      user_id: Cookie.get("userid"),
      post_id: '100001',

      //显示：1：导入显示，2：查询显示，默认是查询显示
      showTablesDataFlag: '2',
      saveFlag: true,
      editVisiable: false,
      recordId:'',
      user_id_input: '',
      //批量删除
      selectedRowKeys: [],
      tempPostData: [],
    }
  }
  //查询本院人员岗位信息计划
  queryAllPostInfo = () => {

    this.setState({ isSaveClickableEdit: true });

    this.setState({
      showTablesDataFlag: 2,
    });
    const { dispatch } = this.props;
    let param = {
      arg_ou_id: Cookie.get('OUID'),
      arg_user_id: this.state.user_id_input,
    };
    if (this.state.user_id_input !== '' && this.isForam(this.state.user_id_input)) {
      param["arg_post_id"] = '';
      return new Promise((resolve) => {
        dispatch({
          //全院级必修课保存
          type: 'importPersonPost/allPostSearch',
          param,
          resolve
        });
      }).then((resolve) => {
        if (resolve === 'success') {
          this.setState({
            personPostDataList: this.props.allPostDataList,
          });
        }
        if (resolve === 'false') {
          error.message('查询失败');
        }
      }).catch(() => {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/importPersonPost'
        }));
      });
    } else if (this.state.user_id_input === '') {
      param["arg_post_id"] = this.state.post_id;
      return new Promise((resolve) => {
        dispatch({
          //全院级必修课保存
          type: 'importPersonPost/allPostSearch',
          param,
          resolve
        });
      }).then((resolve) => {
        if (resolve === 'success') {
          this.setState({
            personPostDataList: this.props.allPostDataList,
          });
        }
        if (resolve === 'false') {
          error.message('查询失败');
        }
      }).catch(() => {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/importPersonPost'
        }));
      });
    } else if (this.state.user_id_input !== '' && !this.isForam(this.state.user_id_input)) {
      message.error("用户ID需为0开头的7位数字，或者默认为空！");
      return;
    }
  };

  //更新状态
  updateVisible = (value) => {
    if (value === true) {
      this.setState({
        showTablesDataFlag: 1,
        saveFlag: false,
      });
    }
  };

  //培训计划批量导入保存
  saveAction = () => {
    this.setState({ isSaveClickable: false });

    const { dispatch } = this.props;
    let importUIPostDataDataList = this.props.importUIPostDataDataList;
    let importrequirePostDataList = this.props.importrequirePostDataList;
    let importframeworkPostDataDataList = this.props.importframeworkPostDataDataList;
    let importfrontPostDataList = this.props.importfrontPostDataList;
    let importbackPostDataList = this.props.importbackPostDataList;
    let importtestPostDataList = this.props.importtestPostDataList;
    let importsafePostDataList = this.props.importsafePostDataList;
    let importdevopsPostDataList = this.props.importdevopsPostDataList;
    /*非空校验*/
    if (importUIPostDataDataList.length < 1) {
      message.error('导入的UI设计岗位信息为空，请填写后提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (importrequirePostDataList.length < 1) {
      message.error('导入的需求产品设计岗位信息为空，请填写后提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (importframeworkPostDataDataList.length < 1) {
      message.error('导入的架构师（研发）岗位信息为空，请填写后提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (importfrontPostDataList.length < 1) {
      message.error('导入的前端开发岗位信息为空，请填写后提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (importbackPostDataList.length < 1) {
      message.error('导入的后端开发岗位信息为空，请填写后提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (importtestPostDataList.length < 1) {
      message.error('导入的测试岗位信息为空，请填写后提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (importsafePostDataList.length < 1) {
      message.error('导入的安全岗位信息为空，请填写后提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (importdevopsPostDataList.length < 1) {
      message.error('导入的运维岗位信息为空，请填写后提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    let train_person_post_id = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);

    /*封装批量导入信息 begin */
    let transferUIPostDataDataList = [];
    let transferrequirePostDataList = [];
    let transferframeworkPostDataDataList = [];
    let transferfrontPostDataList = [];
    let transferbackPostDataList = [];
    let transfertestPostDataList = [];
    let transfersafePostDataList = [];
    let transferdevopsPostDataList = [];

    importUIPostDataDataList.map((item) => {
      let tempData = {
        //用户名
        arg_import_id: item.loginname + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        //用户名
        arg_login_name: item.loginname,
        //注册方式
        arg_register_type: item.register_type,
        //注册状态
        arg_register_status: item.register_status,
        //更新者
        arg_update_person: item.update_person,
        //岗位信息
        arg_train_post_id: '100008',
        //培训批量导入ID
        arg_train_person_post_id: train_person_post_id,

      };
      transferUIPostDataDataList.push(tempData);
    });
    importrequirePostDataList.map((item) => {
      let tempData = {
        //用户名
        arg_import_id: item.loginname + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        //用户名
        arg_login_name: item.loginname,
        //注册方式
        arg_register_type: item.register_type,
        //注册状态
        arg_register_status: item.register_status,
        //更新者
        arg_update_person: item.update_person,

        //岗位信息
        arg_train_post_id: '100007',
        //培训批量导入ID
        arg_train_person_post_id: train_person_post_id,
      };
      transferrequirePostDataList.push(tempData);
    });
    importframeworkPostDataDataList.map((item) => {
      let tempData = {
        //用户名
        arg_import_id: item.loginname + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        //用户名
        arg_login_name: item.loginname,
        //注册方式
        arg_register_type: item.register_type,
        //注册状态
        arg_register_status: item.register_status,
        //更新者
        arg_update_person: item.update_person,
        //岗位信息
        arg_train_post_id: '100006',
        //培训批量导入ID
        arg_train_person_post_id: train_person_post_id,
      };
      transferframeworkPostDataDataList.push(tempData);
    });
    importfrontPostDataList.map((item) => {
      let tempData = {
        //用户名
        arg_import_id: item.loginname + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        //用户名
        arg_login_name: item.loginname,
        //注册方式
        arg_register_type: item.register_type,
        //注册状态
        arg_register_status: item.register_status,
        //更新者
        arg_update_person: item.update_person,
        //岗位信息
        arg_train_post_id: '100005',
        //培训批量导入ID
        arg_train_person_post_id: train_person_post_id,
      };
      transferfrontPostDataList.push(tempData);
    });
    importbackPostDataList.map((item) => {
      let tempData = {
        //用户名
        arg_import_id: item.loginname + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        //用户名
        arg_login_name: item.loginname,
        //注册方式
        arg_register_type: item.register_type,
        //注册状态
        arg_register_status: item.register_status,
        //更新者
        arg_update_person: item.update_person,
        //岗位信息
        arg_train_post_id: '100004',
        //培训批量导入ID
        arg_train_person_post_id: train_person_post_id,
      };
      transferbackPostDataList.push(tempData);
    });
    importtestPostDataList.map((item) => {
      let tempData = {
        //用户名
        arg_import_id: item.loginname + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        //用户名
        arg_login_name: item.loginname,
        //注册方式
        arg_register_type: item.register_type,
        //注册状态
        arg_register_status: item.register_status,
        //更新者
        arg_update_person: item.update_person,
        //岗位信息
        arg_train_post_id: '100003',
        //培训批量导入ID
        arg_train_person_post_id: train_person_post_id,
      };
      transfertestPostDataList.push(tempData);
    });
    importsafePostDataList.map((item) => {
      let tempData = {
        //用户名
        arg_import_id: item.loginname + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        //用户名
        arg_login_name: item.loginname,
        //注册方式
        arg_register_type: item.register_type,
        //注册状态
        arg_register_status: item.register_status,
        //更新者
        arg_update_person: item.update_person,
        //岗位信息
        arg_train_post_id: '100002',
        //培训批量导入ID
        arg_train_person_post_id: train_person_post_id,
      };
      transfersafePostDataList.push(tempData);
    });
    importdevopsPostDataList.map((item) => {
      let tempData = {
        //用户名
        arg_import_id: item.loginname + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
        //用户名
        arg_login_name: item.loginname,
        //注册方式
        arg_register_type: item.register_type,
        //注册状态
        arg_register_status: item.register_status,
        //更新者
        arg_update_person: item.update_person,
        //岗位信息
        arg_train_post_id: '100001',
        //培训批量导入ID
        arg_train_person_post_id: train_person_post_id,
      };
      transferdevopsPostDataList.push(tempData);
    });
    /*封装批量导入信息 end */


    return new Promise((resolve) => {
      dispatch({
        //全院级必修课保存
        type: 'importPersonPost/importPersonPostInfoSaveOperation',
        transferUIPostDataDataList,
        transferrequirePostDataList,
        transferframeworkPostDataDataList,
        transferfrontPostDataList,
        transferbackPostDataList,
        transfertestPostDataList,
        transfersafePostDataList,
        transferdevopsPostDataList,
        train_person_post_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isSaveClickable: false });
        this.setState({ isSuccess: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_index'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ isSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_index'
      }));
    });
  };

  //人员岗位调整提交
  saveActionEdit = () => {
    this.setState({ isSaveClickableEdit: false });

    const { dispatch } = this.props;

    let importUpdatePostDataList = this.state.tempPostData;

    /*封装批量导入信息 begin */
    let transferUpdatePostDataList = [];

    importUpdatePostDataList.map((item) => {
      let tempData = {
        //用户名
        arg_import_id: item.id,
        //用户名
        arg_login_name: item.loginname,
        //更新者
        arg_update_person: Cookie.get('username'),
        //岗位信息
        arg_train_post_id: item.train_post_id,
      };
      transferUpdatePostDataList.push(tempData);
    });
    /*封装更新信息 end */
    let paramData = {
      arg_post_id: this.state.post_id,
      arg_ou_id: Cookie.get('OUID'),
      arg_user_id: '',
    };


    return new Promise((resolve) => {
      dispatch({
        //全院级必修课保存
        type: 'importPersonPost/updatePersonPostInfoSaveOperation',
        transferUpdatePostDataList,
        paramData,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isSaveClickableEdit: false });
        this.setState({ editVisiable: false });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/importPersonPost'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ isSaveClickableEdit: true });
        this.setState({ editVisiable: false });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/importPersonPost'
      }));
    });
  };

  handlePostChange = (e) => {
    this.setState({
      post_id: e,
    });
  };

  //结束关闭
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_index'
    }));
  };

  //删除
  handleDelete = () => {
    const { dispatch } = this.props;
    const allPostDataList = this.props.allPostDataList;

    //多选岗位进行删除提交
    const selectedRowKeys = this.state.selectedRowKeys;
    let selectedItem = [];
    if (selectedRowKeys.length < 1) {
      message.error('请勾选需要批量删除的员工岗位');
      this.setState({
        isSubmitClickable: true
      })
      return;
    } else {
      for (let j = 0; j < allPostDataList.length; j++) {
        for (let i = 0; i < selectedRowKeys.length; i++) {
          let m = this.state.selectedRowKeys[i];
          if (m === allPostDataList[j].key) {
            selectedItem.push(allPostDataList[j]);
          }
        }
      }
    }

    let paramData = {
      arg_post_id: this.state.post_id,
      arg_ou_id: Cookie.get('OUID'),
      arg_user_id: '',
    };

    return new Promise((resolve) => {
      dispatch({
        type: 'importPersonPost/deletPersonPostOperation',
        paramData,
        selectedItem,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ selectedRowKeys: [] });
      }
      if (resolve === 'false') {
        message.error("批量删除失败！");
        this.setState({ selectedRowKeys: [] });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/importPersonPost'
      }));
    });

  };

  //输入用户id-校验
  isForam(idStr) {
    let result = idStr.match(/^[0](\d){6}$/);
    if (result === null) {
      return false;
    } else {
      return true;
    }
  };
  //修改
  gotoEdit = (value) => {
    this.setState({
      editVisiable: true,
      recordId: value
    })
  };

  //输入用户id
  handleIdChange = (e) => {
    this.setState({
      user_id_input: e.target.value
    });
  };

  //选择多个岗位进行删除
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  //选择修改的岗位
  itemSelect(value, value1) {
    let tempData = this.props.allPostDataList;
    let train_import_id = value.id;
    for(let i=0; i<tempData.length; i++){
      if(tempData[i].id === train_import_id){
        tempData[i].train_post_id = value1;
        break;
      }
    }
    this.setState({
      tempPostData : tempData
    });
  };

  person_post_columns = [
    { title: '序号', dataIndex: 'indexID', width: '5%', },
    { title: '用户名', dataIndex: 'loginname', width: '10%', },
    { title: '姓名', dataIndex: 'user_name', width: '10%', },
    { title: '所属单位', dataIndex: 'dept_name', width: '13%', },
    { title: '注册方式', dataIndex: 'register_type', width: '5%', },
    { title: '注册状态', dataIndex: 'register_status', width: '7%', },
    { title: '更新日期', dataIndex: 'update_time', width: '10%', },
    { title: '更新者', dataIndex: 'update_person', width: '7%', },
    { title: '邮箱', dataIndex: 'mail', width: '15%', },
    { title: '项目组', dataIndex: 'proj_name', width: '18%', },
  ];

  person_post_search_columns = [
    { title: '序号', dataIndex: 'indexID', width: '5%', },
    { title: '姓名', dataIndex: 'user_name', width: '7%', },
    { title: '所属单位', dataIndex: 'dept_name', width: '15%', },
    { title: '注册状态', dataIndex: 'register_status', width: '7%', },
    { title: '更新日期', dataIndex: 'update_time', width: '10%', },
    { title: '更新者', dataIndex: 'update_person', width: '7%', },
    { title: '邮箱', dataIndex: 'mail', width: '15%', },
    {
      title: '岗位', dataIndex: 'train_post', width: '10%',key:'train_post_temp',
      render:(text,record,index)=>{
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
          labelCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 9
            }
          },
          wrapperCol: {
            xs: {
              span: 24
            },
            sm: {
              span: 24
            }
          },
          style :{marginBottom:10}
        };
        const postList = this.props.postList;
    
        let postListData = '';
        if (postList !== undefined) {
          postListData = postList.map(item =>
            <Option key={item.train_post_id}>{item.train_post_name}</Option>
          );
        };
        return (
          this.state.editVisiable && record.id === this.state.recordId ? 
          <Form>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('train_post'+ record.key,{
                initialValue: record.train_post,
                rules: [
                  {
                    message: '请选择修改的岗位!'
                  },
                ],
              })(
                <Select style={{ width: '100%' }} id={index} onSelect={this.itemSelect.bind(this,record)} >
                  {postListData}
                </Select>
              )}
            </FormItem>
            </Form>
            :
            <Select style={{ width: '100%', color: '#000' }} id={index} defaultValue={record.train_post_id} disabled >
              {postListData} 
            </Select>
        );
      }
    },
    { title: '项目组', dataIndex: 'proj_name', width: '20%', },
    {
      title: '操作', dataIndex: '', width: '4%', key: 'x', render: (text, record) => (
        //状态分为（1、保存  2、提交审批中  3、审批完成   4、培训完成  5、课程结束）
        <span>

          {
            <span>
              <a onClick={() => this.gotoEdit(record.id)}>修改</a>
            </span>
          }
        </span>
      )
    },
  ];

  render() {
    const postList = this.props.postList;
    const allPostDataList = this.props.allPostDataList;

    let postListData = '';
    let initPostID = '测试岗';
    if (postList !== undefined) {
      postListData = postList.map(item =>
        <Option key={item.train_post_id}>{item.train_post_name}</Option>
      );
    };

    const ouList = this.props.ouList;
    let ouOptionList = '';
    if (ouList.length) {
      ouOptionList = ouList.map(item =>
        <Option key={item.OU}>{item.OU}</Option>
      );
    };

    const auth_ou = Cookie.get("OU");

    const importUIPostDataDataList = this.props.importUIPostDataDataList;
    const importrequirePostDataList = this.props.importrequirePostDataList;
    const importframeworkPostDataDataList = this.props.importframeworkPostDataDataList;
    const importfrontPostDataList = this.props.importfrontPostDataList;
    const importbackPostDataList = this.props.importbackPostDataList;
    const importtestPostDataList = this.props.importtestPostDataList;
    const importsafePostDataList = this.props.importsafePostDataList;
    const importdevopsPostDataList = this.props.importdevopsPostDataList;

    for (let i = 0; i < allPostDataList.length; i++) {
      allPostDataList[i].key = i;
      allPostDataList[i].indexID = i + 1;
    }
    const { selectedRowKeys } = this.state;

    //批量删除
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    var hasSelected = 0;
    if (selectedRowKeys) {
      hasSelected = selectedRowKeys.length > 0;
    }

    return (
      <div>
        <br /><br />
        <br />
        <div style={{ float: 'left' }}>

          <span> 组织单元： </span>
          <Select style={{ width: '15%' }} defaultValue={auth_ou} disabled={true}>
            {ouOptionList}
          </Select>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span> 岗位： </span>
          {this.state.user_id_input != '' ?
            <Select style={{ width: 160, color: '#DCDCDC' }} defaultValue={initPostID} onSelect={this.handlePostChange}>
              {postListData}
            </Select>
            :
            <Select style={{ width: 160}} defaultValue={initPostID} onSelect={this.handlePostChange}>
              {postListData}
            </Select>
          }
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span> 用户ID： </span>
              <Input style={{ width: '10%' }} onChange={this.handleIdChange} defaultValue={''} />

              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    
        <Button type="primary" onClick={this.queryAllPostInfo} disabled={this.state.isSaveClickable ? false : (this.state.isSuccess ? false : true)}>查询</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="/filemanage/download/needlogin/hr/person_post.xlsx" ><Button disabled={this.state.isSaveClickable ? false : (this.state.isSuccess ? false : true)}>{'人员岗位模板下载'}</Button></a>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {
                this.state.isSaveClickable ?
                  <ExcelPersonPost dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
                  : (this.state.isSuccess ?
                    <ExcelPersonPost dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
                    :
                    null
                  )
              }
              &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
            <br /> <br />
            <br />

            <Row span={2} style={{ textAlign: 'center' }}><h2>{this.state.ou_name + "人员岗位信息"}</h2></Row>
            <br />

            <Card>
              {
                this.state.showTablesDataFlag === 1 ?
                  <Table
                    columns={this.person_post_columns}
                    //dataSource={this.state.personPostDataList ? this.state.personPostDataList : this.props.importPersonPostInfoDataList}
                    dataSource={
                      this.state.post_id === '100001' ? importdevopsPostDataList : (
                        this.state.post_id === '100002' ? importsafePostDataList : (
                          this.state.post_id === '100003' ? importtestPostDataList : (
                            this.state.post_id === '100004' ? importbackPostDataList : (
                              this.state.post_id === '100005' ? importfrontPostDataList : (
                                this.state.post_id === '100006' ? importframeworkPostDataDataList : (
                                  this.state.post_id === '100007' ? importrequirePostDataList : (
                                    this.state.post_id === '100008' ? importUIPostDataDataList : null
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    }
                    pagination={true}
                    scroll={{ y: 400 }}
                  />
                  :
                  <div>
                    <span style={{ marginLeft: 8 }}>{hasSelected ? `已选中 ${selectedRowKeys.length}个岗位` : ''}</span>
                    <Button style={{ textAlign: 'center' }} type="primary" onClick={this.handleDelete} disabled={selectedRowKeys.length > 0 ? false : true}>批量删除</Button>
                    <br />
                    <Table
                      rowSelection={rowSelection}
                      columns={this.person_post_search_columns}
                      dataSource={allPostDataList}
                      pagination={false}
                      scroll={{ y: 400 }}
                    />
                  </div>
              }
            </Card>

            <br />

            <div style={{ textAlign: 'center' }}>
              <Button onClick={this.gotoHome} disabled={this.state.isSaveClickable ? false : (this.state.isSuccess ? false : true)}>关闭</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {
                this.state.editVisiable ? 
                <Button onClick={this.saveActionEdit} disabled={!this.state.isSaveClickableEdit}>{this.state.isSaveClickableEdit ? '保存并更新' : '正在处理中...'}</Button>
                :
                <Button onClick={this.saveAction} disabled={!this.state.isSaveClickable} disabled={this.state.saveFlag}>{this.state.isSaveClickable ? '保存并同步' : (this.state.isSuccess ? '已成功同步' : '正在处理中...')}</Button>
              }
            </div>
      </div>
        )
      }
    }
    
function mapStateToProps(state) {
  return {
          loading: state.loading.models.importPersonPost,
        ...state.importPersonPost
      };
    }
    
    ImportPersonPost = Form.create()(ImportPersonPost);
    export default connect(mapStateToProps)(ImportPersonPost);
