/**
  * 作者： 彭东洋
  * 创建日期： 2019-10-12
  * 邮箱: pengdy@itnova.com.cn
  * 功能： 常用资料数据处理层
  */
import * as usersService from '../../../services/commonData/commonData.js';
import { message } from 'antd';
export default {
    namespace: 'commonData',
    state:{
        folderList: [], //文件夹列表
        userList: [],   //用户列表
        fileList: [],   //常用资料文件列表
        applyList: [],  //申请列表
        ApplyDetails: [], //申请详情
        visibleRange:[], //可见范围
        personRange: [], //按照人员查询的可见范围
        biographyList: [], //我的已传列表
        pathUrl: [],
        directoryList: [],
        staffList:[],
        configTotal: 0, //配置管理总条数
        commonDataTotal: 0, //常用资料总条数
        biographyTotal: 0, //我的已传总数
        radivoValue: "dept",
        uploadRadioValue: "dept",
        downloadInformation: [], //下载信息
        deptValue: [],
        deptId: [],
        firstDirectory: [],
        modalLoading: true,
        fileState: "3"
    },
    reducers: {
        save (state, action) {
            return {
                ...state,
                ...action.payload
            }
        }
    },
    effects: {
        //查询文件夹
        * queryFilePath({},{ call ,put }) {
            const {DataRows, RetCode } = yield call(usersService.queryFilePath,{});
            // _datas 数组数据源
            // _tns 新生成的数据源 
            let generateData = (_datas,_tns) => {
                let tns = _tns || [];
                if(_datas) {
                    _datas.map((v,i) => {
                        let index = i;
                        if(v.path_name || v['spPathName'] || v['tpPathName']) {
                            const children = [];
                            const key = v.path_id || v['spPathId'] || v['tpPathId'];
                            const value = v.path_id || v['spPathId'] || v['tpPathId'];
                            const title = v.path_name || v['spPathName'] || v['tpPathName'];
                            tns.push({key,title,children,value})
                            Object.keys(v).map((value,i) => {
                                if(value == 'secondPath' || value == "thirdPath") {
                                    let midleData = JSON.parse(Object.values(v)[i])
                                    return generateData(midleData,tns[index].children)
                                } 
                            });
                        }
                    });
                }  
            };
            if(RetCode == '1') {
                const DataList = JSON.parse(JSON.stringify(DataRows));
                const firstLevelDirectory = [];
                DataList.map((v) => {
                    firstLevelDirectory.push(v.path_name + "#" + v.path_id)
                });
                const realList = [];
                generateData(DataList,realList)
                yield put ({
                    type: "save",
                    payload: {
                        folderList: realList,
                        firstDirectory: firstLevelDirectory
                    }
                });
            } else{
                message.error("查询失败");
            }
        },
        //创建文件夹
        * createFilePath({data},{ call, put }) {
            const { RetCode } = yield call(usersService.createFilePath,{...data});
            if(RetCode == '1') {
                message.success("创建文件夹成功");
                yield put({
                    type: "queryFilePath",
                });
            } else {
                message.error("创建失败");
            }
        },
        //删除文件夹
        * delFilePath ({data},{ call, put}) {
            const { RetCode } = yield call(usersService.delFilePath,{...data});
            if(RetCode == '1') {
                message.success("删除成功");
                yield put({
                    type: "queryFilePath"
                });
            } else {
                message.error("删除失败");
            }
        },
        //修改文件夹
        * updateFilePath ({data}, { call, put}) {
            const { RetCode } = yield call(usersService.updateFilePath,{...data});
            if(RetCode == '1') {
                message.success("修改成功");
                yield put({
                    type: "queryFilePath"
                });
            } else {
                message.error("修改失败");
            }
        },
        //查询用户权限
        * queryManageRole ({},{ call, put }) {
            const { DataRows,RetCode } = yield call(usersService.queryManageRole);
            if(RetCode == '1') {
                const getFlag = (flag) => {
                    const bool = DataRows.some((item) => item.manage_role == flag);
                    return bool;
                };
                yield put({
                    type: "save",
                    payload:{
                        userList: DataRows,
                        btnStyle: getFlag("officeAdmin")
                    }
                });
            } else {
                message.error("查询失败");
            }
        },
        //创建用户
        * createRole ({data},{ call, put }) {
            let {dept_name,user_name} = data;
            const { RetCode } = yield call(usersService.createRole,{...data});
            let currentPage = data.arg_page_current;
            if(RetCode == '1') {
                if(data.arg_role == "pathAdmin") {
                    const data = {
                        arg_dept_name: dept_name,
                        arg_user_name: user_name,
                        arg_status: "1",
                        arg_page_current: currentPage,
                    };
                    yield put({
                        type: "queryManageList",
                        data
                    });
                } else {
                    const data = {
                        arg_dept_name: dept_name,
                        arg_user_name: user_name,
                        arg_status: "0",
                        arg_page_current: currentPage
                    };
                    yield put({
                        type: "queryManageList",
                        data
                    });
                }
                message.success("创建成功");
            } else {
                message.error("创建失败");
            }
        },
        //查询文件服务(按条件查询)
        * queryFileByTerm({ data },{ call,put }) {
            const { DataRows,RetCode,AllCount,RowCount } = yield call(usersService.queryFileByTerm,{...data});
            if(RetCode == '1') {
                    let tableList = JSON.parse(JSON.stringify(DataRows));
                    tableList.map((v,i) => {
                    v.index = i + 1;
                    v.path = v.path_url;
                    v.fileName = v.file_name + "." + v.postfix;
                    v.key = v.file_id;
                    });
                    if(data.arg_status == "1") {
                        yield put({
                            type: 'save',
                            payload: {
                                biographyList: tableList,
                                biographyTotal: Number(AllCount),
                                RowCount
                            }
                        });
                    } else {
                        yield put({
                            type: 'save',
                            payload: {
                                fileList: tableList,
                                commonDataTotal: Number(AllCount),
                                RowCount
                            }
                        }); 
                    }
            }else {
                message.error("查询文件失败");
            }
        },
        //查询申请列表服务
        * queryApply({ data },{ call,put }) {
            const {DataRows,RetCode} = yield call(usersService.queryApply,{...data});
            if(RetCode == '1') {
                yield put({
                    type: "save",
                    payload: {
                        applyList: DataRows
                    }
                });
            } else {
                message.error("查询失败");
            }
        },
        //查询申请单详情
        * queryApplyDetal({data},{ call, put }) {
            const { DataRows, RetCode } = yield call(usersService.queryApplyDetal,{...data});
            if(RetCode == '1') {
                yield put({
                    type: "save",
                    payload: {
                        ApplyDetails: DataRows
                    }
                });
            } else {
                message.error("查询失败'");
            }
        },
        //上传服务
        * uploadServlet ({ data },{ call }) {
            const {RetCode} = yield call(usersService.uploadServlet,{...data});
            if(RetCode == '1') {
               message.success("上传成功");
            } else {
                message.error("上传失败'");
            }
        },
        //查询文件的可见范围以及所属分类
        *queryFileVisibleAndPath ({ data }, {call, put}) {
            yield put({
                type: "save",
                payload: {
                    modalLoading: true,
                    userRange: []
                }
            });
            const { DataRows, RetCode } = yield call(usersService.queryFileVisibleAndPath,{...data});
            if(RetCode == '1') {
                //判断初始状态是按照部门还是人员查询
                const getFlag = () => {
                    const bool = DataRows.some((item) => item.user_name != undefined);
                    return bool;
                };
                if(getFlag()) {
                    yield put({
                        type:"save",
                        payload: {
                            radivoValue: "staff"
                        }
                    });
                } else {
                    yield put({
                        type:"save",
                        payload: {
                            radivoValue: "dept"
                        }
                    });
                }
                let deptValue = []; //可见部门
                //按照人员查询
                let personDept = []; //可见部门 
                let userValue = []; //可见人员
                DataRows.map((v) => {
                    if(v.userDept_id) {
                        personDept.push(v.userDept_id); //按照人员查询的  可见部门
                        // deptValue.push(v.dept_user_id); //按照部门查询的 可见部门
                        deptValue = [];
                        userValue.push(v.dept_user_id + "#" +v.userDept_id);  //按照人员查询的 可见人员
                    } else {
                        deptValue.push(v.dept_user_id); //按照部门查询的 可见部门
                        userValue = [];
                        personDept = [];
                    }
                });
                if(personDept.length != 0) {
                    const postData = {
                        arg_dept_id: personDept.join(),
                        Range: userValue,
                    };
                    yield put({
                        type: "queryUserInfoByDeptId",
                        postData
                    });
                } 
                yield put({
                    type: "save",
                    payload: {
                        visibleRange: deptValue, //可见部门
                        personRange: personDept,
                        modalLoading:false
                    }
                });
             } else {
                 message.error("查询失败'");
             }
        },
        //按照部门查找修改可见部门
        *setVisibleRange ({data}, {put}) {
            yield put({
                type: "save",
                payload: {
                    visibleRange: data.visibleRange
                }
            });
        },
        //按照人员查询修改部门
        *setPersonRange ({data},{put}) {
            yield put({
                type: "save",
                payload: {
                    personRange: data.arg_dept_id,
                    userRange: []
                }
            });
        },
        //按照人员查询修改人员
        * setUserRange({data},{put}) {
            yield put({
                type: "save",
                payload: {
                    userRange:data.userRange 
                }
            });
        },
        //修改文件
        * updateFileServlet ({ data }, { call, put }) {
            console.log(data,"data")
            //按照条件查询文件
            const postData = {
                arg_file_name:data.arg_file_name, 
                arg_upload_start_time: data.arg_upload_start_time,
                arg_upload_end_time: data.arg_upload_end_time,
                arg_uploader_name: data.arg_uploader_name,
                arg_status: data.arg_status,
                arg_path_id: data.query_path_id,
                arg_page_current: data.arg_page_current
            };
            const { RetCode } = yield call(usersService.updateFileServlet,{...data});
            if( RetCode == '1') {
                yield put({
                    type: 'queryFileByTerm',
                    data: postData
                });
                message.success("修改成功");
            } else {
                message.erroe("修改失败");
            }
        },
        //保存文件的pathid
        * savePathId ({data},{put}) {
            yield put({
                type: "save",
                payload:{
                    treePathId: data.path_id
                }
            });
        },
        //删除文件
        * delFile ({ data },{ call,put }) {
            const postData = {
                arg_page_current: data.arg_page_current,
                arg_status: data.arg_status,
                arg_path_id: data.arg_path_id,
                arg_file_name: data.arg_file_name,
                arg_upload_start_time:data.arg_upload_start_time,
                arg_upload_end_time:data.arg_upload_end_time,
                arg_uploader_name: data.arg_uploader_name
            };
            let arg_file_id = data.arg_file_id;
            const { RetCode } = yield call(usersService.delFile,{arg_file_id});
            if( RetCode == "1") {
                message.success("删除成功")
                yield put({
                    type: 'queryFileByTerm',
                    data: postData
                });
            } else {
                message.error("删除失败")
            }
        },
        // 查询部门
        * queryDirectory ({},{call,put}) {
            const directoryList = [];
            let postData = {};
            const { DataRows ,RetCode } = yield call(usersService.queryDirectory,postData);
            if ( RetCode === "1") {
                //构造一级目录结构
                if(DataRows.length){
                    DataRows.map((item) => {
                        if (item.nodelevel === "1") {
                            directoryList.push (
                                {
                                    deptid: item.deptid,
                                    label: item.deptname,
                                    key: item.deptid,
                                    value:item.deptid,
                                    selectable: true,
                                    children: []
                                }
                            )
                        }
                    });
                }
                //构造二级目录
                for(let j = 0; j< directoryList.length; j++){
                    for( let i = 0; i < DataRows.length; i++){
                        if((directoryList[j].deptid === DataRows[i].parentid)) {
                            directoryList[j].children.push(
                                {
                                    deptid: DataRows[i].deptid,
                                    // label:DataRows[i].deptname.slice(DataRows[i].deptname.indexOf("-")+1,),
                                    label:DataRows[i].deptname,
                                    key:DataRows[i].deptid,
                                    value: DataRows[i].deptid
                                    // value: DataRows[i].deptid + "#" + DataRows[i].deptname
                                }
                            )
                        }
                    }
                }
                yield put ({
                    type: "save",
                    payload: {
                        directoryList
                    }
                });
            } else {
                message.error("查询失败")
            }
        },
        * onDeptChecked ({data},{call,put,select}) {
            const { deptValue } = yield select(state => state.commonData);
            const { deptId } = yield select(state => state.commonData)
            if(!data.flag) {
                deptValue.push(data.deptName);
                deptId.push(data.deptId);
                yield put({
                    type: "save",
                    payload: {
                        deptValue: [...deptValue],
                        deptId: [...deptId]
                    }
                });
            } else {
                let dept = deptValue.filter(i => i !== data.deptName);
                let deptid = deptId.filter(i => i !== data.deptId);
                yield put ({
                    type: 'save',
                    payload: {
                        deptValue: [...dept],
                        deptId: [...deptid]
                    }
                })
            }
        },
        //查询文件夹所在的目录路径服务（修改、新增文件夹时使用）
        * queryPathUrl ({ data }, { call, put}) {
            const { DataRows, RetCode } = yield call(usersService.queryPathUrl,{...data});
            if( RetCode == "1") {
                yield put({
                    type:"save",
                    payload: {
                        pathUrl: DataRows
                    }
                });
            } else {
                message.error("查询失败")
            }
        },
        //查询资料管理员列表
        * queryManageList ({ data }, { call, put }) {
            const { DataRows, RetCode,  AllCount, RowCount} = yield call(usersService.queryManageList,{...data});
            if( RetCode == "1") {
                if (data.arg_status == "0"){
                    DataRows.map((v,i) => {
                        if(v.userInfo) {
                            let userInfo = JSON.parse(v.userInfo);
                            var user_name = [];
                            userInfo.map((value) => {
                                user_name.push(value.user_name)
                            });
                        }
                        v.user_name = user_name
                        v.index = i+1;
                        v.key = v.dept_id;
                    })
                    yield put({
                        type: "save",
                        payload: {
                            manageList: JSON.parse(JSON.stringify(DataRows)),
                            dataTotal: Number(AllCount),
                            RowCount
                        }
                    });
                } else {
                    DataRows.map((v,i) => {
                        v.index = i+1;
                        v.key = v.path_name;
                        if(v.userInfo) {
                            let userInfo = JSON.parse(v.userInfo);
                            let user_name = [];
                            let dept_name = [];
                            let user_id = [];
                            let full_name = [];
                            let dept_id = [];
                            userInfo.map((value)=> {
                                user_name.push(value.user_name)
                                dept_name.push(value.dept_name)
                                user_id.push(value.user_id)
                                dept_id.push(value.dept_id)
                                full_name.push(value.user_id+"#"+value.user_name)
                            });
                            v.user_name = user_name
                            v.index = i+1;
                            v.user_id = user_id;
                            v.deptname = dept_name
                            v.full_name = full_name
                            v.dept_id = dept_id
                        }
                    });
                    yield put({
                        type: "save",
                        payload: {
                            categoryList: JSON.parse(JSON.stringify(DataRows)),
                            configTotal: Number(AllCount),
                            RowCount
                        }
                    });
                }
            } else {
                message.error("查询失败")
            }
        },
        //管理管理员服务（包含开、关、删除、修改）
        * updateManage ({data}, { call, put }) {
            const postData = {
                arg_dept_name: data.arg_dept_name,
                arg_user_name: data.arg_user_name,
                arg_manage_id: data.arg_manage_id,
            };
            const { configPage, dataPage } = data;
            const { RetCode } = yield call(usersService.updateManage,{...data});
            if( RetCode == "1") {
                if(data.flag == "data") {
                    const data = {
                        arg_status: "0",
                        arg_page_current: dataPage,
                        arg_dept_name: postData.arg_dept_name,
                        arg_user_name: postData.arg_user_name,
                    };
                    yield put({
                        type: "queryManageList",
                        data
                    });
                } else {
                    const data = {
                        arg_status: "1",
                        arg_page_current: configPage,
                        arg_dept_name: postData.arg_dept_name,
                        arg_user_name: postData.arg_user_name,
                    };
                    yield put({
                        type: "queryManageList",
                        data
                    });
                }
                if(data.arg_manage_state == "delete") {
                    message.success("删除成功")
                } else {
                    message.success("修改成功")
                }
            } else {
                message.error("修改失败")
            }
        },
        //下载文件
        * downFile ({data}, {call,put}) {
            const arg_file_id  = data.arg_file_id;
            const { DataRows, RetCode } = yield call(usersService.downFile,{arg_file_id});
            if(RetCode == "1") {
                let urlList = [];
                DataRows.map((v) =>{
                    urlList.push(v.url)
                });
                urlList.forEach(url => {
                    let a = document.createElement('a') // 创建a标签
                    let e = document.createEvent('MouseEvents') // 创建鼠标事件对象
                    e.initEvent('click', false, false) // 初始化事件对象
                    a.href = url // 设置下载地址
                    a.download = '' // 设置下载文件名
                    a.target = "_blank"
                    a.dispatchEvent(e)
                })
                yield put({
                    type: "queryFileByTerm",
                    data
                })
            } else {
                message.error("下载失败")
            }
        },
        //根据部门查询人员
        * queryUserInfoByDeptId ({postData},{call,put}) {
            const { DataRows, RetCode } = yield call(usersService.queryUserInfoByDeptId,{...postData});
            if(RetCode == "1") {
                if(postData.Range){
                    yield put({
                        type: "save",
                        payload: {
                            staffList: DataRows,
                            userRange: postData.Range,
                        }
                    });
                } else {
                    yield put({
                        type: "save",
                        payload: {
                            staffList: DataRows,
                            userRange: [],
                        }
                    });
                }
            } else {
                message.error("查询失败");
            }
        },
        //清空部门人员
        * clearStaffList ({},{put}) {
            yield put({
                type:"save",
                payload: {
                    staffList: []
                }
            });
        },
        //修改radio单选按钮
        * radioChange ({data},{put}) {
            yield put ({
                type: "save",
                payload:{
                    radivoValue: data.value
                }
            });
        },
        //修改上传文件的单选按钮
        * uploadRadioChange({data},{put}) {
            yield put ({
                type: "save",
                payload: {
                    uploadRadioValue: data.value
                }
            })
        },
        *defaultUploadRadio({},{put}){
            yield put({
                type: "save",
                payload: {
                    uploadRadioValue: "dept"
                }
            })
        },
        //修改文件分类
        * documentClassification ({data},{put}) {
            yield put ({
                type: "save",
                payload: {
                    contentValue: data.contentValue,
                    pathId: data.pathId,
                    levelFlag: data.levelFlag
                }
            });
        },
        //查询文件上传至ceph时的状态
        * queryFileState ({data},{call,put}) {
            const { DataRows, RetCode } = yield call(usersService.queryFileState,{...data});
            let fileId = data.arg_file_id;
            if(RetCode == "1") {
                if(DataRows && DataRows.length > 0){
                    if(DataRows[0].file_state == "1"){
                        yield put ({
                            type: "save",
                            payload: {
                                fileState: fileId
                            }
                        });
                    } else {
                        yield put ({
                            type: "save",
                            payload: {
                                fileState: "0"
                            }
                        });
                    }
                }
            } else {
                message.error("查询失败")
            }
        },
    },
    subscriptions: {
       setup({dispatch,history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/adminApp/commonDataSystem/commonData') {
                    dispatch ({type: 'queryFileByTerm',data:{arg_status: "0"}})
                    dispatch({ type: 'queryManageRole'});//查询用户
                    dispatch({ type: 'queryFilePath'}); //查询文件夹
                    dispatch({ type: 'queryDirectory'}) //查询组织目录
                }
                if (pathname === '/adminApp/commonDataSystem/myBiography') {
                    dispatch ({type: 'queryFileByTerm',data:{arg_status: "1"}})
                    dispatch ({type: 'queryFilePath'}) //查询文件夹
                    dispatch({ type: 'queryDirectory'}); //查询组织目录
                }
                if(pathname === '/adminApp/commonDataSystem/managerConfig') {
                    dispatch ({type: 'queryManageList',data:{arg_status: "0"}});
                    dispatch({ type: 'queryDirectory'}); //查询组织目录
                    dispatch ({type: 'queryFilePath'}) //查询文件夹
                    dispatch({ type: 'queryManageRole'});//查询用户
                }
                if(pathname === '/adminApp/commonDataSystem/commonData/UploadFiles') {
                    dispatch ({type: 'queryFileByTerm',data:{arg_status: "1"}})
                    dispatch ({type: 'queryFilePath'}) //查询文件夹
                    dispatch({ type: 'queryDirectory'}) //查询组织目录 
                    dispatch({ type: 'defaultUploadRadio'})
                }
            });
       }
   }  
};
  