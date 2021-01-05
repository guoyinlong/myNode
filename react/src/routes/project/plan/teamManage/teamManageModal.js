/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：
 */
import React, { Component } from 'react';
import { Modal, Button, Tree, Input } from 'antd';
import {arrayToObjGroups} from '../../../../utils/func';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

function TeamManageModal({visible,loading,cancelModal,submitModal,userList,checkUser,checked}) {
    // const toggleModal = () => {
    //     this.setState({ visible: !this.state.visible });
    // }
    const checkedKeys = checked.map((item, index) => {
        return item.staffId;
    })
    const onCheck = (checkedKeys,e) => {
        const {checkedNodes} = e;
        const users = checkedNodes.map((item, index) => {
            return item.props;
        });
        checkUser(users);
    }
    const treeData = arrayToObjGroups(userList.filter(item => item.userDeptFlag === "u" ),"deptName");
    const renderTreeNodes = (data) => {
        return data.map((item,index) => {
            if (item.value) {
                return (
                    <TreeNode title={item.key} key={index}>
                        {renderTreeNodes(item.value)}
                    </TreeNode>
                );
            }
            const obj = {
                key: item.staffId,
                ...item
            };
            if (item.useFlg === '1') {
                obj.title = item.staffName;
            } else {
                obj.disableCheckbox = true;
                obj.title = <span style={{color:'#aaa'}}>{item.staffName}</span>
            }
            return <TreeNode {...obj}/>;
        });
    };
    return (
        <div>
            <Modal
                visible={visible}
                title="人员列表"
                //afterClose={()=>console.log(111)}
                onOk={()=>submitModal(checked)}
                onCancel={cancelModal}
                footer={[
                    <Button key="back" onClick={cancelModal}>取消</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={()=>submitModal(checked)}>确定</Button>
                ]}
                >
                <div style={{ height: '400px', overflow: 'auto' }}>
                    <Tree checkable onCheck={onCheck} checkedKeys={checkedKeys}>
                        {renderTreeNodes(treeData)}
                    </Tree>
                </div>
            </Modal>
        </div>
    );
}
export default TeamManageModal;
