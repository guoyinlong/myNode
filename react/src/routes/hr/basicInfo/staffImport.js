/**
 *  作者: 邓广晖
 *  创建日期: 2017-08-11
 *  邮件: denggh6@chinaunicom.cn
 *  文件说明：实现员工信息导入功能
 *  修改人：耿倩倩
 *  邮箱：gengqq3@chinaunicom.cn
 *  修改时间：2017-09-11
 */
import React from 'react';
import {connect} from 'dva';
import {Table,message,Button,Input,Icon,Tooltip} from 'antd';
import styles from './staffImport.less';
import FileUpload from './import.js';
/**
 * 作者：耿倩倩
 * 创建日期：2017-09-11
 * 功能：实现单元格编辑功能
 */
class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: this.props.editable || false,
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        this.props.onChange(this.state.value);

      }else if (nextProps.status === 'cancel') {
        this.setState({ value: this.cacheValue });
        this.props.onChange(this.cacheValue);
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
      nextState.value !== this.state.value;
  }
  handleChange(e) {
    const value = e.target.value;
    this.setState({ value });
    this.props.onChange(value);
  }
  render() {
    const { value, editable } = this.state;
    switch(this.props.cellType){
      case "username":
        return (this.props.record.nameError1 === 'OK'?<div>
            {editable? <Input value={value} onChange={e => this.handleChange(e)}/>
              :
              <span>{value.toString() || ' '}</span>
            }
          </div>
            :
            <div>
              {editable? <Input value={value} onChange={e => this.handleChange(e)}/>
                :
                <Tooltip title={this.props.record.nameError1}>
                  <span style={{color:'red'}}>{value.toString() || ' '}</span>
                </Tooltip>
              }
            </div>
        );
        break;
      case "telPhone":
        return (this.props.record.telPhoneError3 === 'OK'?<div>
            {editable? <Input value={value} onChange={e => this.handleChange(e)}/>
              :
              <span >{value.toString() || ' '}</span>
            }
          </div>
            :
            <div>
              {editable? <Input value={value} onChange={e => this.handleChange(e)}/>
                :
                <Tooltip title={this.props.record.telPhoneError3}>
                  <span style={{color:'red'}}>{value.toString() || ' '}</span>
                 </Tooltip>
              }
            </div>
        );
        break;
      case "email":
      return (this.props.record.emailError2 === 'OK'?<div>
          {editable? <Input value={value} onChange={e => this.handleChange(e)}/>
            :
            <span>{value.toString() || ' '}</span>
          }
        </div>
          :
          <div>
            {editable? <Input value={value} onChange={e => this.handleChange(e)}/>
              :
              <Tooltip title={this.props.record.emailError2}>
                <span style={{color:'red'}}>{value.toString() || ' '}</span>
              </Tooltip>
            }
          </div>
      );
      break;
      default:
        return (
          <div>
            {editable? <Input value={value} onChange={e => this.handleChange(e)}/>
              :
              <span>{value.toString() || ' '}</span>
            }
          </div>
        );
    }

  }
}

/**
 * 作者：耿倩倩
 * 创建日期：2017-09-11
 * 功能：实现导入表格的预览和编辑
 */
class EditableTable extends React.Component {
  state = {data:undefined};

  componentWillReceiveProps(nextProps){
    this.setState({data:undefined});
  }

