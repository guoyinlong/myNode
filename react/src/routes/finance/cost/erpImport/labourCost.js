/**
 * 作者：张楠华
 * 日期：2017-10-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：实现人工成本导入
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../../components/employer/employer.less'
import { Button,Select,message,DatePicker,Upload,Spin,Table,Modal } from 'antd';
import request from '../../../../utils/request';
import tableStyle from '../../../../components/finance/table.less'
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const dateFormat = 'YYYY-MM';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
class LabourCost extends React.Component{
  getParam = () =>{
    const {ou} = this.state;
    return {"arg_year":this.props.yearMonth.format(dateFormat).split('-')[0],"arg_month":parseInt(this.props.yearMonth.format(dateFormat).split('-')[1]),"arg_ou":ou,"arg_userid":localStorage.userid};
  };
  //取消弹框
  cancelModule = () => {
    this.setState({visible: false});
  };
  //生成数据
  importSuccess = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'labourCost/generateLabourCost',
      yearMonth:this.props.yearMonth,
      ou:this.state.ou
    });
    this.setState({visible: false});
  };
  //撤销数据
  cancelData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'labourCost/cancelData',
      yearMonth:this.props.yearMonth,
      ou:this.state.ou
    });
  };
  //导入成功弹出预览框
  showModule = (response) => {
    this.setState({visible: true});
    const {dispatch} = this.props;
    dispatch({
      type: 'labourCost/importLabourCost',
      response
    });
  };
  constructor(props){
    super(props);
    this.state={
      //yearMonth : moment(),
      ou:localStorage.ou,
      visible:false,
      import: {
        action: "/microservice/cosservice/erpmaintain/labourCostPreviewServlet",
        method: "POST",
        data: this.getParam,
        name: "outSource",
        multiple: false,
        showUploadList: false,
        accept: '.xlsx,.xls',
        onChange:(info)=> {
          if (info.file.status === 'done') {
            if (info.file.response.RetCode === '1') {
              this.showModule(info.file.response);
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} 导入失败！.`);
            }else if(info.file.response.RetCode === '0'){
              message.info(info.file.response.RetVal);
            }
          }
        }
      }
    }
  }
  onChangeMonth = (value) => {
    // this.setState({
    //   yearMonth:value,
    // });
    const { dispatch } = this.props;
    dispatch({
      type:'labourCost/saveMonth',
      yearMonth:value
    });
    dispatch({
      type:'labourCost/queryLabourData',
      yearMonth: value,
      ou:this.state.ou
    });
  };
  onChangeOu = (value) => {
    this.setState({
      ou:value,
    });
    const { dispatch } = this.props;
    dispatch({
      type:'labourCost/queryLabourData',
      yearMonth: this.props.yearMonth,
      ou:value
    });
  };
  //模板下载
  downloadTemp =() =>{
    let { ou } = this.state;
    // let postData={
    //   arg_total_year:yearMonth.format(dateFormat).split('-')[0],
    //   arg_total_month:yearMonth.format(dateFormat).split('-')[1],
    //   arg_ou:ou,
    // };
    let url = '/microservice/cosservice/erpmaintain/labourCostTemplateDownloadServlet?'+"arg_total_year="+this.props.yearMonth.format(dateFormat).split('-')[0]+"&arg_total_month="+parseInt(this.props.yearMonth.format(dateFormat).split('-')[1])+"&arg_ou="+ou;
    window.open(url);
    // try{
    //   let res= await request('/microservice/cosservice/erpmaintain/labourCostTemplateDownloadServlet',postData);
    //   if(res.RetCode==='1'){
    //     let url = '/microservice/cosservice/erpmaintain/labourCostTemplateDownloadServlet?'+"arg_total_year="+yearMonth.format(dateFormat).split('-')[0]+"&arg_total_month="+parseInt(yearMonth.format(dateFormat).split('-')[1])+"&arg_ou="+ou;
    //     window.open(url);
    //   }else{
    //     message.error(res.RetVal)
    //   }
    // }catch (e){
    //   message.info(e.message)
    // }
  };
  render() {
    const { ouList,list,titleNamePre,listPre } = this.props;
    let ouList1;
    if(ouList !== undefined){
     ouList1 = ouList.map((item) => {
        return (
          <Option key={item.dept_name}>
            {item.dept_name}
          </Option>
        )
      });
    }
    if (list.length) {
      list.map((i, index) => {
        i.key = index;
      })
    }
    if (listPre.length) {
      listPre.map((i, index) => {
        i.key = index;
      })
    }
    const columns = [];
    columns.push(
      {
        title: 'ou',
        width: 150,
        dataIndex: 'ou',
      },
      {
        title: '部门名称',
        width: 150,
        dataIndex: 'dept_name',
      },
      {
        title: '项目编码',
        width: 150,
        dataIndex: 'proj_code',
      },
      {
        title: '项目名称',
        width: 150,
        dataIndex: 'proj_name',
      },
      {
        title: '当月人工成本的费用',
        width: 150,
        dataIndex: 'month_fee',
      }
    );

    const columnsPre = [];
    for(let i=0;i<titleNamePre.length;i++){
      columnsPre.push(
        {
          title: titleNamePre[i].split('::')[0],
          width: 150,
          dataIndex: titleNamePre[i].split('::')[1],
        }
      );
    }
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={Style.wrap}>
          <div style={{textAlign:'left',paddingLeft:'15px'}}>
            <span>OU：
              <Select showSearch style={{ width: 160}}  value={this.state.ou} onSelect={this.onChangeOu} >
                      {ouList1}
              </Select>
            </span>&nbsp;&nbsp;
            <div style={{display:'inline-block'}}>
              年月：
              <MonthPicker
                onChange={this.onChangeMonth}
                format = {dateFormat}
                value={this.props.yearMonth}
              />
            </div>&nbsp;&nbsp;
            <Upload  {...this.state.import}>
              <Button type="primary"  disabled={ list && list.length !==0} style={{marginRight:20}}>导入</Button>
            </Upload>
            <Button type="primary" disabled={ list && list.length ===0} onClick={this.cancelData} style={{marginRight:20}}>撤销</Button>
            <Button type="primary" onClick={this.downloadTemp} style={{marginRight:20}}>模板下载</Button>
          </div>
          <div style={{marginTop:'20px'}}>
            <Table columns={columns}
                   dataSource={list}
                   pagination={true}
                   className={tableStyle.financeTable}
            />
          </div>
          <Modal
            title={"导入预览：（" + this.props.yearMonth.format('YYYY-MM') +"）"}
            visible={this.state.visible}
            onCancel={this.cancelModule}
            width='1100px'
            footer={[
              <Button key="back" onClick={this.cancelModule}>返回</Button>,
              <Button key="submit" type="primary" onClick={this.importSuccess}>生成数据</Button>,
            ]}
          >
            <div>
              <Table className={tableStyle.financeTable} columns={columnsPre} dataSource={listPre}
                     pagination={true}/>
            </div>
          </Modal>
        </div>
      </Spin>
    );
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.labourCost,
    ...state.labourCost
  };
}
export default connect(mapStateToProps)(LabourCost);
