/**
 * 作者：金冠超
 * 创建日期：2019-07-18
 * 邮件：jingc@itnova.com.cn
 * 文件说明：项目配置-审核设置 主体页面
 */
import React from 'react';
import { Table , Tabs , message , Button , Modal ,Icon } from 'antd';
import { connect } from 'dva';
import styles from './projCheck.less'
import  ProjInfoRole from './projCheck/projInfoRole';
import  ProjInfoTache from './projCheck/projInfoTache';
import  ProjInfoLdentity from './projCheck/projInfoLdentity';
import { getUuid } from '../../../../components/commonApp/commonAppConst.js';
import SelectCoopDeptPerson from '../../monitor/change/projChangeApply/selectCoopDeptPerson'
const TabPane = Tabs.TabPane;

class ProjCheck extends React.Component {
    constructor(props) {
        super(props);
       this.state={
           flag:"",
           visible: false,
           assignVisible: false,
           addNewVisible:false,//新增模态框状态
           ConfirmVisible:false,
           delModalVisible:false,//移除模态框状态
           delprojVisible:false,//删除模态框状态
           modelKey:'',
           selectedKeys:'',
           userName:"",
           deptName:"",
           delRelationId:"",
           delValue:"",//删除的id数据
           delFlag:"",//指定删除的来源
           fromFlag:"",//区别新增与更新的区别
           oldMsg:{},
           role_name:""
       } 
      }
      //选定用户的修改值
      setSelectData = (selectedKeys) => {
        this.setState({
            selectedKeys,
        })
    }
    //新增按钮
    addProjClick = (key) => {
        this.setState({
            flag:key,
            visible:true,
            fromFlag:'add',
            oldMsg:{},
            modelKey: getUuid(32,64)
        })

    };

    //删除按钮事件
    delProjClick = (value) =>{
        this.setState({delprojVisible:true,delValue:value})
        if('ldentity_id' in value){this.setState({delFlag:'ldentity'})}
        if('tache_id' in value){this.setState({delFlag:'tache'})}
        if('role_id' in value){this.setState({delFlag:'role'})}
    }
    //修改按钮事件
    changeprojClick = (value) => {
        if('ldentity_id' in value){
            this.setState(
                {
                    flag:'ldentity',
                    visible:true,
                    fromFlag:'update',
                    oldMsg:value,
                    modelKey: getUuid(32,64)
                }
                )
            }
        if('tache_id' in value){
            this.setState(
                {
                    flag:'tache',
                    visible:true,
                    fromFlag:'update',
                    oldMsg:value,
                    modelKey: getUuid(32,64)
                }
                )
        }
        if('role_id' in value){
            this.setState(
                {
                    flag:'role',
                    visible:true,
                    fromFlag:'update',
                    oldMsg:value,
                    modelKey: getUuid(32,64)
                }
                )
                this.props.dispatch({
                    type:'projCheck/addRoleId',
                    value:value.role_id
                })
        }
    }
    // 确认删除模态框事件
    handleDelProj = ()=>{
        if(this.state.delFlag == "ldentity"){
            this.setState({delprojVisible:false})
            this.props.dispatch({
                type:'projCheck/delLdentity',
                value:this.state.delValue,
                callback:(RetCode)=>{
                    if(RetCode == "1"){
                        message.success('删除成功');
                    }
                }
            })
        }
        if(this.state.delFlag == "tache"){
            this.setState({delprojVisible:false})
            this.props.dispatch({
                type:'projCheck/delTache',
                value:this.state.delValue,
                callback:(RetCode)=>{
                    if(RetCode == "1"){
                        message.success('删除成功');
                        
                    }
                }
            })
        }
        if(this.state.delFlag == "role"){
            this.setState({delprojVisible:false})
            this.props.dispatch({
                type:'projCheck/delRole',
                value:this.state.delValue,
                callback:(RetCode)=>{
                    if(RetCode == "1"){
                        message.success('删除成功');
                        
                    }
                }
            })
        }
    }
    // 模态框确认事件
    handleOk = () => {
          if(this.state.flag == "ldentity" ){
            this.refs.ldentityModal.validateFields((err, values) => {
                if (!err) {
                    this.props.dispatch({
                        type:this.state.fromFlag == 'add' ? 'projCheck/addLdentity' : (this.state.fromFlag == 'update' ? 'projCheck/updateLdentity' : null),
                        value:values,
                        callback:(RetCode)=>{
                            if(RetCode == "1"){
                                message.success('保存成功');
                                this.setState({visible:false})
                            }
                        }
                    })
                }
             
              });

        }
          if(this.state.flag == "tache" ){
            this.refs.tacheModal.validateFields((err, values) => {
                if(!err){
                    this.props.dispatch({
                        type:this.state.fromFlag == 'add' ? 'projCheck/addTache' : (this.state.fromFlag == 'update' ? 'projCheck/updateTache' : null),
                        value:values,
                        callback:(RetCode)=>{
                            if(RetCode == "1"){
                                message.success('保存成功');
                                this.setState({visible:false})
                            }
                        }
                    })
                }
            })
        }
        if(this.state.flag == "role" ){
            this.refs.roleModal.validateFields((err, values) => {
                if(!err){
                    this.props.dispatch({
                        type:this.state.fromFlag == 'add' ? 'projCheck/addRole' : (this.state.fromFlag == 'update' ? 'projCheck/updateRole' : null),
                        value:values,
                        callback:(RetCode)=>{
                            if(RetCode == "1"){
                                message.success('保存成功');
                                this.setState({visible:false})
                            }
                        }
                    })
                }
            })
        }
    }