  constructor(props) {
    super(props);
    this.columns = [
      {
      title: '状态',
      dataIndex: 'state',
      render:(text, record)=>{
        if(record.nameError1 !== 'OK' || record.emailError2 !== 'OK' || record.telPhoneError3 !== 'OK'){
          return(<Icon type="close-circle-o" style={{fontSize:20,color:'red'}} />);
        }else{
          return(<Icon type="check-circle-o" style={{fontSize:20,color:'green'}} />);
        }
      }
    },
      {
      title: '部门',
      dataIndex: 'deptName',
      render: (text, record, index) => this.renderColumns(this.props.dataList, index, 'deptName', text,record),
    },
      {
      title:'姓名',
      dataIndex:'username',
      render: (text, record, index) => this.renderColumns(this.props.dataList, index, 'username', text,record),
    },
      {
      title:'编号',
      dataIndex:'staff_id',
      render: (text, record, index) => this.renderColumns(this.props.dataList, index, 'staff_id', text,record),
    },
      {
      title:'手机号码',
      dataIndex:'telPhone',
      render: (text, record, index) => this.renderColumns(this.props.dataList, index, 'telPhone', text,record),
    },
      {
      title:'邮箱',
      dataIndex:'email',
      render: (text, record, index) => this.renderColumns(this.props.dataList, index, 'email', text,record),
    },
      {
      title:'职务',
      dataIndex:'postName',
      render: (text, record, index) => this.renderColumns(this.props.dataList, index, 'postName', text,record),
    },
      {
      title:'职务类型',
      dataIndex:'postType',
      render: (text, record, index) => this.renderColumns(this.props.dataList, index, 'postType', text,record),
    },
      {
      title:'用工类型',
      dataIndex:'employType',
      render: (text, record, index) => this.renderColumns(this.props.dataList, index, 'employType', text,record),
    },
      {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => {
        //const { editable } = this.state.data[index].name;
        const data = this.props.dataList;
        const { editable } = data[index].deptName;
        return (
          <div>
            {
              editable ?
                <span>
                  <a onClick={() => this.editDone(index, 'save')}>保存</a>
                </span>
                :
                <span>
                  <a onClick={() => this.edit(index)}>编辑</a>
                </span>
            }
          </div>
        );
      },
    }];
  }


  /**
   * 作者：邓广晖
   * 创建日期：2017-09-20
   * 功能：渲染不同的列表
   * @param data 传入数据
   * @param index 数据索引值
   * @param key 数据的键
   * @param text 当前单元格内容
   * @param record 当前行数据
   */
  renderColumns(data, index, key, text,record) {
    const { editable, status } = data[index][key];
    if (typeof editable === 'undefined') {
      return text;
    }
    return (<EditableCell
      editable={editable}
      value={text}
      onChange={value => this.handleChange(key, index, value)}
      status={status}
      cellType={key}
      record={record}
    />);
  }

  /**
   * 作者：邓广晖
   * 创建日期：2017-09-20
   * 功能：表格发生变化
   * @param key 数据的键
   * @param index 数据索引值
   * @param value 传入当前值
   */
  handleChange(key, index, value) {
    const { data } = this.state;
    //const data = this.props.dataList;
    data[index][key].value = value;
    switch(key){
      case 'telPhone':
        //验证手机号码  ^((13[0-2])|(15[5-6])|(176)|(18[5-6]))[0-9]{8}$
        let pattern1 =/^(1)[0-9]{10}$/;
        if(pattern1.test(data[index][key].value)){
          data[index].telPhoneError3.value = 'OK';
        }else{
          data[index].telPhoneError3.value = '手机号码不正确';
        }
         break;
      case 'email':
        //验证邮箱
        let pattern2 = /^[a-zA-Z0-9_-]+@chinaunicom.cn$/;  ///^1[0-9]{10}$/
        if(pattern2.test(data[index][key].value)){
          data[index].emailError2.value = 'OK';
        }else{
          data[index].emailError2.value = '不符合邮箱规则';
        }
        break;
    }
    this.setState({ data });
  }

