/**
 * 作者：王旭东
 * 创建日期：2018-11-16
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：选取配合部门人员组件
 */
import {Tree, TreeSelect, Input, message, Spin} from 'antd';
import request from '../../../../../utils/request';
import config from "../../../../../utils/config";

const TreeNode = Tree.TreeNode;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const Search = Input.Search;

let gData = [];
const dataList = [];
const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        const title = `${node.title}(${node.key})`;
        dataList.push({key, title});
        if (node.children) {
            generateList(node.children);
        }
    }
};

// 返回父节点的key值
const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some(item => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};

class SelectCoopDeptPerson extends React.PureComponent {
    state = {
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        selectedKeys: '', // 选中的成员
        selectNode: {}, // 选中的node对象
        loading: true,  // 默认显示加载符号
    }
    getData = () => {
        let dataNode = this.state.selectNode;
        dataNode.dept_name = dataNode.deptname;
        dataNode.dept_id = dataNode.deptid;
        return [dataNode]; // 原始页面可同时添加多个部门，要求数组形式
    }
    /**
     * 将服务返回的数据转成树形结构的数据，根据
     * @param deptPersonList
     * @returns {Array}
     */
    dataToJSON = (deptPersonList) => {
        let finalJson = []; // 最终返回的参数
        let rootItem = {};
        deptPersonList.map((item, index) => {
            if (item.deptid === '00000000000000000000000000000000') { // 表示根部门
                rootItem = item;
            }
        })

        let deptListData = deptPersonList.filter(item => item.is_user === '0') // 全部的部门数据数组
        let personListData = deptPersonList.filter(item => item.is_user === '1') // 全部的人员数据数组


        // 分院节点添加上
        deptListData.forEach((deptitem) => {
            if (deptitem.deptid === rootItem.userid) { // 找到分院
                finalJson.push({
                    title: deptitem.username,
                    value: deptitem.userid,
                    key: deptitem.userid,
                    selectable: false,
                    children: [],
                })
            }
        })

        // 添加部门节点
        deptListData.forEach(item1 => {
            finalJson.forEach(item2 => {
                if (item1.deptid === item2.key) {
                    item2.children.push({
                        title: item1.username,
                        value: item1.userid,
                        key: item1.userid,
                        selectable: false,
                        children: [],
                    })
                }
            })
        })

        // 将人加入部门节点下
        finalJson.forEach(item1 => { // 分院遍历
            item1.children.forEach(item2 => { // 部门遍历
                personListData.forEach(item3 => {  // 人员遍历
                    if (item3.is_select === '1') { // 1 可以选择
                        if (item2.key === item3.deptid) {
                            item2.children.push({
                                title: `${item3.username}(${item3.userid})`,
                                value: item3.userid,
                                key: `${item2.key}_${item3.userid}`, // 存在一个人在两个部门情况,采用 deptid_userid
                                selectable: true,
                            })
                        }
                    }

                })
            })
        })
        return finalJson;
    }

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    onChange = (e) => {
        const value = e.target.value;
        const expandedKeys = dataList.map((item) => {
            if (item.title.indexOf(value) > -1) {
                return getParentKey(item.key, gData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }

    onSelect = (selectedKeys) => {
        if (selectedKeys.length !== 0) {
            let orignData = this.state.deptPersonList;
            let selectedPerson = selectedKeys[0].split('_'); // 数组第一项是部门id  后一项是人员id
            let clickNode = orignData.filter(item => item.userid === selectedPerson[1]
                && item.deptid === selectedPerson[0])[0];
            if (clickNode.is_select === '1') {
                this.setState({
                    selectedKeys: selectedPerson[1],// 选中人员的id
                    selectNode: clickNode,//整个node原始节点
                });
            } else {
                message.info('该节点不可选取！')
            }
        }
    }

    // 走服务获取数据
    componentDidMount() {
        let {postData, searchUrl} = this.props;
        let oudata = request(searchUrl, postData);
        oudata.then((data) => {
            if (data.RetCode === '1') {
                this.setState({
                    loading: false,
                    deptPersonList: [...data.DataRows],
                });
            }
        })
    }

    render() {
        const {searchValue, expandedKeys, autoExpandParent} = this.state;
        const loop = data => data.map((item) => {
            const index = item.title.indexOf(searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const title = index > -1 ? (
                <span>
                    {beforeStr}
                    <span style={{color: '#f50'}}>{searchValue}</span>
                    {afterStr}
                    </span>
            ) : <span>{item.title}</span>;
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title} selectable={item.selectable}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title}/>;
        });

        let treeDiv = [];
        if (this.state.deptPersonList) {
            gData = this.dataToJSON(this.state.deptPersonList);
            generateList(gData);
            treeDiv = loop(gData);
        }

        return (
            <Spin tip={config.PROCESSING_DATA} spinning={this.state.loading}>
                <div>
                    <Search style={{marginBottom: 8}} placeholder="search" onChange={this.onChange}/>
                    <div style={{height: '350px', overflow: 'auto'}}>
                        <Tree
                            onExpand={this.onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            onSelect={this.onSelect}
                        >
                            {treeDiv}
                        </Tree>
                    </div>

                </div>
            </Spin>

        );

    }

}


export default SelectCoopDeptPerson
