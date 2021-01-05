import React from "react";
import {Table, Button, Modal, message, Popover,Tabs } from 'antd';
import Style from "./import.css";
import tableStyle from "../../../components/common/table.less";
import AddAuthModal from "./addAuthModal";
import request from '../../../utils/request.js'
import Cookie from "js-cookie";
import {connect} from "dva/index";
const { TabPane } = Tabs;
/**
 * 作者：王旭东
 * 创建日期：2019-2-13
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：激励信息导入设置
 */

class EncoAuthSetting extends React.Component {
    state = {
        modalVisible: false,
        oneRecord: [],
        oneRecordOld: [],
        currentKey:"1",
        upt_staffid:Cookie.get('userid'),
    }


    showModal = (operateType, record) => {
        if (operateType !== 'addModal') {
            let postData = {};
            postData["arg_staff_id"] = record.staff_id;
            const detailData = this.state.currentKey=="1"?request('/microservice/encourage/admincategorylistquery', postData):request('/microservice/allencouragement/encouragement/service/adminreportlistquery', postData)
            detailData.then(data => {
                if (data.RetCode === '1') {
                    this.setState({
                        oneRecord: data.DataRows,
                        oneRecordOld: data.DataRows,
                        record: record,
                    })
                }
            })
        }

        this.setState({
            modalType: operateType,
            modalVisible: true,
        })
    }


