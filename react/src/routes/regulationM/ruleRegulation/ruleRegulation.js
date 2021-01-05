/**
  * 作者： 卢美娟
  * 创建日期： 2018-06-13
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 规章制度上传
  */

import React from 'react';
import { connect } from 'dva';
import { Table,  Menu, Icon, DatePicker,Modal,Popconfirm,message,Tooltip,Button,Input,Upload,Pagination,Select,Cascader,Spin } from 'antd';
const Search = Input.Search;
import moment from 'moment';;
import { routerRedux } from 'dva/router';
import styles from './regulationM.less';
import  './youtest.css';

const fileAddress = '/filemanage/filedownload?fileIdList=';
// const fileadvAddress = '/filemanage/filedownload?advancedFileIdList=';
const fileadvAddress = '/filemanage/filedownload';

const levelContent = [{text:'国家级',value:'国家级'},{text:'集团级',value:'集团级'},{text:'院级',value:'院级'},{text:'分院级/部门级',value:'分院级/部门级'}]
const kindContent = [{text:'制度',value:'制度'},{text:'流程',value:'流程'},{text:'操作手册',value:'操作手册'},{text:'其他',value:'其他'}]
const monthFormat = 'YYYY-MM-DD';

const role0 = 'fd2030c37dea11e8a340008cfa042288'; //平台管理员
const role1 = 'fd202e577dea11e8a340008cfa042288'; //平台子管理员
const role2 = 'fd2035157dea11e8a340008cfa042288'; //超级观察员
const role3 = 'fd2026457dea11e8a340008cfa042288'; //部门规章制度管理员

class RuleRegulation extends React.Component{

  state = {
    selectedRowKeys: [],
    loading: false,
    filterDropdownVisible: false,
    filterDropdownDocVisible: false,
    data: [],
    searchText: '', //标题
    searchDocNum: '', //发文文号
    searchKeyword: '', //关键字
    // startTime:moment().format('YYYY-MM-DD'), //印发开始时间
    // endTime:moment().format('YYYY-MM-DD'),  //印发结束时间
    startTime: '',
    endTime: '',
    filtered: false,
  }

  disabledDate2 = (current) => {return current.valueOf() > Date.now();}

  componentWillMount(){
    this.setState({
      data:this.props.regulationList,
    })
    // window.location.replace('/adminApp/regulationM/ruleRegulation');
    // location.reload();
  }

  componentDidMount=()=>{
    this.setState({
      data:this.props.regulationList,
    })
  }

  batchDownload = () =>{
    const {dispatch} = this.props;

    var advancedFileIdList = {};
    for(let i = 0; i < this.state.selectedRowKeys.length; i++){
      dispatch({
        type: 'ruleRegulation/regulationDownload',
        arg_regulation_id: this.props.regulationList[i].id
      })
      var m = this.state.selectedRowKeys[i];
      var downloadItem = [];
      downloadItem.push(this.props.regulationList[m].main_fileid);
      if(this.props.regulationList[m].attachments){
        var attachmentArr = JSON.parse(this.props.regulationList[m].attachments);
        for(let j = 0; j < attachmentArr.length; j++){
          downloadItem.push(attachmentArr[j].fileid);
        }
      }
      advancedFileIdList[`${m} - ${this.props.regulationList[m].title}`] = downloadItem;
    }

    var data = {
      advancedFileIdList: JSON.stringify(advancedFileIdList),
    }
    dispatch({
      type: 'ruleRegulation/filegetzippath',
      data,
    })



    // // let url = fileadvAddress + encodeURI(JSON.stringify(advancedFileIdList))
    // let url = fileadvAddress;
    // var xhr = new XMLHttpRequest();
    // console.log("222222222222");
    // console.log(advancedFileIdList);
    // console.log(JSON.stringify(advancedFileIdList));
    //
    // // var data = new FormData();
    // // data.append('advancedFileIdList': advancedFileIdList);
    // var data = new FormData();
    // data.append('advancedFileIdList', advancedFileIdList);
    //
    //       xhr.open('POST', url, true);    //也可以使用POST方式，根据接口
    //
    //       xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    //       xhr.responseType = "blob";   //返回类型blob
    //       xhr.onload = function () {
    //       //定义请求完成的处理函数
    //       if (this.status === 200) {
    //               var blob = this.response;
    //               if(blob.size>0){
    //                   var reader = new FileReader();
    //                   reader.readAsText(blob);   // 转换为base64，可以直接放入a标签href
    //                   reader.onload = function (e) {
    //
    //                       // window.open(e.target.result)
    //                       // 转换完成，创建一个a标签用于下载
    //                       var a = document.createElement('a');
    //
    //                       a.download = '文件名.zip';
    //                       a.href = e.target.result;
    //                       // $("body").append(a);    // 修复firefox中无法触发click
    //                       document.getElementById('root').append(a)
    //                       a.click();
    //                       // $(a).remove();
    //                       // document.getElementById('a').remove();
    //                       // window.location.reload();
    //                   }
    //               }else{
    //                   window.location.reload();
  	// 			        }
    //           }
    //       };
    //       xhr.send(data);

    // window.location.assign(url);
    // window.open(url);
    // const mode = 'stream';
    // window.open('/assetsmanageservice/assetsmanage/assets/assetsQrcodeQuery?assetsIdList='+downloadList+'&mode='+mode)
  }

