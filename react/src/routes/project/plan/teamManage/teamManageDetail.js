/**
 * 作者：任华维
 * 日期：2018-1-4
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：团队管理
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Table, Icon, Popconfirm, Button, Tabs, Menu, Dropdown, Select, Modal  } from 'antd';
import TeamManageModal from './teamManageModal';
import styles from './teamManage.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const confirm = Modal.confirm;
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function TeamManageDetail({dispatch, loading, dataUp, dataDown, projectInfo, selected, checked, userList, visible, staffId, roleList, activeKey, inCheck, opt, historyList, childHistoryList}) {
// const data = value.DataRows.filter(item => item.proj_id === '40');
// for (let i = 0; i < data.length; i++) {
//     console.log(data[i].staff_name +"--"+ data[i].score +"--"+data[i].rank);
// }
    const isDone = (staffId === projectInfo.marId && (inCheck === '0' || !!opt));
    /**
    * 类型修改(主责、配合)
    *
    * @param {obj} user 成员.
    * @return void.
    */
    const typeUpdate = (user,e) => {
        if (user.type !== e.key) {
            dispatch({
                type:'teamManageDetail/typeUpdate',
                payload:{
                    id: user.id,
                    projId: projectInfo.projId,
                    type: e.key,
                    staffId: user.staffId
                    //updateBy:staffId,
                }
            });
        }

    }
    /**
    * 角色修改
    *
    * @param {array} value 变更后的角色id.
    * @param {array} record 变更前的角色obj.
    * @return void.
    */
    const roleChange = (value,record) => {
        const roles = record.roles || [];
        //每次操作只添加或删除一个角色，找出改变的角色id
        let result = null;
        if (value.length > roles.length) {
            for(let i = 0; i < value.length; i++){
                let isExist = false;
                for (let j = 0; j < roles.length; j++) {
                    if(value[i] === roles[j].roleId){
                        isExist = true;
                        break;
                    }
                }
                if(!isExist){
                    result = value[i];
                }
            }
            dispatch({
                type:'teamManageDetail/roleAddOrDelete',
                payload:{
                    staffId:record.staffId,
                    projId: projectInfo.projId,
                    roleId:result,
                    optType: "0"
                }
            });
        } else {
            for(let i = 0; i < roles.length; i++){
                let isExist = false;
                for(let j = 0; j < value.length; j++){
                    if(value[j] === roles[i].roleId){
                        isExist = true;
                        break;
                    }
                }
                if(!isExist){
                    result = roles[i].roleId;
                }
            }
            dispatch({
                type:'teamManageDetail/roleAddOrDelete',
                payload:{
                    staffId:record.staffId,
                    projId: projectInfo.projId,
                    roleId:result,
                    optType: "1"
                }
            });
        }
    }
    /**
    * 原始项目成员table
    */
    const columnsDown = [
        {
            title: '主建单位',
            dataIndex: 'ouName',
            render:(text)=>{
                if(!text) {
                  return "";
                }
                return text.includes('-') ?text.split('-')[1]:text;
            },
            width: '20%'
        },{
            title: '主建部门',
            render:(text, record, index)=>{
                const dep = record.deptName || "";
                return dep.includes("-") ? dep.split("-")[1] : dep;
                return "";
            },
            width: '20%'
        },{
            title: '员工编号',
            dataIndex: 'staffId',
            width: '10%'
        },{
            title:'姓名',
            dataIndex:'staffName',
            width: '10%'
        },{
            title:'角色',
            dataIndex:'roles',
            render:(text,record,index)=>{
                const children = roleList.map((item, index) => {
                    return (<Option key={item.roleId}>{item.roleName}</Option>);
                });
                const roleArr = record.roles || [];
                const value = roleArr.map((item, index) => {
                    return item.roleId;
                });
                const roles = roleArr.map((item, index) => {
                    return item.roleName;
                })
                return (
                    isDone
                    ?
                    <div style={{ position: 'relative' }} id={"area"+index}>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            defaultValue={value}
                            getPopupContainer={()=>document.getElementById('area'+index)}
                            maxTagCount={6}
                            value={value}
                            onChange={(value)=>roleChange(value,record)}
                        >
                            {children}
                        </Select>
                    </div>
                    :
                    roles.length ? roles.join('，') : '无'
                )
            },
            width: '25%'
        },{
            title:'类型',
            dataIndex:'type',
            render:(text, record)=>{
                const typeMenu = (
                    <Menu onClick={(e)=>typeUpdate(record,e)}>
                        {
                            text === '0'
                            ?
                            <Menu.Item key="1">配合</Menu.Item>
                            :
                            <Menu.Item key="0">主责</Menu.Item>
                        }
                    </Menu>
                );
                return (
                    isDone
                    ?
                    <Dropdown overlay={typeMenu}>
                        <span className="ant-dropdown-link">{text === '0' ? '主责' : '配合'}<Icon type="down" /></span>
                    </Dropdown>
                    :
                    text === '0' ? '主责' : '配合'
                );
            },
            width: '10%'
        },{
            title:'',
            dataIndex:'rolecount',
            render:(text, record)=>(
                isDone
                ?
                <Popconfirm title="确定退出吗？" onConfirm={() => delOldUser([record])}>
                    <a href="#">退出</a>
                </Popconfirm>
                :
                null
            ),
            width: '5%'
        }
    ];
    /**
    * 变更项目成员table
    */
    const columnsUp = [
        {
            title: '序号',
            dataIndex: 'id',
            render: (text, record, index) => index+1,
            width: '5%'
        },{
            title: '主建单位',
            dataIndex: 'ouName',
            render:(text)=>{
              if(!text) {
                return "";
              }
              return text.includes('-') ?text.split('-')[1]:text;
            },
            width: '20%'
        },{
            title: '主建部门',
            render:(text, record, index)=>{
              const dep = record.deptName || "";
              return dep.includes("-") ? dep.split("-")[1] : dep;
              return "";
            },
            width: '20%'
        },{
            title: '员工编号',
            dataIndex: 'staffId',
            width: '10%'
        },{
            title:'姓名',
            dataIndex:'staffName',
            width: '10%'
        },{
            title:'角色',
            dataIndex:'roles',
            render:(text, record, index)=>{
                const roleArr = record.roles || [];
                const array = roleArr.map((item, index) => {
                    return item.roleName;
                })

                return array.length ? array.join('，') : '无';
            },
            width: '20%'
        },{
            title:'类型',
            dataIndex:'type',
            render:(text)=>{
                return (text === '0' ? '主责' : '配合')
            },
            width: '5%'
        },{
            title:'操作',
            dataIndex:'opt',
            render:(text)=>{
                let str = ''
                switch(text){
                    case 'insert':
                        str = '加入';
                        break;
                    case 'delete':
                        str = '退出';
                        break;
                }
                return str;
            },
            width: '5%'
        },{
            title:'',
            dataIndex:'rolecount',
            render:(text, record)=>(
                isDone
                ?
                <Popconfirm title="确定删除吗？" onConfirm={() => delNewUser(record)}>
                    <a href="#">删除</a>
                </Popconfirm>
                :
                null
            )
        }
    ];
    /**
    * 删除原始成员
    *
    * @param {array} user 选中的成员对象数组.
    * @return void.
    */
    const delOldUser = (user) => {
        if (user.length) {
            //user可能是选中的，也可能是点击的右侧的退出
            //获取最新的选中数据
            let sel = selected;
            const array = user.map((item, index) => {
                sel = sel.filter(i => i.staffId !== item.staffId);
                return item.staffId;
                // return {
                //     projId:item.projId,
                //     ou:(item.ou.includes('-') ? item.ou.split('-')[1] : item.ou),
                //     staffId:item.staffId,
                //     staffName:item.staffName,
                //     tag:2,
                //     type:item.type,
                //     createBy:staffId,
                //     isOut:0,
                //     uuid:null
                // }
            })
            //删除选中项
            dispatch({
                type:'teamManageDetail/selectedRows',
                payload:sel
            });
            //删除成员
            dispatch({
                type:'teamManageDetail/deleteOldMembers',
                payload:{
                    projId:projectInfo.projId,
                    updateBy:staffId,
                    staffIds: array.length ? array.join(",") : ""
                }
            });
        }
    }
    /**
    * 删除变更成员
    *
    * @param {obj} user 选中的成员对象.
    * @return void.
    */
    const delNewUser = (user) => {
        dispatch({
            type:'teamManageDetail/deleteMembers',
            payload:{
                projId: projectInfo.projId,
                opt: user.opt,
                id: user.id
            }
        });
    }

    /**
    * 添加成员
    *
    * @param {array} user 选中的成员对象数组.
    * @return void.
    */
    const addUser = (user) => {
        if (user.length) {
            const array = user.map((item, index) => {
                return {
                    projId:projectInfo.projId,
                    ou:item.OU,
                    deptName:item.deptName,
                    staffId:item.staffId,
                    staffName:item.staffName,
                    tag:'0',
                    type: (1-item.type).toString(),
                    createBy: staffId,
                    isOut:'0',
                    uuid:null
                }
            })
            dispatch({
                type:'teamManageDetail/addMembers',
                payload:{
                    projId:projectInfo.projId,
                    createBy: staffId,
                    projTeamCheckList: array
                }
            });
        }
    }
    /**
    * 点击新增打开添加成员对话框
    */
    const showModal = () => {
        dispatch({
            type:'teamManageDetail/budgetDeptQuery',
            payload:{
                projId:projectInfo.projId
            }
        });
    }
    /**
    * 关闭添加成员对话框
    */
    const hideModal = () => {
        dispatch({
            type:'teamManageDetail/hideModal'
        });
    }
    /**
    * 添加成员对话框提交
    */
    const submitModal = (users) => {
        addUser(users.filter(item => !item.children));
        hideModal();
    }
    /**
    * 添加成员对话框选择成员
    */
    const checkUser = (users) => {
        dispatch({
            type:'teamManageDetail/checkedNodes',
            payload:users
        });
    }
    /**
    * 原始成员table选择行，做批量删除用
    */
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            dispatch({
                type:'teamManageDetail/selectedRows',
                payload:selectedRows
            });
            //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };
    /**
    * 团队变更提交
    */
    const submitTeam = (projectInfo) => {
        confirm({
            title: '确定要提交吗？',
            onOk() {
                const param = {
                    'projId': projectInfo.projId,
                    'projName': projectInfo.projName,
                    'deptName': projectInfo.projMainDep,
                    'createBy': projectInfo.marId,
                    'createByName' :projectInfo.marName,
                    'ouName': projectInfo.ouDefineName,
                    'ids': dataUp.map(item => item.id).join(",")
                };
                if (opt) {
                    param.opt = opt;
                }
                dispatch({
                    type:'teamManageDetail/projTeamSubmit',
                    payload:param
                });
            }
        });
    };
    /**
    * 数据分类：is_change 1为变更，0为原始
    */
    //const dataUp = dataSource.filter(item => item.isChange === "1" );
    //const dataDown = dataSource.filter(item => item.isChange === "0" && item.tag === '0' );
    /**
    * 切换tab
    */
    const tabChange = (key) => {
        const param = {
            //'projId': projectInfo.projId,
            ...projectInfo,
            'activeKey': key
        }
        if (opt) {
            param.opt = opt;
        }
        dispatch({
            type:'teamManageDetail/tabChange',
            payload:param
        });
    };

    const historyColumns = [
        {
            title: '序号',
            dataIndex: 'teamBatchid',
            render: (text, record, index) => index+1,
            width: '10%'
        },{
            title: '状态',
            dataIndex: 'nextCheckState',
            width: '10%'
        },{
            title: '创建人',
            dataIndex: 'createByName',
            width: '10%'
        },{
            title: "变更事项",
            dataIndex: "changeItems",
            width: "50%",
            align: "center",
            render: (text, record, index) => {
                let res = "";
                if(record.insertMembers && record.insertMembers.length > 0) {
                    const list = record.insertMembers || [];
                    res += "加入:" + list.join(",");
                }
                if(record.deleteMembers && record.deleteMembers.length > 0) {
                    const list = record.deleteMembers || [];
                    res += " 退出:" + list.join(",");
                }
                return  res;
            }
        },{
            title:'创建时间',
            dataIndex:'createTime',
            width: '20%'
        }
    ];
    const expandedRowRender = (record) => {
        const childColumns = [
            {
                title: '状态',
                dataIndex: 'tag',
                width: '10%'
            },{
                title: '环节名称',
                dataIndex: 'createBy',
                width: '15%'
            },{
                title: '审批人',
                dataIndex: 'updateBy',
                width: '10%'
            },{
                title:'审批类型',
                dataIndex:'checkState',
                render:(text)=>{
                    let str = ''
                    switch(text){
                        case '1':
                            str = '提交';
                            break;
                        case '2':
                            str = '部门经理通过';
                            break;
                        case '3':
                            str = '部门经理退回';
                            break;
                        case '4':
                            str = '提交到TMO';
                            break;
                        case '5':
                            str = 'TMO通过';
                            break;
                        case '6':
                            str = 'TMO退回';
                            break;
                    }
                    return str;
                },
                width: '20%'
            },{
                title:'审批意见',
                dataIndex:'reason',
                width: '20%'
            },{
                title:'审批时间',
                dataIndex:'updateTime',
                width: '20%'
            }
        ];
        return (
            <Table
                className = {styles.nestedTable}
                rowKey = {record => record.index}
                columns={childColumns}
                dataSource={childHistoryList[record.id]}
                pagination={false}
            />
        );

    };
    const projSeachList = (expanded, record) => {
        if (expanded) {
            dispatch({
                type:'teamManageDetail/projSeachList',
                payload:{
                    'projId': projectInfo.projId,
                    'teamBatchId': record.teamBatchid,
                    'id': record.id
                }
            });
        }
    }
    return (
        <div className={styles['pageContainer']}>
            <h2 style={{textAlign:'center'}}>
                <span>{projectInfo.projName}</span>
                {
                    inCheck==='1'
                    ?
                    <span style={{color:'red'}}>（审核中）</span>
                    :
                    null
                }
            </h2>
            <TeamManageModal loading={loading} checked={checked} checkUser={checkUser} userList={userList} visible={visible} cancelModal={hideModal} submitModal={submitModal}/>
            <Tabs activeKey={activeKey} onChange={tabChange}>
                <TabPane tab="人员信息" key="0">
                    {
                        isDone
                        ?
                        <div className={styles['table-operations']+" "+styles['right']}>
                            <Button type="primary" onClick={showModal}>加入</Button>
                            <Button type="primary" disabled={dataUp.length?false:true} onClick={()=>submitTeam(projectInfo)}>提交</Button>
                        </div>
                        :
                        null
                    }
                    {
                        dataUp.length
                        ?
                        <Table
                            className = {styles.orderTable+" "+styles['table-operations'] }
                            loading = {loading}
                            rowKey = {record => record.id}
                            columns = {columnsUp}
                            dataSource = {dataUp}
                            pagination = {false}
                        />
                        :
                        null
                    }
                    {
                        isDone
                        ?
                        <div className={styles['table-operations']}>
                            <Popconfirm title="确定退出吗？" onConfirm={() => delOldUser(selected)}>
                                {
                                    selected.length
                                    ?
                                    <Button type="primary">批量退出</Button>
                                    :
                                    <Button type="primary" disabled>批量退出</Button>
                                }
                            </Popconfirm>
                        </div>
                        :
                        null
                    }
                    <Table
                        className = {styles.orderTable+" "+styles['table-operations'] }
                        rowSelection={isDone ? rowSelection : null}
                        loading = {loading}
                        rowKey = {record => record.id}
                        columns = {columnsDown}
                        dataSource = {dataDown}
                        pagination = {false}
                    />
                </TabPane>
                <TabPane tab="审批记录" key="1">
                    <Table
                        className = {styles.orderTable}
                        loading = {loading}
                        rowKey = {record => record.id}
                        columns = {historyColumns}
                        dataSource = {historyList}
                        expandedRowRender={expandedRowRender}
                        onExpand={projSeachList}
                        pagination = {false}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.teamManageDetail,
        ...state.teamManageDetail
    };
}

export default connect(mapStateToProps)(TeamManageDetail);