    columns = [
        {
            title: '姓名',
            dataIndex: 'username',
            key: 'username',
            width: '200px',
        }, {
            title: '工号',
            dataIndex: 'staff_id',
            key: 'staff_id',
            width: '200px',
        }, {
            title: '权限',
            dataIndex: 'category_name',
            key: 'category_name',
            render: (text)=>{
                let content = text.split(',').map(item=><p key={item}>{item}</p>)
                let contentDiv = <div>{content}</div>
                return(
                    <Popover content={contentDiv}>
                        <div style={{ width:'500px',overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap'}}>
                            {text}
                        </div>
                    </Popover>
                )
            }
        }, {
            title: '操作',
            dataIndex: '',
            key: '',
            width: '200px',
            render: (text, record) => {
                return (<span>
                {/*<Button
                    style={{marginRight: 10}}
                    onClick={() => this.showModal('detailModal', record)}
                >
                    详细
                </Button>*/}
                <Button
                    style={{marginRight: 10}}
                    onClick={() => this.showModal('editModal', record)}
                >
                    编辑
                </Button>
                <Button onClick={() => this.deleteAuth(record)}>删除</Button>
            </span>)
            }
        }];

    report_columns=[
      {
          title: '姓名',
          dataIndex: 'username',
          key: 'username',
          width: '200px',
      }, {
          title: '工号',
          dataIndex: 'staff_id',
          key: 'staff_id',
          width: '200px',
      }, 
      {
        title: '报告',
        dataIndex: 'report_name',
        key: 'report_name',
        render: (text)=>{
            let content = text.split(',').map(item=><p key={item}>{item}</p>)
            let contentDiv = <div>{content}</div>
            return(
                <Popover content={contentDiv}>
                    <div style={{ width:'500px',overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap'}}>
                        {text}
                    </div>
                </Popover>
              )
            }
          },
           {
          title: '操作',
          dataIndex: '',
          key: '',
          width: '200px',
          render: (text, record) => {
              return (<span>
              <Button
                  style={{marginRight: 10}}
                  onClick={() => this.showModal('editModal', record)}
              >
                  编辑
              </Button>
              <Button onClick={() => this.deleteAuth(record)}>删除</Button>
          </span>)
          }
      }];

    deleteAuth=(record)=>{
        const {dispatch} = this.props;
        this.state.currentKey=="1"?
        dispatch({
            type: 'encoAuthSetting/deleteAuth',
            staff_id: record.staff_id,
        })
        :
        dispatch({
          type: 'encoAuthSetting/reportSetting',
          params:{
          upt_staffid:this.state.upt_staffid,
          arg_staff_id:record.staff_id,
          tag:"delete",
            }
        })
    }



    modalOk = () => {
        let staff_id = this.refs.AddAuthModal.getSelectData();//父组件调用子组件的方法
        if(this.state.modalType === 'addModal'){
            if(staff_id===''){
                message.info('请选择人员！')
            }else if(this.props.categoryList.findIndex(item=>item.staff_id===staff_id)!==-1&&this.state.currentKey=="1"){
                message.info('该人员已存在权限信息！')
            }else if(this.props.reportList.findIndex(item=>item.staff_id===staff_id)!==-1&&this.state.currentKey=="2"){
              message.info('该人员已存在报告信息！')
          }else if(this.state.oneRecord && this.state.oneRecord.length === 0){
                //console.log(this.state.oneRecord)

                message.info('请勾选要配置的权限！')
            }else{
             //debugger
                const {dispatch} = this.props;
                this.state.currentKey=="1"?
                dispatch({
                    type: 'encoAuthSetting/saveAuth',
                    staff_id: staff_id,
                    category_uid_Arrs: this.state.oneRecord,
                })
                :
                dispatch({
                  type: 'encoAuthSetting/reportSetting',
                  params:{
                  upt_staffid:this.state.upt_staffid,
                  arg_staff_id:staff_id,
                  tag:"insert",
                  report_type:this.state.oneRecord
                    }
                })
            }
        }else if (this.state.modalType === 'editModal'){
          //debugger
            const {dispatch} = this.props;
            this.state.currentKey=="1"?
            dispatch({
                type: 'encoAuthSetting/editAuth',
                category_uid_Arrs: this.state.oneRecord,
                record: this.state.record,
            })
            :
            dispatch({
            type: 'encoAuthSetting/reportSetting',
            params:{
            upt_staffid:this.state.upt_staffid,
            arg_staff_id:this.state.record.staff_id,
            tag:"update",
            report_type:this.state.oneRecord.map(item=>{
               let obj ={
                ...item,
                staff_id:this.state.record.staff_id
               }
              return obj 
          })
        }
        })
      }
        this.setState({
            modalVisible: false,
            oneRecord: [],
            oneRecordOld: [],
        })

        this.refs.AddAuthModal.setSelectData('')
    }


    modalCancel = () => {
        this.setState({
            modalVisible: false,
            oneRecord: [],
            oneRecordOld: [],
        })
    }


    lablesChange = (values) => {
        let checker_id = this.refs.AddAuthModal.getSelectData()
        let valuesObjArry;
        if( this.state.currentKey=="1"){
        valuesObjArry = values.map(item1=>({
          "category_name": item1,
          "category_uid": this.props.allCategoryList.filter(
              item2=>item2.category_name===item1)[0].category_uid,
      }))
        }else{
        valuesObjArry = values.map(item3=>{
         let arr= this.props.reportTypeList.filter(item4=>item4.name==item3)
          return {
          "report_name": item3,
          "report_uid": arr[0].code,
          "staff_id":checker_id//添加的时候能获取要用户的id编辑的时候不能
         }
      
        })
        }
        
      this.setState({
          oneRecord: valuesObjArry,
      })
    }

    callback=(key)=>{
      this.setState({
      currentKey:key
      })
    }

    render(){

        const {categoryList, allCategoryList,reportList,reportTypeList} = this.props;
        let {currentKey}=this.state
        return (
            <div className={Style.wrap}>
              <Tabs defaultActiveKey="1" onChange={this.callback}>
              <TabPane tab="激励信息权限配置" key="1">
              <div style={{marginBottom: 10}}>
                    <Button
                        type={'primary'}
                        onClick={() => this.showModal('addModal')}
               >
                        添加
                    </Button>
                </div>
                <Table
                    className={tableStyle.orderTable}
                    dataSource={categoryList}
                    columns={this.columns}
                    bordered
                />
             </TabPane>
             <TabPane tab="激励报告权限配置" key="2">
             <div style={{marginBottom: 10}}>
                    <Button
                        type={'primary'}
                        onClick={() => this.showModal('addModal')}
               >
                        添加
                    </Button>
                </div>
                <Table
                    className={tableStyle.orderTable}
                    dataSource={reportList}
                    columns={this.report_columns}
                    bordered
                />
            </TabPane>
              </Tabs>

                <Modal
                    width='800px'
                    title={currentKey=="1"?"权限信息":"报告信息"}
                    visible={this.state.modalVisible}
                    onOk={() => this.modalOk()}
                    onCancel={() => this.modalCancel()}
                >
                    <AddAuthModal
                        ref={'AddAuthModal'}
                        notEditable={this.state.modalType === 'detailModal'}
                        modalType={this.state.modalType}
                        oneRecord={this.state.oneRecord}
                        lablesChange={(values) => this.lablesChange(values)}
                        allMachList={currentKey=="1"?allCategoryList:reportTypeList}
                        title={currentKey=="1"?"权限":"报告"}
                        currentKey={currentKey}
                    />
                </Modal>
            </div>)
    }
  }

function mapStateToProps(state) {
    const {categoryList, allCategoryList,reportList,reportTypeList} = state.encoAuthSetting;
    return {
        categoryList,
        allCategoryList,
        loading: state.loading.models.encoAuthSetting,
        reportList,
        reportTypeList
    };
}

export default connect(mapStateToProps)(EncoAuthSetting)
