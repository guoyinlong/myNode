/**
 * 作者：王旭东
 * 创建日期：2019-2-15
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：
 */
import {Tree, TreeSelect, Input, message, Spin} from 'antd';
import request from '../../utils/request';
import config from "../../utils/config";


class SelectPerson extends React.PureComponent {
    state = {
        selectedKeys: '',      // 选中的成员
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
            if (item.dept_pid === '00000000000000000000000000000000') { // 表示根部门
                rootItem = item;
            }
        })


        let deptListData = deptPersonList.filter(item => item.user_dept_flag === 'd') // 全部的部门数据数组
        let personListData = deptPersonList.filter(item => item.user_dept_flag === 'u') // 全部的人员数据数组


        // 分院节点添加上
        deptListData.forEach((deptitem) => {
            if (deptitem.dept_pid === rootItem.dept_id) { // 找到分院
                finalJson.push({
                    title: deptitem.dept_name,
                    value: deptitem.dept_id,
                    key: deptitem.dept_id,
                    selectable: false,
                    children: [],
                })
            }
        })

        // 添加部门节点
        deptListData.forEach(item1 => {
            finalJson.forEach(item2 => {
                if (item1.dept_pid === item2.key) {
                    item2.children.push({
                        title: item1.dept_name,
                        value: item1.dept_id,
                        key: item1.dept_id,
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
                    if (item2.key === item3.dept_pid) {
                        item2.children.push({
                            title: `${item3.dept_name}(${item3.dept_id})`,
                            value: item3.dept_id,
                            key: `${item2.key}_${item3.dept_id}`, // 存在一个人在两个部门情况,采用 dept_pid_dept_id
                            selectable: true,
                        })
                    }
                })
            })
        })
        return finalJson;
    }


    onSelect = (selectedKeys) => {
        this.props.setSelectData(selectedKeys)
    }

    // 走服务获取数据
    componentDidMount() {
        let postData={argtenantid:'10010', argroleid:'6c1c455fdb1f11e7ad99008cfa042288'}
        let oudata = request('/microservice/serviceauth/roleuserget',postData);
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
        const {deptPersonList} = this.state;
        let gData = [];
        if (deptPersonList) {
            gData = this.dataToJSON(deptPersonList);
        }
        return (
            <Spin tip={config.PROCESSING_DATA} spinning={this.state.loading}>
                <TreeSelect
                    style={{width: 300}}
                    value={this.props.selectedKeys}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={gData}
                    placeholder="请选择人员"
                    onChange={this.onSelect}
                />
            </Spin>

        );

    }

}


export default SelectPerson
