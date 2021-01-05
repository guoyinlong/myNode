/**
 * 作者：金冠超
 * 创建日期：2019-08-18
 * 邮件：jingc@itnova.com.cn
 * 文件说明：项目配置-审核设置 主体页面
 */
import React from 'react';
import { Table  , message , Button , Modal ,Icon,Row,Col ,Select, Input} from 'antd';
import { connect } from 'dva';
import styles from './projCheck.less'
import { getUuid } from '../../../../components/commonApp/commonAppConst.js';
import  ProjInfo from './projTravel/projInfo';
import ProjDetails from './projTravel/projDetails'
import ProjEdit from './projTravel/projEdit'
const Option = Select.Option;
class ProjTravel extends React.Component {
    constructor(props) {
        super(props);
       this.state={
           addVisible: false,
           delVisible: false,
           detailsVisible:false,
           editOne:{},
           editVisible:false,
           delDeptId:"",//暂存删除值
           inputUuid:"inputUuid",
           selectUuid:"selectUuid"
       } 
      }
    /**
     * 作者：金冠超
     * 创建日期：2019-8-14
     * 功能：点击新增按钮
     */
      addNewMessage = () =>{
          this.setState({addVisible:true})
      }
    /**
     * 作者：金冠超
     * 创建日期：2019-8-14
     * 功能：点击移除按钮
     */
    delMessage = (value) =>{
        this.setState({
            delVisible:true,
            delDeptId:value
        })
    }
    /**
     * 作者：金冠超
     * 创建日期：2019-8-14
     * 功能：模态框关闭事件
     */
    handleCancel = () => {
        this.setState({
            addVisible:false,
            delVisible:false,
            detailsVisible:false,
            editVisible:false
        })
    }
    /**
     * 作者：金冠超
     * 创建日期：2019-8-14
     * 功能：新增模态框确认事件
     */
    handleOk = ()=>{
        this.refs.addNewModal.validateFields((err, values) => {
            if (!err) {
                this.setState({addVisible:false})
                this.props.deptList.map(
                    (item)=>{
                        if(item.pu_dept_id == values.dept_id){
                             values.dept_name = item.pu_dept_name
                        }
                    }
                    )
                 this.props.dispatch({
                     type:'projTravel/addNewMessage',
                     value:values,
                     callback:(RetCode)=>{
                         if(RetCode == "1"){
                             message.success('保存成功');
                         }
                     }
                 })
            }
          });
    }
    /**
     * 作者：金冠超
     * 创建日期：2019-8-14
     * 功能：删除模态框确认事件
     */
    handleDel = () =>{
        this.props.dispatch({
            type:'projTravel/delMessage',
            value:this.state.delDeptId,
            callback:(RetCode)=>{
                if(RetCode == "1"){
                    message.success('删除成功');
                    this.setState({delVisible:false})
                }
            }
        })
    }
    /**
     * 作者：金冠超
     * 创建日期：2019-8-14
     * 功能：查询详情信息
     */
    detailsMessage = (value)=>{
        this.props.dispatch({
            type:'projTravel/detailsMessage',
            value:value,
            callback:(RetCode)=>{
                if(RetCode == "1"){
                    this.setState({detailsVisible:true})
                }
            }
        })
    }
    /**
    * 作者：金冠超
    * 创建日期：2019-8-14
    * 功能：修改模态框确认事件
    */
    editOk = () =>{
            this.refs.projEdit.validateFields((err, values) => {
                if (!err) {
                    this.setState({editVisible:false})
                     this.props.dispatch({
                         type:'projTravel/updateMessage',
                         value:{arg_id:this.state.editOne.id,arg_budget_fee:values.arg_budget_fee,arg_remark:values.arg_remark},
                         callback:(RetCode)=>{
                             if(RetCode == "1"){
                                 message.success('保存成功');
                             }
                         }
                     })
                }
              });
    }
    /**
    * 作者：彭东洋
    * 创建日期：2020-03-03
    * 功能：查询归属部门和时间
    */
    searchDtat = () => {
        const {dispatch} =this.props;
        dispatch({
            type:"projTravel/searchDtat"
        })
    }
    //当失去焦点时验证输入内容是否正确
    blur = (e) => {
        const {dispatch} = this.props;
        let value = e.target.value
        let reg = /^\d{4}$/
        let flg = reg.test(value)
        if(!flg && !!value){
            message.error("请输入4位数字")
            this.setState({
                inputUuid: getUuid(20,62)
            })
            return
        }
        const postData = {
            arg_year:e.target.value
        }
        dispatch({
            type: "projTravel/saveYears",
            postData
        })
    }
    /**
    * 作者：彭东洋
    * 创建日期：2020-03-03
    * 功能：保存查询的部门
    */
    saveDept = (value) => {
        const {dispatch} = this.props;
        const postData = {
            arg_deptname:value
        }
        dispatch({
            type:"projTravel/saveDept",
            postData
        })
    }
    //生成正确的数字
    getrealNum = (text) => {
        let midData = Number(text).toFixed(2).toString();
        let data = midData.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        return data;
    }
    //input输入框中只能输入数字
    oninput = (e) => {
        let value = e.target.value
        this.setState({
            inputValue: value.replace(/[^\d]/g,'')
        })
    }
    /**
    * 作者：彭东洋
    * 创建日期：2020-03-03
    * 功能：清空查询数据
    */
    clearDtat = () => {
        const {dispatch} = this.props;
        this.setState({
            inputUuid:getUuid(20,62),
            selectUuid: getUuid(20,62),
            inputValue:null
        })
        dispatch({
            type:"projTravel/clearDtat"
        })
    }
      Columns = [
        {
            title: '序号',
            dataIndex: '',
            width: '9%',
            render:(text, record, index)=>{return <div style={{textAlign:"center"}}>{index+1}</div>}
        }, {
            title: '年份',
            dataIndex: 'year',
            width: '9%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'center'}}>{text}</div>
                )
            }
        }, {
            title:'归属部门',
            dataIndex: 'deptname',
            width: '18%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'left'}}>{text}</div>
                )
            }
        }, {
            title: '差旅预算总额（元）',
            dataIndex: 'budgetfee',
            width: '18%',
            render: (text, record, index) => {
                return (
                        <div>
                            <Row>
                                {/* <Col span={18} style={{textAlign:'right'}}>{text.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}</Col> */}
                                <Col span={18} style={{textAlign:'right'}}>{this.getrealNum(text)}</Col>
                                <Col span={5} style={{textAlign:'right'}}>
                                    <Icon type="bianji" style={{fontSize:20}} onClick={()=>{this.setState({editVisible:true,editOne:record})}}/>
                                </Col>
                            </Row>
                            </div>
                )
            }
        },{
            title: '操作',
            dataIndex: '',
            width: '9%',
            render: (text, record, index) => {
                return (
                    <div >
                        <div><Button type="primary" style={{marginLeft:2,marginTop:2,marginBottom:2}} onClick={()=>{this.delMessage(record)}} >删除</Button></div>
                        <div><Button type="primary" style={{marginLeft:2,marginTop:2,marginBottom:2}} onClick={()=>{this.detailsMessage(record)}}>详情</Button></div>
                    </div>
                )
            }
        }];

        detailsColums=[
            {
                title: '序号',
                dataIndex: '',
                width: '9%',
                render:(text, record, index)=>{return <div style={{textAlign:"center"}}>{index+1}</div>}
            }, {
                title: '项目编号',
                dataIndex: 'proj_code',
                width: '18%',
                render: (text, record, index) => {
                    return (
                        <div style={{textAlign:'center'}}>{text}</div>
                    )
                }
            }, {
                title: '项目名称',
                dataIndex: 'proj_name',
                width: '18%',
                render: (text, record, index) => {
                    return (
                        <div style={{textAlign:'left'}}>{text}</div>
                    )
                }
            }, {
                title: '年份',
                dataIndex: 'year',
                width: '9%',
                render: (text, record, index) => {
                    return (
                        <div style={{textAlign:'center'}}>{text}</div>
                    )
                }
            },{
                title: '归属部门',
                dataIndex: 'dept_name',
                width: '18%',
                render: (text, record, index) => {
                    return (
                        <div style={{textAlign:'left'}}>{text}</div>
                    )
                }
            },{
                title: '项目经理',
                dataIndex: 'mgr_name',
                width: '9%',
                render: (text, record, index) => {
                    return (
                        <div style={{textAlign:'left'}}>{text}</div>
                    )
                }
            },{
                title: '预算(元)',
                dataIndex: 'fee',
                width: '9%',
                render: (text, record, index) => {
                    return (
                        <div style={{textAlign:'right'}}>{text}</div>
                    )
                }
            },
        ]

      render(){
        const deptSelect = this.props.deptList.map((item)=>{return <Option key={item.pu_dept_name}>{item.pu_dept_name}</Option>})
          return (
            <div style={{paddingTop: 13, paddingBottom: 16, background: 'white'}}>
                    <div style={{paddingLeft: 15, paddingRight: 15}}>
                        <p style={{textAlign: 'center', fontSize: '20px', marginBottom: '10px'}}>归属部门差旅预算</p>
                    </div>
            <div style={{paddingLeft: 15, paddingRight: 15}}>
                <div style={{marginTop:2}}>
                    <div style = {{display:"flex",justifyContent:"flex-end",alignItems:"center"}}>
                        部门名称： 
                        <Select 
                            style = {{width:"200px",marginRight:"20px"}}
                            onSelect = {this.saveDept}
                            key = {this.state.selectUuid}
                            dropdownMatchSelectWidth = {false}
                        >
                            {deptSelect}
                        </Select>
                        年份： 
                        <Input
                            style = {{width:"200px",marginRight:"20px"}}
                            onBlur = {this.blur}
                            onInput  = {this.oninput}
                            placeholder = "请输入4位数字"
                            key = {this.state.inputUuid}
                            value = {this.state.inputValue}
                        />
                        <Button type="primary"  onClick={this.searchDtat} style = {{marginRight:"20px"}}>查询</Button>
                        <Button type="primary"  onClick={this.clearDtat}>清空</Button>
                    </div>
                    <div>
                        <Button type="primary"  onClick={this.addNewMessage}>新增</Button>
                    </div>
                </div>
                    <div >    
                        <Table columns={this.Columns}
                            bordered={true}
                            rowKey={record => record.id}  
                            dataSource={this.props.itemList}
                            pagination={true} 
                            className={styles.orderTable}
                            style={{marginTop:'20px'}}
                        />
                        </div>
                </div>
                    {/* 新增模态框 */}
                    <Modal
                        width={600}
                        title="新增"
                        visible={this.state.addVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        key={getUuid(32,64)}
                        >
                        <ProjInfo 
                            ref='addNewModal' 
                            deptList={this.props.deptList}
                            />
                    </Modal>
                        {/* 移除模态框 */}
                         <Modal
                        width={500}
                        title="确认操作"
                        visible={this.state.delVisible}
                        onOk={this.handleDel}
                        onCancel={this.handleCancel}
                        >   
                            <h2 >确认删除<b>{this.state.delDeptId.year}</b>年<b>{this.state.delDeptId.deptname}</b>的预算么？</h2>
                        </Modal>
                        
                        {/* 详情模态框 */}
                    <Modal
                        width={900}
                        title="归属部门名称"
                        visible={this.state.detailsVisible}
                        footer={null}
                        onCancel={this.handleCancel}
                        >   
                            <ProjDetails detailsMessage={this.props.detailsList}/>
                        </Modal>
                    {/* 修改模态框 */}
                    <Modal
                        width={600}
                        title="修改"
                        visible={this.state.editVisible}
                        onOk={this.editOk}
                        onCancel={this.handleCancel}
                        key={getUuid(32,64)}
                        >   
                            <ProjEdit
                            ref='projEdit' 
                            editOne={this.state.editOne}
                            />
                        </Modal>
            </div>
          )
      }
    }
    function mapStateToProps(state) {
        return {
            loading: state.loading.models.projTravel,
            ...state.projTravel
        };
    }
    export default connect(mapStateToProps)(ProjTravel);