    // 模态框关闭事件
    handleCancel = () => {
        this.setState({
            visible:false,
            addNewVisible:false,
            ConfirmVisible:false,
            delModalVisible:false,
            delprojVisible:false}
            )
    }
    // 点击分配用户事件
    assignUser = (value) =>{
        this.setState({assignVisible:true,role_name:value.role_name})
        this.props.dispatch({
            type:'projCheck/addRoleId',
            value:value.role_id
        })
    }
    // 点击新增用户的icon
    addNewUser = () =>{
        this.setState({
            addNewVisible:true,
            selectedKeys:""})
        // this.props.dispatch({
        //     type:'projCheck/getMessageList'
        // })
    }

   
    handleNext = () => {
        // this.props.dispatch({
        //     type:'projCheck/inquireMessage',
        //     value:this.state.assignUser,
        //     callback:(item)=>{
                this.setState(
                    {
                        userName:this.refs.assignDeptComp.getData(true)[0].username,
                        deptName:this.refs.assignDeptComp.getData(true)[0].dept_name,
                        userId:this.refs.assignDeptComp.getData(true)[0].userid,
                        deptId:this.refs.assignDeptComp.getData(true)[0].dept_id,
                        ConfirmVisible:true,
                        addNewVisible:false
                    })
        //     }
        // })
    }
    // 点击清空，去除角色所属部门
    handleClear = () => {
        this.setState({deptName:"",deptId:""})
    }
    // 点击确认，增加关联用户信息
    handleConfirm = () => {
        this.props.dispatch({
            type:'projCheck/increaseUser',
            value:{userId:this.state.userId,deptId:this.state.deptId},
            callback:(RetCode)=>{
                if(RetCode == "1"){
                    message.success('保存成功');
                    this.setState({            
                        visible:false,
                        addNewVisible:false,
                        ConfirmVisible:false})
                }
            }
        })
    }
    // 点击移除模态框确认按钮，确认移除
    handleDelUser = () =>{
        this.props.dispatch({
            type:'projCheck/delUser',
            value: this.state.delRelationId,
            callback:(RetCode)=>{
                if(RetCode == "1"){
                    message.success('删除成功');
                    this.setState({            
                        visible:false,
                        addNewVisible:false,
                        ConfirmVisible:false,
                        delModalVisible:false})
                }
            }
        })
    }
    // 点击"移除"按钮
    delUser = (value) =>{
        this.setState({delModalVisible:true,delRelationId:value})
    }

//业务标识表单内容
    ldentityColumns = [
        {
            title: '序号',
            dataIndex: '',
            width: '9%',
            render:(text, record, index)=>{return <div style={{textAlign:"center"}}>{index+1}</div>}
        },
        {
            title: '业务标识编号',
            dataIndex: 'ldentity_id',
            width: '12%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'left'}}>{text}</div>
                )
            }
        },
        {
            title: '业务标识名称',
            dataIndex: 'ldentity_name',
            width: '18%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'left'}}>{text}</div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'ldentity_state',
            width: '9%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'center'}}>{(text == "1"?"开":"关")}</div>
                )
            }
        },
        {
            title: '备注',
            dataIndex: 'ldentity_note',
            width: '18%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'left'}}>{text}</div>
                )
            }
        },{
            title: '操作',
            dataIndex: '',
            width: '12%',
            render: (text, record, index) => {
                return (
                    <div >
                        <Button type="primary" style={{marginLeft:2}} onClick={()=>{this.changeprojClick(record)}}>修改</Button>
                        <Button type="primary" style={{marginLeft:2,marginTop:2,marginBottom:2}} onClick={()=>this.delProjClick(record)}>删除</Button>
                    </div>
                )
            }
        }

    ]