  allDownload = () =>{
    const {dispatch} = this.props;
    var advancedFileIdList = {};
    for(let i = 0; i < this.props.regulationList.length; i++){
      dispatch({
        type: 'ruleRegulation/regulationDownload',
        arg_regulation_id: this.props.regulationList[i].id
      })
      var downloadItem = [];
      downloadItem.push(this.props.regulationList[i].main_fileid);
      if(this.props.regulationList[i].attachments){
        var attachmentArr = JSON.parse(this.props.regulationList[i].attachments);
        for(let j = 0; j < attachmentArr.length; j++){
          downloadItem.push(attachmentArr[j].fileid);
        }
      }

      advancedFileIdList[`${i} - ${this.props.regulationList[i].title}`] = downloadItem;
    }

    var data = {
      advancedFileIdList: JSON.stringify(advancedFileIdList),
    }
    dispatch({
      type: 'ruleRegulation/filegetzippath',
      data,
    })
    // let url = fileadvAddress + encodeURI(JSON.stringify(advancedFileIdList));
    // window.location.assign(url);
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  onInputChange = (e) => {
    this.setState({ searchText: e.target.value });
  }

  onInputChangeDoc = (e) => {
    this.setState({ searchDocNum: e.target.value });
  }

  onSearch = () => {
    const { searchText } = this.state;
    const {dispatch} = this.props;

    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
    });
    //调用服务
    var data = {
      arg_title: searchText,
      arg_doc_num: this.state.searchDocNum,
      arg_keywords: this.state.searchKeyword,
      arg_print_time_start: this.state.startTime,
      arg_print_time_end: this.state.endTime,
    }
    dispatch({
      type:'ruleRegulation/regulationQuery',
      data,
    })
  }

  onSearchDoc = () => {
    const { searchDocNum } = this.state;
    const {dispatch} = this.props;
    // const reg = new RegExp(searchDocNum, 'gi');

    this.setState({
      filterDropdownDocVisible: false,
      filtered: !!searchDocNum,
    });
    //调用服务
    var data = {
      arg_doc_num: searchDocNum,
      arg_title: this.state.searchText,
      arg_keywords: this.state.searchKeyword,
      arg_print_time_start: this.state.startTime,
      arg_print_time_end: this.state.endTime,
    }
    dispatch({
      type:'ruleRegulation/regulationQuery',
      data,
    })
  }

  gotoRuleDetail = (record) => {
    const {dispatch} = this.props;
    if(record.canRead == '0'){
      message.info(`此文件为涉密文件，若要查阅下载，请按照审批流程，联系${record.record_belong_orgname} - ${record.creater_name}`)
      return;
    }else{
      dispatch(routerRedux.push({
        pathname:'/adminApp/regulationM/ruleRegulation/ruleDetail',
        query: record,
      }));
    }
  }

  downloadSingle = (record) => {
    if(record.canRead == '0'){
      message.info(`此文件为涉密文件，若要查阅下载，请按照审批流程，联系${record.record_belong_orgname} - ${record.creater_name}`)
      return;
    }else{
      // let url = fileAddress + record.main_fileid;
      // window.location.assign(url);
      // const mode = 'stream';
      // window.open('/assetsmanageservice/assetsmanage/assets/assetsQrcodeQuery?assetsId='+record.asset_id+'&mode='+mode)
      //增加规章弧度下载记录
      const {dispatch} = this.props;
      dispatch({
        type: 'ruleRegulation/regulationDownload',
        arg_regulation_id: record.id
      })

      var downloadList = [];
      downloadList.push(record.main_fileid);
      var attachmentArr = [];
      if(record.attachments){
        attachmentArr = JSON.parse(record.attachments);
        for(let i = 0; i < attachmentArr.length; i++){
          downloadList.push(attachmentArr[i].fileid);
        }
      }
      var downloadStr = downloadList.join(';;;');
      let url = fileAddress + downloadStr;
      window.location.assign(url);
    }
  }

  showOperation = (record) => {
    return (
      <div style = {{display:'inline'}}>
        <a onClick = {()=>this.gotoRuleDetail(record)}>查看</a>&nbsp;&nbsp;
        <a onClick = {()=>this.downloadSingle(record)}>下载</a>
      </div>
    )
  }

  showSeceret = (record) => {
    if(record === '1'){
      return (
        <div style = {{display:'inline'}}>
          普通商业秘密
        </div>
      )
    }
    else if(record === '0'){
      return (<span>无</span>)
    }
  }

  gotoGMessage = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/regulationM/globalMessage',
    }));
  }

  regulationSearch = (value) => {
    const {dispatch} = this.props;
    this.setState({searchKeyword: value})
    var data = {
      arg_keywords: value,
      arg_doc_num: this.state.searchDocNum,
      arg_title: this.state.searchText,
      arg_print_time_start: this.state.startTime,
      arg_print_time_end: this.state.endTime,
    }
    dispatch({
      type:"ruleRegulation/regulationQuery",
      data,
    });
  }

  showOperationVis = (record) => {
    if(record === '0'){
      return(
        <div><font style = {{color:'red'}}>● </font>无效</div>
      )
    }else if (record === '1'){
      return(
        <div><font style = {{color:'green'}}>● </font>有效</div>
      )
    }
  }

  getStartTime = (date,dateString) => {
    const {dispatch} = this.props;

    if(dateString == undefined || dateString == null || dateString == ''){
      message.info("请选择开始时间");
      return;
    }
    this.setState({
      startTime: dateString
    },()=>{
      if(dateString > this.state.endTime && this.state.endTime !== ''){
        message.info("开始时间不能大于结束时间");
        return;
      }
      var data = {
        arg_keywords: this.state.searchKeyword,
        arg_doc_num: this.state.searchDocNum,
        arg_title: this.state.searchText,
        arg_print_time_start: this.state.startTime,
        arg_print_time_end: this.state.endTime,
      }
      dispatch({
        type:'ruleRegulation/regulationQuery',
        data,
      })
    })
  }

  getEndTime = (date,dateString) =>{
    const {dispatch} = this.props;
    if(dateString == undefined || dateString == null || dateString == ''){
      message.info("请选择结束时间");
      return;
    }
    this.setState({
      endTime: dateString
    },()=>{
      if(dateString < this.state.startTime){
        message.info("结束时间不能小于开始时间");
        return;
      }
      var data = {
        arg_print_time_start: this.state.startTime,
        arg_print_time_end: this.state.endTime,
      }
      dispatch({
        type:'ruleRegulation/regulationQuery',
        data,
      })
    })
  }