  /**
   * 作者：邓广晖
   * 创建日期：2017-09-20
   * 功能：表格编辑功能
   * @param index 数据索引值
   */
  edit(index) {
    //const { data } = this.state;
    const data = this.props.dataList;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = true;
      }
    });
    this.setState({ data });
  }

  /**
   * 作者：邓广晖
   * 创建日期：2017-09-20
   * 功能：表格编辑完成
   * @param index 数据索引值
   * @param type 当前单元格的编辑类型
   */
  editDone(index, type) {
    const { data } = this.state;
    //const data = this.props.dataList;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = false;
        data[index][item].status = type;
      }
    });
    this.setState({ data }, () => {
      Object.keys(data[index]).forEach((item) => {
        if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
          delete data[index][item].status;
        }
      });
    });
  }

  render() {
    //const { data } = this.state;
    const  data = this.props.dataList;
    const dataSource = data.map((item) => {
      const obj = {};
      Object.keys(item).forEach((key) => {
        obj[key] = key === 'key' ? item[key] : item[key].value;
      });
      return obj;
    });
    const columns = this.columns;
    return(
      <Table bordered
             dataSource={dataSource}
             columns={columns}
             className={styles.orderTable}
      />
      );

  }
}

/**
 * 作者：耿倩倩
 * 创建日期：2017-09-11
 * 功能：实现文件上传/导入/预览/编辑功能
 */
class staffImport extends React.Component {
  constructor(props) { super(props);}

  /**
   * 作者：邓广晖
   * 创建日期：2017-09-20
   * 功能：清空预览表格数据
   */
  clearPreviewTableData = () =>{
     const{dispatch} = this.props;
     dispatch({
       type:"staffImport/selfChangeState"
     });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-09-20
   * 功能：提交表格数据
   */
  tableDataCommit =(data)=>{
     //判断表格数据的正确性
     let allDataListIsTrue = true;
     for (let i = 0 ; i < data.length; i++){
       if (data[i].emailError2.value !== 'OK' || data[i].telPhoneError3.value !== 'OK'){
         allDataListIsTrue = false;
         break;
       }
     }
    if(allDataListIsTrue === true){
      const {dispatch} = this.props;
      dispatch({
        type:"staffImport/tableDataCommit",
        data:data
      });
    }else{
      message.info("电话或者邮箱有错误！");
    }
  };
  render() {
    let {editTableDataList,haveData} = this.props;
    // 这里为每一条记录添加一个key，从0开始
    if(editTableDataList.length){
      editTableDataList.map((i,index)=>{
        i.key=index;
      })
    }
    return (
      <div className={styles.meetWrap}>
        <div style={{marginBottom:'40px'}}>
          <div className={styles.btnLayOut}>
            <a href="/filemanage/download/staff/staff.xls"><Button type="primary">{'模板下载'}</Button></a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <FileUpload dispatch={this.props.dispatch}/>
          </div>
        </div>

        {/*可编辑表格*/}
       <EditableTable dataList={editTableDataList}
                      ref="editableTable"
       />
        {haveData?
          <div className={styles.btnLayOut}>
            <Button type="primary" onClick={this.clearPreviewTableData}>{'清空'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {this.refs.editableTable.state.data === undefined ?
              <Button type="primary" onClick={()=>this.tableDataCommit(editTableDataList)}>{'提交'}</Button>
              :
              <Button type="primary" onClick={()=>{this.tableDataCommit(this.refs.editableTable.state.data);}}>{'提交'}</Button>
            }
          </div>
          :
          null
        }
      </div>
    );
  }
}

//将表格数据转到可编辑表格中
function normalTableData2EditTableData(data){
  let dataResult = [];
  for (let i = 0; i<data.length; i++){
      let newData ={};
      for(let item in data[i]){
        newData[item] = {editable:false,value:data[i][item]};
      }
     dataResult.push(newData);
  }
 return dataResult;
}

// function editTableData2NormalTableData(data){
//   let dataResult = [];
//   for (let i = 0; i<data.length; i++){
//     let newData ={};
//     for(let item in data[i]){
//       newData[item] = data[i][item].value;
//     }
//     dataResult.push(newData);
//   }
//   return dataResult;
// }

function mapStateToProps (state) {
  const { tableDataList,haveData} = state.staffImport;
  let editTableDataList = normalTableData2EditTableData(tableDataList);
  return {
    loading: state.loading.models.staffImport,
    editTableDataList,
    haveData
  };
}

export default connect(mapStateToProps)(staffImport);