//审核环节表单内容
    tacheColumns = [
        {
            title: '序号',
            dataIndex: '',
            width: '9%',
            render:(text, record, index)=>{return <div style={{textAlign:"center"}}>{index+1}</div>}
        },
        {
            title: '环节编号',
            dataIndex: 'tache_id',
            width: '18%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'left'}}>{text}</div>
                )
            }
        },
        {
            title: '环节名称',
            dataIndex: 'tache_name',
            width: '14%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'left'}}>{text}</div>
                )
            }
        }, {
            title: '操作',
            dataIndex: '',
            width: '12%',
            render: (text, record, index) => {
                return (
                    <div >
                        <Button type="primary" style={{marginLeft:2}} onClick={()=>this.changeprojClick(record)}>修改</Button>
                        <Button type="primary" style={{marginLeft:2,marginTop:2,marginBottom:2}} onClick={()=>this.delProjClick(record)} >删除</Button>
                    </div>
                )
            }
        }
    ]


// 审核角色表单内容
    roleColumns = [
        {
            title: '序号',
            dataIndex: '',
            width: '9%',
            render:(text, record, index)=>{return <div style={{textAlign:"center"}}>{index+1}</div>}
        }, {
            title: '角色名称',
            dataIndex: 'role_name',
            width: '18%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'left'}}>{text}</div>
                )
            }
        }, {
            title: '角色简称',
            dataIndex: 'role_abbreviation',
            width: '12%',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign:'left'}}>{text}</div>
                )
            }
        }, {
            title: '角色类型',
            dataIndex: 'role_type',
            width: '10%',
            render: (text) => {
                if (text !== undefined) {
                    return (
                        <div style={{textAlign:'center'}}>
                            {
                                (
                                    text == "1" 
                                    ? 
                                    "财务"
                                    :
                                    (
                                        text == "2"
                                        ?
                                        "中心经理"
                                        :
                                        (text == "3" 
                                        ?
                                        "归属部门经理"
                                        :
                                        ""
                                        )
                                        )
                                )
                                }
                        </div>
                    );
                } else {
                    return '';
                }
            }
        },{
            title: '创建时间',
            dataIndex: 'build_time',
            width: '10%',
            render: (text) => {
                if (text !== undefined) {
                    return (
                        <div style={{textAlign:'center'}}>
                            {text}
                        </div>
                    );
                } else {
                    return '';
                }
            }
        },{
            title: '最近更新时间',
            dataIndex: 'rebuild_time',
            width: '10%',
            render: (text) => {
                if (text !== undefined) {
                    return (
                        <div style={{textAlign:'center'}}>
                            {text}
                        </div>
                    );
                } else {
                    return '';
                }
            }
        }
        , {
            title: '操作',
            dataIndex: '',
            width: '12%',
            render: (text, record, index) => {
                return (
                    <div >
                        <Button type="primary" style={{marginLeft:2}} onClick={()=>this.changeprojClick(record)}>修改</Button>
                        <Button type="primary" style={{marginLeft:2,marginTop:2,marginBottom:2}} onClick={()=>{this.delProjClick(record)}} >删除</Button>
                        <Button type="primary" style={{marginLeft:2}} onClick={()=>this.assignUser(record)}>分配用户</Button>
                    </div>
                )
            }
        }];
