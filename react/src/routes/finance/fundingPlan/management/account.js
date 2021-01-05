/**
 * 作者：刘东旭
 * 日期：2018-03-06
 * 邮箱：liudx1006@chinaunicom.cn
 * 文件说明：资金计划-科目管理
 */
import React from 'react';
import {connect} from 'dva';
import {Table, Input, Button, Modal, message, Divider, Spin} from 'antd'
import style from './management.less'

const confirm = Modal.confirm; //确认框


class AccountManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [], //已选行
      filterDropdownVisible: false, //表头筛选下拉
      data: [], //表格数据,表头筛选用
      searchText: '', //搜索内容
      filtered: false,
      visible: false, //新增弹窗开关
      visibleEdit: false, //编辑弹窗开关
      visibleAdd: false, //添加弹窗开关
      inputNew: '', //新增输入框内容
      inputAdd: '', //添加输入框内容
      inputEdit: '', //编辑输入框内容
      nameAdd: '', //添加时展示一级科目名称
      nameEdit: '', //编辑时旧的科目名称
      parentIdEdit: '', //编辑时获取当前对象的parentId
    };

    //表格表头
    this.columns = [{
      title: '序号',
      dataIndex: 'number',
      render: (text, record, index) => {
        return (index + 1)
      },
      width: 100,
    }, {
      title: '科目名称',
      dataIndex: 'name',
      /*      filterDropdown: (
              <div className={style.customFilterDropdown}>
                <Input
                  ref={ele => this.searchInput = ele}
                  placeholder="关键字..."
                  value={this.state.searchText}
                  onChange={this.onInputChange}
                  onPressEnter={this.onSearch}
                />
                <Button type="primary" onClick={this.onSearch}>搜索</Button>
              </div>
            ),
            filterIcon: <Icon type="smile-o" style={{color: this.state.filtered ? '#108ee9' : '#aaa'}}/>,
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
              this.setState({
                filterDropdownVisible: visible,
              }, () => this.searchInput.focus());
            },*/
    }, {
      title: '科目级别',
      dataIndex: 'level',
    }, {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => {
        if (record.level === '一级') {
          return (
            <div>
              <Button className={style.margin05} size='small' onClick={() => this.showModalEdit(record)}>
                编辑
              </Button>
              <Button className={style.margin05} size='small' type="danger" ghost
                      onClick={() => this.showDeleteConfirm(record)}>
                删除
              </Button>
              <Button className={style.margin05} size='small' type="primary" ghost
                      onClick={() => this.showModalAdd(record)}>
                添加
              </Button>
            </div>)
        } else {
          return (
            <div>
              <Button className={style.margin05} size='small' onClick={() => this.showModalEdit(record)}>
                编辑
              </Button>
              <Button className={style.margin05} size='small' type="danger" ghost
                      onClick={() => this.showDeleteConfirm(record)}>
                删除
              </Button>
            </div>)
        }
      },
      width: 300,
    }];
  }

  /*  //表格筛选搜索
    onInputChange = (e) => {
      this.setState({searchText: e.target.value});
    };
    //表格筛选搜索
    onSearch = () => {
      const {searchText, data} = this.state;
      const reg = new RegExp(searchText, 'gi');
      this.setState({
        filterDropdownVisible: false,
        filtered: !!searchText,
        data: data.map((record) => {
          const match = record.name.match(reg);
          if (!match) {
            return null;
          }
          return {
            ...record,
            name: (
              <span>
                {record.name.split(reg).map((text, i) => (
                  i > 0 ? [<span className={style.highlight}>{match[0]}</span>, text] : text
                ))}
              </span>
            ),
          };
        }).filter(record => !!record),
      });
    };*/


  //已选行
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({selectedRows});
  };

  componentWillReceiveProps() {
    const {tableData} = this.props; //参与的项目
    this.setState({
      data: tableData,
    })
  }


  /* == 新增功能 START== */
  //打开新增弹窗Model
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  //新增输入框文本获取
  handleChange = (e) => {
    this.setState({
      inputNew: e.target.value
    })
  };

  //点击新增弹窗ok，提交新增数据
  handleOk = () => {
    const newInfo = this.state.inputNew;
    if (newInfo.match(/^[ ]*$/)) {  //正则判断字符串是否为空或空格
      message.warning('请正确填写科目名称！');
    } else {
      this.setState({
        visible: false,
      });
      //将填写后的新增信息传给models层
      const {dispatch} = this.props;
      dispatch({
        type: 'accountManagement/accountNew',
        newInfo,
      });
      this.setState({
        inputNew: ''
      })
    }
  };

  //点击新增弹窗cancel
  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.setState({
      inputNew: ''
    })
  };
  /* == 新增功能 END== */


  /* == 编辑功能 START== */
  //打开编辑弹窗Model
  showModalEdit = (record) => {
    this.setState({
      visibleEdit: true,
      inputEdit: record.name,
      nameEdit: record.name,
      parentIdEdit: record.parentId
    });
  };

  //编辑输入框文本获取
  editChange = (e) => {
    this.setState({
      inputEdit: e.target.value
    })
  };

  //点击编辑弹窗ok
  handleOkEdit = () => {
    const {inputEdit, nameEdit, parentIdEdit} = this.state;
    const {dispatch, tableData} = this.props; //从props中得到表格原始数据
    const fatherData = tableData.filter(item => parentIdEdit === item.id).map(item => item.name); //从原始数据中筛选出该二级对象所对应的一级对象并获取name
    const fatherName = fatherData[0]; //将得到的一级name数据格式由数组转为对象

    /*注释: inputEdit为新名字；nameEdit为旧名称；fatherName为父级名字*/
    if(inputEdit.match(/^[ ]*$/)){//第一位不是空格，其他位可以是空格
      message.info('科目名称不能为空！');
      return;
    }
    dispatch({
      type: 'accountManagement/accountEdit',
      nameEdit, inputEdit, fatherName
    });
    this.setState({
      visibleEdit: false,
      inputAdd: ''
    })
  };

  //点击编辑弹窗cancel
  handleCancelEdit = () => {
    this.setState({
      visibleEdit: false,
    });
  };
  /* == 编辑功能 START== */


  /* == 添加功能 START== */
  //打开添加弹窗Model
  showModalAdd = (record) => {
    this.setState({
      visibleAdd: true,
      nameAdd: record.name,
    });
  };

  //新增输入框文本获取
  handleOkChange = (e) => {
    this.setState({
      inputAdd: e.target.value
    })
  };

  //点击添加弹窗ok
  handleOkAdd = () => {
    const {inputAdd, nameAdd} = this.state;
    if(inputAdd.match(/^[ ]*$/)){//第一位不是空格，其他位可以是空格
      message.info('科目名称不能为空！');
      return;
    }
    this.setState({
      visibleAdd: false,
    });
    //将填写后的新增信息传给models层
    const {dispatch} = this.props;
    dispatch({
      type: 'accountManagement/accountAdd',
      inputAdd, nameAdd
    });
    this.setState({
      inputAdd: ''
    })
  };

  //点击弹窗cancel
  handleCancelAdd = () => {
    this.setState({
      visibleAdd: false,
    });
    this.setState({
      inputAdd: ''
    })
  };

  /* == 添加功能 END== */


  //科目删除，一级二级通用
  showDeleteConfirm = (record) => { //删除确认框
    const {dispatch, tableData} = this.props; //从props中得到表格原始数据
    const elementName = record.name; //当前对象的name
    const elementId = record.parentId; //当前对象为二级，取出该对象的父级id，parentId
    const fatherData = tableData.filter(item => elementId === item.id).map(item => item.name); //从原始数据中筛选出该二级对象所对应的一级对象并获取name
    const fatherName = fatherData[0]; //将得到的一级name数据格式由数组转为对象
    confirm({
      title: '确认删除？',
      content: '要删除 ' + elementName + ' 吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        //将要删除的数据传给models层
        dispatch({
          type: 'accountManagement/accountDeleteOne',
          elementName, fatherName
        });
      },
      onCancel() {
        console.log('取消删除');
      },
    });
  };

  render() {
    const {inputNew, inputAdd, inputEdit, nameAdd, visible, visibleEdit, visibleAdd} = this.state;
    const columns = this.columns;
    const {tableData} = this.props;

/*    const rowSelection = {
      selectedRows,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRows.length > 0;*/

    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={style.wrap}>
          <div style={{marginBottom: 16, overflow: 'hidden'}}>
            {/*            <div style={{float: 'left', marginLeft: 8, marginTop: 5}}>
              <Button type="danger" style={{marginRight: 16}} onClick={this.deleteAll}>批量删除</Button>
              {hasSelected ? `已选 ${selectedRows.length} 条` : '已选 0 条'}
            </div>*/}
            <Button type='primary' style={{float: 'right'}} onClick={this.showModal}>新增</Button>
            <Modal
              title="新增科目（一级）"
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p className={style.marginTB16}><Input placeholder="请输入科目名称" onChange={this.handleChange}
                                                     value={inputNew}/></p>
            </Modal>
            <Modal
              title="编辑科目"
              visible={visibleEdit}
              onOk={this.handleOkEdit}
              onCancel={this.handleCancelEdit}
            >
              <p className={style.marginTB16}><Input placeholder="请编辑科目名称" onChange={this.editChange}
                                                     value={inputEdit}/></p>
            </Modal>
            <Modal
              title="添加科目（二级）"
              visible={visibleAdd}
              onOk={this.handleOkAdd}
              onCancel={this.handleCancelAdd}
            >
              <h3 className={style.marginTB16}>一级科目名称：{nameAdd}</h3>
              <p><Input placeholder="请输入二级科目" onChange={this.handleOkChange} value={inputAdd}/></p>
            </Modal>
          </div>
          <Table columns={columns} dataSource={tableData} className={style.financeTable} />
          {/*<Table rowSelection={rowSelection} columns={columns} dataSource={tableData}/>*/}
          {/*<Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data}/>*/}
        </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  const {tableData} = state.accountManagement;
  return {tableData, loading: state.loading.models.accountManagement};

}

export default connect(mapStateToProps)(AccountManagement);