//点击导出
  export =()=>{
    this.props.dispatch({
      type:"ruleRegulation/export",
    });
  }
  //点击取消
  handleCancel=()=>{
    this.props.dispatch({
      type:"ruleRegulation/handleCancel",
    });
  }
//点击确定
handleOk = ()=>{
  this.props.dispatch({
    type:"ruleRegulation/handleOk",
  });
}
  render(){
    console.log(this.props.isModalVisible)
    const {regulationList,categoryTypeList,roldID} = this.props;
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
       selectedRowKeys,
       onChange: this.onSelectChange,
       getCheckboxProps: record => ({
          disabled: record.canRead === '0',    // Column configuration not to be checked
       }),
     };

    var hasSelected = 0;
    if(selectedRowKeys){
      hasSelected = selectedRowKeys.length > 0;
    }

    console.log("1111111111");
    console.log(categoryTypeList);

    var filters = [];
    var finalFilters;
    if(categoryTypeList){
      for(let i = 0; i < categoryTypeList.length; i++){
        filters.push(
          {text:categoryTypeList[i].categoryname, value:categoryTypeList[i].categoryname}
        )
      }
    }

    if(filters.length > 0){
      finalFilters = filters;
    }else{
      finalFilters = [];
    }

    const columns = [
      {
       title: '制度类别',
       dataIndex: 'category1_name',
       key: 'category1_name',
       width:100,
       filters: finalFilters,
       onFilter: (value, record) => record.category1_name.indexOf(value) === 0,
      },
      {
        title: '名称',
        dataIndex: 'title',
        key: 'title',
        width:250,
        filterDropdown: (
          <div>
            <Input
              ref={ele => this.searchInput = ele}
              placeholder="请输入名称"
              value={this.state.searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
              style = {{width:'150px'}}
            />
            <Button type="primary" onClick={this.onSearch}>搜索</Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: this.state.filterDropdownVisible,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState({
            filterDropdownVisible: visible,
          }, () => this.searchInput.focus());
        },
      },
      {
        title: '发文文号',
        dataIndex: 'doc_num',
        key: 'doc_num',
        width:200,
        filterDropdown: (
          <div>
            <Input
              ref={ele => this.searchInputDoc = ele}
              placeholder="请输入发文文号"
              value={this.state.searchDocNum}
              onChange={this.onInputChangeDoc}
              onPressEnter={this.onSearchDoc}
              style = {{width:'150px'}}
            />
            <Button type="primary" onClick={this.onSearchDoc}>搜索</Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownDocVisible: this.state.filterDropdownDocVisible,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState({
            filterDropdownDocVisible: visible,
          }, () => this.searchInputDoc.focus());
        },
      },
      {
        title: '体系',
        dataIndex: 'sys_name',
        key: 'sys_name',
        width:50,
      
      },
      {
        title: '级别',
        dataIndex: 'level_name',
        key: 'level_name',
        width:100,
        filters: levelContent,
        onFilter: (value, record) => record.level_name.indexOf(value) === 0,
      },
      {
        title: '性质',
        dataIndex: 'kind_name',
        key: 'kind_name',
        width:100,
        filters: kindContent,
        onFilter: (value, record) => record.kind_name.indexOf(value) === 0,
      },
      {
        title: '密级',
        dataIndex: 'is_secret',
        key: 'is_secret',
        width:100,
        render:(record) => this.showSeceret(record),
        filters: [{text:'普通商业密级',value:1},{text:'无',value:0}],
        onFilter: (value, record) => record.is_secret.indexOf(value) === 0,
      },
      {
        title: '印发时间',
        dataIndex: 'print_time',
        width:150,
        key: 'print_time',
      },
      {
        title: '是否有效',
        dataIndex: 'is_enabled',
        width:100,
        render:(record) => this.showOperationVis(record),
        filters: [{text:'有效',value:1},{text:'无效',value:0}],
        onFilter: (value, record) => record.is_enabled.indexOf(value) === 0,
      }, {
        title: '操作',
        width:100,
        render:(record) => this.showOperation(record)
      }];
      
      const exportColumns = [
        {
         title: '制度类别',
         dataIndex: 'category1_name',
         key: 'category1_name',
         width:100,
         filters: finalFilters,
         onFilter: (value, record) => record.category1_name.indexOf(value) === 0,
        },
        {
          title: '名称',
          dataIndex: 'title',
          key: 'title',
          width:250,
          filterDropdown: (
            <div>
              <Input
                ref={ele => this.searchInput = ele}
                placeholder="请输入名称"
                value={this.state.searchText}
                onChange={this.onInputChange}
                onPressEnter={this.onSearch}
                style = {{width:'150px'}}
              />
              <Button type="primary" onClick={this.onSearch}>搜索</Button>
            </div>
          ),
          filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
          filterDropdownVisible: this.state.filterDropdownVisible,
          onFilterDropdownVisibleChange: (visible) => {
            this.setState({
              filterDropdownVisible: visible,
            }, () => this.searchInput.focus());
          },
        },
        {
          title: '发文文号',
          dataIndex: 'doc_num',
          key: 'doc_num',
          width:200,
          filterDropdown: (
            <div>
              <Input
                ref={ele => this.searchInputDoc = ele}
                placeholder="请输入发文文号"
                value={this.state.searchDocNum}
                onChange={this.onInputChangeDoc}
                onPressEnter={this.onSearchDoc}
                style = {{width:'150px'}}
              />
              <Button type="primary" onClick={this.onSearchDoc}>搜索</Button>
            </div>
          ),
          filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
          filterDropdownDocVisible: this.state.filterDropdownDocVisible,
          onFilterDropdownVisibleChange: (visible) => {
            this.setState({
              filterDropdownDocVisible: visible,
            }, () => this.searchInputDoc.focus());
          },
        },
        {
          title: '体系',
          dataIndex: 'sys_name',
          key: 'sys_name',
          width:50,
        
        },
        {
          title: '级别',
          dataIndex: 'level_name',
          key: 'level_name',
          width:100,
          filters: levelContent,
          onFilter: (value, record) => record.level_name.indexOf(value) === 0,
        },
        {
          title: '性质',
          dataIndex: 'kind_name',
          key: 'kind_name',
          width:100,
          filters: kindContent,
          onFilter: (value, record) => record.kind_name.indexOf(value) === 0,
        },
        {
          title: '密级',
          dataIndex: 'is_secret',
          key: 'is_secret',
          width:100,
          render:(record) => this.showSeceret(record),
          filters: [{text:'普通商业密级',value:1},{text:'无',value:0}],
          onFilter: (value, record) => record.is_secret.indexOf(value) === 0,
        },
        {
          title: '印发时间',
          dataIndex: 'print_time',
          width:150,
          key: 'print_time',
        },
        {
          title: '是否有效',
          dataIndex: 'is_enabled',
          width:100,
          render:(record) => this.showOperationVis(record),
          filters: [{text:'有效',value:1},{text:'无效',value:0}],
          onFilter: (value, record) => record.is_enabled.indexOf(value) === 0,
        }];
    return(
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className = {styles.pageContainer}>
           <h2 style = {{textAlign:'center',marginBottom:30}}>规章制度</h2>
           {Boolean(roldID)? ((roldID.indexOf(role0) !== -1 || roldID.indexOf(role1) !== -1 || roldID.indexOf(role2) !== -1 ) ?
            <Button type = "primary" style = {{float:'right', marginLeft:10}} onClick = {this.gotoGMessage}>留言</Button>
            :'') : ''}

           <Search placeholder="关键字"  onSearch={value=>this.regulationSearch(value)} style = {{float:'right', width:200, marginLeft:10}}/>
           <div style = {{float:'right'}}>
              <span>印发时间查询：</span>
              <DatePicker  onChange={this.getStartTime}  format={monthFormat} style = {{marginBottom:10}}/> - &nbsp;
              <DatePicker  onChange={this.getEndTime}  format={monthFormat} style = {{marginBottom:10}}/>
           </div>
           <Modal title="确定要导出下面所有数据吗？" width='930px' height = '600px'  visible={this.props.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
              <Table className={styles.orderTable} columns={exportColumns} dataSource={this.props.exportList} pagination={false} scroll={{ y: 240 }} />,
              {this.props.exportList?
                <span>共{this.props.exportList.length}条数据</span>
                :
                <span>暂无数据</span>
            }
              
          </Modal>

           {
             Boolean(roldID)? ((roldID.indexOf(role0) !== -1 || roldID.indexOf(role1) !== -1 || roldID.indexOf(role2) !== -1 || roldID.indexOf(role3) !== -1) ?
             <div>
               <div style = {{marginBottom:16}}>
               <Button type = "primary" onClick = {this.export} loading = {loading}>导出</Button>&nbsp;&nbsp;
                 <Button type = "primary" disabled = {regulationList.length == 0} onClick = {this.allDownload} loading = {loading}>全部下载</Button>&nbsp;&nbsp;
                 <Button type = "primary" onClick = {this.batchDownload} disabled = {!hasSelected || regulationList.length == 0} loading = {loading}>批量下载</Button>
                 
                 <span style = {{marginLeft:8}}>{hasSelected ? `选中 ${selectedRowKeys.length}条` : ''}</span>
               </div>
               <Table  rowSelection = {rowSelection} columns = {columns} dataSource = {regulationList}   className={styles.orderTable}/>
             </div>
              :
              <div>
                <div style = {{marginBottom:16,marginTop:20}}>
                  <div>.</div>
                </div>
                <Table style = {{marginTop:30}} columns = {columns} dataSource = {regulationList}   className={styles.orderTable}/>
              </div>
              )
               : ''
           }




        </div>
     </Spin>
    );
  }

}

function mapStateToProps (state) {
  const {query,regulationList,categoryTypeList,roldID,isModalVisible,exportList,exportCount} = state.ruleRegulation;  //lumj
  return {
    loading: state.loading.models.ruleRegulation,
    query,
    regulationList,
    categoryTypeList,
    roldID,
    isModalVisible,
    exportList,
    exportCount
  };
}


export default connect(mapStateToProps)(RuleRegulation);