//审核角色关联表
    assignUserColumns = [
        {
            title: '序号',
            dataIndex: '',
            width: '9%',
            render:(text, record, index)=>{return <div style={{textAlign:"center"}}>{index+1}</div>}
        },{
            title: '员工姓名',
            dataIndex:'user_name',
            width:'18%',
            render:(text, record, index) => {
                return (
                    <div style={{textAlign:'center'}}>{text}</div>
                )
            }
        },{
            title: '员工编号',
            dataIndex:'user_id',
            width:'18%',
            render:(text, record, index) => {
                return (
                    <div style={{textAlign:'center'}}>{text}</div>
                )
            }
        },{
            title: '部门名称',
            dataIndex:'dept_name',
            width:'18%',
            render:(text, record, index) => {
                return (
                    <div style={{textAlign:'left'}}>{text}</div>
                )
            }
        },{
            title: '操作',
            dataIndex: '',
            width: '9%',
            render: (text, record, index) => {
                return (
                    <div>
                        <Button type="primary" style={{marginLeft:2}} onClick={()=>this.delUser(record.relation_id)}>移除</Button>
                    </div>
                )
            }
        }
    ]
//点击分派用户生成附属表，表内容为
// 头文字分配用户
// 左侧二级标题角色名称
// 添加按钮左上（icon图标）
// 表格内容 序号 员工姓名 员工编号 部门名称 操作（移除按钮）
     render(){
        return (
                <div style={{paddingTop: 13, paddingBottom: 16, background: 'white'}}>
                    <div style={{paddingLeft: 15, paddingRight: 15}}>
                        <p style={{textAlign: 'center', fontSize: '20px', marginBottom: '10px'}}>审核设置</p>
                    </div>
                    <Tabs>
                        <TabPane tab='业务标识' key= '0'>
                        <div style={{paddingTop: 13, paddingBottom: 16, background: 'white'}}>
                            <div style={{paddingLeft: 15, paddingRight: 15}}>
                                <div style={{marginTop:2}}>
                                    <div >
                                        <p style = {{marginBottom:"16px",whiteSpace: "pre-wrap"}} >
                                            {this.props.ldentityInfo}
                                        </p>
                                            <Button type="primary" onClick={()=>this.addProjClick("ldentity")}>新增</Button>
                                        </div>
                                    </div>
                                    <div >    
                                        <Table columns={this.ldentityColumns}
                                            bordered={true}
                                            rowKey={record => record.id}
                                            dataSource={this.props.ldentityList}
                                            pagination={true} 
                                            className={styles.orderTable}
                                            style={{marginTop:'20px'}}
                                        />
                                        </div>
                                </div>
                                
                            </div>
                            </TabPane> 
                        

                        <TabPane tab='审核环节' key= '1'>
                        <div style={{paddingTop: 13, paddingBottom: 16, background: 'white'}}>
                            <div style={{paddingLeft: 15, paddingRight: 15}}>
                                <div style={{marginTop:2}}>
                                    <div >
                                        <p style = {{marginBottom:"16px",whiteSpace: "pre-wrap"}} >
                                            {this.props.tacheInfo}
                                        </p>
                                            <Button type="primary" onClick={()=>this.addProjClick("tache")} >新增</Button>
                                        </div>
                                    </div>
                                    <div >    
                                        <Table columns={this.tacheColumns}
                                            bordered={true}
                                            rowKey={record => record.id}
                                            dataSource={this.props.tacheList}
                                            pagination={true} 
                                            className={styles.orderTable}
                                            style={{marginTop:'20px'}}
                                        />
                                        </div>
                                </div>
                                
                            </div>
                            </TabPane>

                        <TabPane tab='审核角色' key= '2'> 
                        <div style={{paddingTop: 13, paddingBottom: 16, background: 'white'}}>
                            <div style={{paddingLeft: 15, paddingRight: 15}}>
                                <div style={{marginTop:2}}>
                                    <div >
                                        <p style = {{marginBottom:"16px",whiteSpace: "pre-wrap"}} >
                                            {this.props.roleInfo}
                                        </p>
                                            <Button type="primary" onClick={()=>this.addProjClick("role")}>新增</Button>
                                        </div>
                                    </div>
                                    <div >    
                                        <Table columns={this.roleColumns}
                                            bordered={true}
                                            rowKey={record => record.id}
                                            dataSource={this.props.roleList}
                                            pagination={{pageSize:5,onChange:()=>this.setState({assignVisible:false})}}
                                            className={styles.orderTable}
                                            style={{marginTop:'20px'}}
                                        />

                                        </div>
                                </div>
                            </div>
                            {
                                this.state.assignVisible
                                ?
                                
                                <div style={{paddingTop: 13, paddingBottom: 16, background: 'white',marginTop:23}}>
                                <div style={{paddingLeft: 15, paddingRight: 15}}>
                                    <hr/>
                                </div>
                                <div style={{paddingLeft: 15, paddingRight: 15}}>
                                <div style={{paddingLeft: 15, paddingRight: 15}}>
                                    <p style={{textAlign: 'center', fontSize: '20px', marginBottom: '10px'}}>分配用户</p>
                                </div>
                                <div style={{marginTop:5}}>
                                        <p>角色名称是：<b>{this.state.role_name}</b></p>
                                        </div>
                                    <div style={{marginTop:5}}>
                                        <Icon type="plus-circle" style={{fontSize:40,color:"#fa7252"}} onClick={this.addNewUser} />
                                        </div>
                                        <Table columns={this.assignUserColumns}
                                                    bordered={true}
                                                    rowKey={record => record.id}
                                                    pagination={{pageSize:5 }}
                                                    dataSource={this.props.assignUserList} 
                                                    className={styles.orderTable}
                                                    style={{marginTop:'20px'}}
                                                />
                                    </div>
                                </div>

                                :
                                null
                            }

                        </TabPane>
                    </Tabs>
                    {/* 新增条目模态框 */}
                    <Modal
                        width={1000}
                        title="新增信息"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        key={this.state.modelKey}
                        >
                            {this.state.flag == "ldentity"
                            ?
                            <ProjInfoLdentity 
                                ref='ldentityModal'
                                oldMsg={this.state.oldMsg}
                                fromFlag={this.state.fromFlag}
                                />
                            :
                            (this.state.flag == "tache"
                                ?
                                <ProjInfoTache 
                                    ref='tacheModal'
                                    oldMsg={this.state.oldMsg}
                                    fromFlag={this.state.fromFlag}
                                    />
                                :
                                (this.state.flag == "role"
                                    ?
                                    <ProjInfoRole 
                                        ref='roleModal'
                                        oldMsg={this.state.oldMsg}
                                        fromFlag={this.state.fromFlag}
                                        />:
                                    null)
                                )
                            }
                            
                        </Modal>
                        {/* 添加人员模态框 */}
                        <Modal
                        width={700}
                        title="添加人员"
                        visible={this.state.addNewVisible}
                        okText={"下一步"}
                        onOk={this.handleNext}
                        onCancel={this.handleCancel}
                        >
                        <div style={{marginBottom: 10}}>
                            <span style={{marginBottom: 10}}>员工：</span>
                            <span>
                                {/* <SelectPerson
                                    key={getUuid(32,64)}
                                    setSelectData={this.setSelectData}
                                    selectedKeys={this.state.selectedKeys}
                                    ref={'selectPerson'}
                                /> */}
                                <SelectCoopDeptPerson
                                ref='assignDeptComp'
                                postData={{arg_tenantid:'10010',arg_proj_id:this.state.role_id}}
                                searchUrl={'/microservice/project/common_get_user_dept'}
                                key={getUuid(32,64)}
                            />
                            </span>
                        </div>
                        </Modal>

                        {/* 确认信息模态框 */}
                        <Modal
                        width={500}
                        title="确认信息"
                        visible={this.state.ConfirmVisible}
                        footer={[
                            <Button key='Ok' type='primary' onClick={this.handleConfirm}>确认</Button>,
                            <Button key='Cancel' onClick={this.handleCancel}>取消</Button>,

                        ]}
                        >
                        <div style={{marginBottom: 10}}>
                                <p>姓名:{this.state.userName}</p>
                    <p>部门:{this.state.deptName} {this.state.deptName !== "" ? <a onClick={this.handleClear}>清空</a> : null} </p>
                        </div>
                        </Modal>
                        {/* 移除模态框 */}
                        <Modal
                        width={500}
                        title="确认操作"
                        visible={this.state.delModalVisible}
                        onOk={this.handleDelUser}
                        onCancel={this.handleCancel}
                        >   
                            <h2 >确认移除该用户？</h2>
                        </Modal>
                        {/* 删除确认模态框 */}
                        <Modal
                        width={500}
                        title="确认操作"
                        visible={this.state.delprojVisible}
                        onOk={this.handleDelProj}
                        onCancel={this.handleCancel}
                        >   
                            <h2 >确认删除该条数据？</h2>
                        </Modal>        

                </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.projCheck,
        ...state.projCheck
    };
}
export default connect(mapStateToProps)(ProjCheck);


