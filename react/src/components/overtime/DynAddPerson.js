/**
 * 作者：晏学义
 * 日期：2019-06-07
 * 邮箱：yanxy65@chinaunicom.cn
 * 功能：动态编辑表格组件
 */
import React, { Component} from 'react';
import {Table, Input, Icon, Modal, message, DatePicker} from 'antd';
class DynAddPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      personDataSource: [],
      indexValue:0,
    };
    this.handleAdd = this.handleAdd.bind(this);//绑定this，这个是下面声明onClick的方法，需绑定this，在onClick事件中直接用this.handleAdd即可
    this.handleDel = this.handleDel.bind(this);
  }

  // dateFormatcheck(dataStr) {
  //   let date = dataStr;
  //   let result = date.match(/^(\d{4})(-|\/)(\d{2})\2(\d{2})$/);

  //   if (result == null)
  //   {
  //     return false;
  //   }
  //   let d = new Date(result[1], result[3] -1, result[4]);
  //   return (d.getFullYear() == result[1] && (d.getMonth()+1) == result[3] && d.getDate() == result[4]);
  // }

  dateValuecheck(dataStr) {
    let overtime = dataStr.replace(/\-/g,"");
    //let overtime = dataStr;
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let currentTime = `${year}${month<10?`0${month}`:`${month}`}${date<10?`0${date}` : `${date}`}`;
    return (overtime > currentTime);
  }

  checkNull(value) {
    if(value === '' || value === null || value === undefined)
    {
      return true;
    }
    return false;
  }

  //添加
  handleAdd() {
    const newDataSource = this.state.personDataSource;//将this.state.dateSource赋给newDataSource
    let l = this.state.indexValue;
    newDataSource.push({//newDataSource.push一个新的数组，这个数组直接将初始化中的数组copy过来即可
      indexID: l,
      hrID: '',
      staffName: '',
      workTime: '',
      workReason: '',
      workPlace: '',
      remark: '',
      operation: '',
    });
    this.setState({
      indexValue: l+1
    });
    this.setState({
      personDataSource: newDataSource,//将newDataSource新添加的数组给dataSource
    });
  }

  //删除
  handleDel(e) {
    const DelDataSource = this.state.personDataSource;
    let deleteIndex = e.target.getAttribute('data-index');
    if(deleteIndex != (DelDataSource.length - 1))
    {
      message.error('必须自底向上逐一删除，不支持从中间删除');
      return;
    }
    console.log("event.target.getAttribute('data-index') : " + deleteIndex);
    DelDataSource.splice(deleteIndex, 1);
    this.setState({
      dataSource: DelDataSource,
    });

  }

  closePersonWindow = () =>{
    this.props.updateParent(false);
    this.setState({
      personDataSource : []
    })
  }

  onChange(e){
    let changePerson = this.state.personDataSource;
    changePerson[e.target.id][e.target.name] = e.target.value;
    this.setState({
      personDataSource : changePerson
    })
  }

  choiseDate(record,workTime){
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(record);
    console.log(record.indexID);
    console.log(workTime.format("YYYY-MM-DD"));
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    workTime = workTime.format("YYYY-MM-DD");
    let changePerson = this.state.personDataSource;
    console.log("+++++++======================================================================================++++++++++++");
    console.log(changePerson);
    console.log(this.state.personDataSource);
    console.log("+++++++======================================================================================++++++++++++");
    changePerson[record.indexID]['workTime'] = workTime;
    this.setState({
      personDataSource : changePerson
    })
  }

  addOvertimePerson = () =>{
    let circulationType = this.props.circulationType;
    /*检查加班人员数据字段列是否有空的，如果有空的弹出提示*/
    const dataSourceList = this.state.personDataSource;
    let dateValueCheck = true;
    let nullCheck = true;
    let transferPersonList = [];
    dataSourceList.map((item) => {
      /*加班日期格式必须是YYYY-MM-DD*/
      /*空值校验*/
      if(this.checkNull(item.hrID))
      {
        nullCheck = false;
      }
      if(this.checkNull(item.staffName))
      {
        nullCheck = false;
      }
      if(this.checkNull(item.workTime))
      {
        nullCheck = false;
      }
      else
      {
        console.log("item.workTime : " + item.workTime);
        if(circulationType === '申请'){
          console.log("++++++++++++++++++++++++");
          console.log(circulationType);
          /*加班日期不能小于等于当前时间*/
          let rt = this.dateValuecheck(item.workTime);
          if(rt === false)
          {
            dateValueCheck = false;
          }
        }else{
          console.log("---------------------------");
          console.log(circulationType);
          console.log(item);
          console.log("---------------------------");
        }
      }
      if(this.checkNull(item.workReason))
      {
        nullCheck = false;
      }
      if(this.checkNull(item.workPlace))
      {
        nullCheck = false;
      }
      if(this.checkNull(item.remark))
      {
        nullCheck = false;
      }
      let personData = {
        indexID: item.indexID,
        hrID: item.hrID,
        staffName:item.staffName,
        workTime:item.workTime,
        workReason:item.workReason,
        workPlace:item.workPlace,
        remark: item.remark
      };
      transferPersonList.push(personData);
    })
    if(nullCheck === false)
    {
      message.error('加班人员信息不能存在空');
      return;
    }
    if(dateValueCheck === false)
    {
      message.error('加班日期必须大于申请当天，请修改后再保存提交');
      return;
    }

    /*调用model层刷新personList数据*/
    let importPersonDataList = this.props.personDataList;
    this.props.dispatch({
      type:'create_approval_model/personAdd',
      transferPersonList,
      importPersonDataList
    });
    this.props.updateParent(false);
    // 清空数据
    this.setState({
      personDataSource : [],
      indexValue: 0,
    })
  }
 
  render() {
    const columns = [{
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      render: (text, record, index) => {
        return <span>{index+1}</span>
      },
    }, {
      title: '员工编号',
      dataIndex: 'hrID',
      key: 'hrID',
      render: (text, record, index) => { return <Input placeholder="员工编号" name="hrID" id={index} onChange ={this.onChange.bind(this) } /> },
    }, {
      title: '姓名',
      dataIndex: 'staffName',
      key: 'staffName',
      render: (text, record, index) => { return <Input placeholder="姓名"  name="staffName" id={index} onChange ={this.onChange.bind(this) } /> },
    }, {
      title: '加班日期',
      dataIndex: 'workTime',
      key: 'workTime',
      render: (text, record, index) => { return <DatePicker placeholder="加班日期" getPopupContainer={trigger => trigger.parentNode} name="workTime" id={index} onChange ={this.choiseDate.bind(this,record) } /> },
      // <Input placeholder="加班日期" name="workTime" id={index} onChange ={this.onChange.bind(this) } /> },
    }, {
      title: '加班原因',
      dataIndex: 'workReason',
      key: 'workReason',
      render: (text, record, index) => { return <Input placeholder="加班原因" name="workReason" id={index} onChange ={this.onChange.bind(this) } /> },
    },{
        title: '加班地点',
        dataIndex: 'workPlace',
        key: 'workPlace',
        render: (text, record, index) => { return <Input placeholder="加班地点" name="workPlace" id={index} onChange ={this.onChange.bind(this) } /> },
      }, {
      title: '天数',
      dataIndex: 'remark',
      key: 'remark',
      render: (text, record, index) => { return <Input placeholder="天数" name="remark" id={index} onChange ={this.onChange.bind(this) } /> },
    },
      {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record, index) => {
        return <Icon type="delete" data-index={index} onClick={this.handleDel.bind(this)} />//data-index现在为获得index的下标，上面的删除data-index即是获取index的下标
      },
    }];
    return (
      <Modal
        title="添加加班人员"
        visible={this.props.visible}
        onOk={this.addOvertimePerson}
        onCancel={this.closePersonWindow}
        width={"75%"}
      >
        <span className="ant-title">加班人员信息</span>
        <div style={{textAlign: "right"}}>
        <button onClick={this.handleAdd}>添 加</button>
        </div>
        <br/>
        <Table 
          dataSource={this.state.personDataSource} 
          columns={columns}//this.state.dataSource即为获取初始化dataSource数组
          pagination={false} 
          bordered
        />
      </Modal>
    );
  }

}

//属性类型

DynAddPerson.propTypes = {

};

//初始数据
DynAddPerson.defaultProps = {

}
export default DynAddPerson;
