/**
 * 作者：杨青
 * 日期：2018-3-6
 * 邮箱：yangq416@chinaunicom.cn
 * 文件说明：办公用品管理
 */
import React from 'react';
import {connect } from 'dva';
import {Table, Input, Button, Icon, Modal, message,  Select,  Divider,  Spin} from 'antd';
import style from './fundingPlanReport.less'//引用的科目管理的样式
const confirm = Modal.confirm; //确认框

class OfficeSuppliesMgt extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      filterDropdownVisible: false, //表头筛选下拉
      searchData: [], //表格数据,表头筛选用
      searchText: '', //搜索内容
      filtered: false,
      filteredInfo:null,
      visible: false, //新增弹窗开关
      visibleEdit: false, //编辑弹窗开关
      inputNew: '', //新增输入框内容
      inputEdit: '', //编辑时新的办公用品名称
      nameEdit: '', //编辑时旧的办公用品名称
      classificationEdit:'',//编辑时办公用品类别
      selectOption:[],
      selectNew:'',//新增选择办公用品类别
    };
  }

  //表格筛选搜索
  onInputChange = (e) => {
    this.setState({searchText: e.target.value});
  };
  //表格筛选搜索
  onSearch = () => {
    const{tableData} = this.props;
    const {searchText} = this.state;
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      filterDropdownVisible: false,
      searchData: tableData.map((record) => {
        const match = record.product_name.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
        };
      }).filter(record => !!record),
    });
  };
  /* == 新增功能 START== */
  //打开新增弹窗Model
  showModal = () => {
    const {typeList} = this.props;
    let selectOption =  typeList.map((key) => {
      return (
        <Option key={key.value}>
          {key.value}
        </Option>
      )
    });
    this.setState({
      visible: true,
      selectOption:selectOption,
    });
  };

  //新增输入框文本获取
  inputNew = (e) => {
    this.setState({
      inputNew: e.target.value
    })
  };

  //点击新增弹窗ok，提交新增数据
  handleOk = () => {
    const inputNew = this.state.inputNew;
    const classification= this.state.selectNew;
    if (classification==='') {
      message.error('请选择办公用品类型')
    }else if (inputNew===''){
      message.error('请填写办公用品名称')
    }else{
      this.setState({
        visible: false,
      });
      //将填写后的新增信息传给models层
      const {dispatch} = this.props;
      dispatch({
        type: 'officeSuppliesMgt/addOfficeProduct',
        inputNew,
        classification,
      });
      this.setState({
        inputNew: '',
        selectNew:'',
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
    console.log('record.product_name',record.product_name);
    this.setState({
      visibleEdit: true,
      classificationEdit: record.classification,
      nameEdit: record.product_name,
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
    const {inputEdit, classificationEdit, nameEdit} = this.state;
    const {dispatch} = this.props; //从props中得到表格原始数据

    /*注释: inputEdit为新名字；nameEdit为旧名称；classificationEdit为办公用品类别*/

    if (inputEdit===''){
      message.error('请填写办公用品名称')
    }else{
      dispatch({
        type: 'officeSuppliesMgt/modifyOfficeProduct',
        nameEdit,
        classificationEdit,
        inputEdit,
      });
      this.setState({
        visibleEdit: false,
        nameEdit: '',
        classificationEdit:'',
        inputEdit:'',
      })
      this.clearFilter();
    }
  };

  //点击编辑弹窗cancel
  handleCancelEdit = () => {
    this.setState({
      visibleEdit: false,
    });
  };
  /* == 编辑功能 START== */

  //科目删除
  showDeleteConfirm = (record) => { //删除确认框
    const {dispatch} = this.props; //从props中得到表格原始数据
    let productName = record.product_name;
    let classification = record.classification;
    confirm({
      title: '确认删除？',
      content: '要删除 ' + productName + ' 吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        //将要删除的数据传给models层
        dispatch({
          type: 'officeSuppliesMgt/deleteOfficeProduct',
          productName,
          classification,
        });
      },
      onCancel() {
        console.log('取消删除');
      },
    });
    this.clearFilter();
  };

  filterChange = (pagination,filters) => {
    this.setState({
      filteredInfo: filters,
    });
  }

  //清空条件
  clearFilter =()=>{
    this.setState({
      searchData:[],
      searchText:'',
      filteredInfo: null,
    });
  }
  //新增选择办公用品类型
  classificationSelect=(value)=>{
    this.setState({
      selectNew: value,
    })
  }

  render() {
    const {selectOption, searchData, inputNew, classificationEdit,inputEdit, visible, visibleEdit, selectNew} = this.state;
    let {filteredInfo} =this.state;
    const {tableData} = this.props;
    const {typeList} = this.props;
    //console.log('render', tableData);
    let data = [];
    if (searchData.length===0){
      data = tableData;
    }else{
      data = searchData;
    }

    filteredInfo = filteredInfo || {};
    //表格表头
    const columns = [{
      title: '序号',
      dataIndex: 'number',
      render: (text, record, index) => {
        return (index + 1)
      },
      width: 100,
    }, {
      title: '办公用品类型',
      dataIndex: 'classification',
      filters: typeList,
      key:'classification',
      filteredValue:filteredInfo.classification || null,
      onFilter:(value, record)=>record.classification.includes(value),
    }, {
      title: '办公用品名称',
      dataIndex: 'product_name',
      filterDropdown: (
        <div className={style.customFilterDropdown}>
          <Input
            ref={ele => this.searchInput = ele}
            value={this.state.searchText}
            onChange={this.onInputChange}
            onPressEnter={this.onSearch}
          />
          <Button type="primary" onClick={this.onSearch}>搜索</Button>
        </div>
      ),
      filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#FA7252' : null}} />,
      filterDropdownVisible: this.state.filterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          filterDropdownVisible: visible,
        });
      },
    }, {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <div>
            <Button className={style.margin05} size='small' onClick={() => this.showModalEdit(record)}>{'编辑'}</Button>
            <Button className={style.margin05} size='small' type="danger" ghost onClick={() => this.showDeleteConfirm(record)}>{'删除'}</Button>
          </div>)
      },
      width: 300,
    }];

    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={style.wrap}>
          <h2 style={{textAlign:'center',marginBottom:'10px'}}>办公用品管理</h2>
          <div style={{marginBottom: 16, overflow: 'hidden'}}>
            <div style={{float: 'left', marginLeft: 8, marginTop: 5}}>
              <Button type='primary' onClick={this.clearFilter} style={{marginBottom:'10px'}}>{'清空条件'}</Button>
            </div>
            <div style={{float: 'left', marginLeft: 8, marginTop: 5}}>
              <Button type='primary' onClick={this.showModal} style={{marginBottom:'10px'}}>{'新增'}</Button>
            </div>
            <Modal
              title="新增办公用品"
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p className={style.marginTB16}>
                <h3 style={{float:'left'}}>{'办公用品类型：'}</h3>
                <Select showSearch style={{ width: 320, float:'left'}} onChange={this.classificationSelect} placeholder="请选择办公用品类别" value={selectNew}>
                  {selectOption}
                </Select>
                <h3 className={style.marginTB16} style={{float:'left'}}>{'办公用品名称：'}</h3>
                <Input placeholder="请输入科目名称" onChange={this.inputNew} value={inputNew} className={style.marginTB16} style={{ width: 320, float:'left'}}/>
              </p>
            </Modal>
            <Modal
              title="编辑办公用品"
              visible={visibleEdit}
              onOk={this.handleOkEdit}
              onCancel={this.handleCancelEdit}
            >
              <p>
                <h3>办公用品类型：{classificationEdit}</h3>
                <h3 className={style.marginTB16} style={{float:'left'}}>{'办公用品名称：'}</h3>
                <Input placeholder="请编辑办公用品名称" onChange={this.editChange} value={inputEdit} className={style.marginTB16} style={{ width: 320, float:'left'}}/>
              </p>
            </Modal>
          </div>
          <Table columns={columns} dataSource={data} onChange={this.filterChange} className={style.financeTable}/>
        </div>
      </Spin>
    );
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.officeSuppliesMgt,
    ...state.officeSuppliesMgt
  };
}
export default connect(mapStateToProps)(OfficeSuppliesMgt);
