/**
  * 作者： 彭东洋
  * 创建日期： 2019-10-12
  * 邮箱: pengdy@itnova.com.cn
  * 功能： 常用资料-上传文件页面
  */
import React from 'react';
import { connect } from 'dva';
import {Button, Row, Col, Select, TreeSelect, Radio,Progress,message,Icon, Tooltip} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../mangerConfig/managerConfig.less';
import { getUuid } from './../../../components/commonApp/commonAppConst';
const RadioGroup = Radio.Group;
class UploadFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chunkSize: 0, //上传文件分块的总个数
            uploadPercent: 0, //上传率
            start: 0,
            index: 0,
            Bttonstate: true,
            Progress: "none",
            Pieces:[], //上传信息（文件名字、进度、进度条状态）数组
            fileNameData: [], //上传文件名字数组
            visibleRange:[], //上传文件的可见范围
            visibleUuid: "",
            fileList: [], //上传文件列表
            staffUuid: ""
            // spinStyle: "none"
            // ProgressStatus: "active"
        };
        this.count = [];
        this.time = 2000;
        this.realCount = 1; 
    };
    //生成uuid
     setUuid = () => {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            var uuid = s.join("");
            return uuid;
    };
    //返回常用资料页面
    goBack = () => {
        const { dispatch } = this.props;
        dispatch(routerRedux.push({
            pathname: "/adminApp/commonDataSystem/commonData"
        }));
    };
    //清空数据
    clear = () => {
        const {dispatch} = this.props;
        let obj = document.getElementById("file"); 
        obj.value="";
        this.setState({
            visibleUuid: getUuid(20,62),
            visibleRange:[], //清空可见范围
            fileNameData:[],
            Progress: "none",
        });
        dispatch({
            type: "commonData/clearStaffList"
        });
    };
    //改变单选按钮
    radioChange = (e) => {
        const { dispatch } = this.props;
        const data = {
            value: e.target.value
        };
        dispatch ({
            type: "commonData/uploadRadioChange",
            data
        });
    };
    //当按照人员选择可见范围选择可见部门时
    depTreeChange = (value) => {
        const { dispatch } = this.props;
        this.setState({
            staffUuid: getUuid(20,62)
        })
        if (value.length > 0) {
            let postData = {
                arg_dept_id: value.join()
            };
            dispatch ({
                type:"commonData/queryUserInfoByDeptId",
                postData
            });
        } else {
            dispatch({
                type: "commonData/clearStaffList"
            });
        }
    };
    //当选择可见人员时
    staffSelect = (value) => {
        if(value.length > 0) {
            this.setState({
                visibleRange: value.join()
            });  
        } else {
            this.setState({
                visibleRange: []
            });  
        }
    };
    //按部门修改时选择部门
    revisionDepar =(value) => {
        this.setState({
            visibleRange: value.join()
        });
    };
    //上传进度条
    getProgress = () => {
        const {Pieces} = this.state;
        return Pieces.map((v,i) => (
            <div key={i} style = {{ width: "300px",display:this.state.Progress}}>
                <span className = {styles.progressName}>{v.filename}</span>
                <Progress percent={v.uploadPercent} showInfo={true} style = {{width:"200px"}} status={v.ProgressStatus}/>
            </div>
        ))
    };
    //删除待上传的指定内容
    // deleteFiles = (i) => {
    //     const {fileNameData} = this.state;
    //     let midFileNameData = fileNameData
    //     midFileNameData.splice(i,1);
    //     this.setState({
    //         fileNameData: JSON.parse(JSON.stringify(midFileNameData))
    //     },()=> {console.log(this.state.fileNameData)});
    // }
    //显示上传的文件信息（上传文件的名字）
    uploadFileName = () => {
        const {fileNameData} = this.state;
        return fileNameData.map((v,i) => (
            <li key = {i} className = {styles.fileName}>
                <div style = {{display: "inline",float: "left"}}>
                    <span>{i+1}、</span>
                    <span>{v}</span>
                </div>
                {/* <div style = {{display: "inline",float: "right"}}>
                    <Tooltip title = "删除" >
                        <Icon type = "close" className = {styles.closeStyle} onClick = {() =>this.deleteFiles(i)} />
                    </Tooltip>
                </div> */}
            </li>
        ))
    };
    ajaxMise1 = (url,method,data) => {
        const promise = new Promise(function(resolve, reject){
            const handler = function() {
                if (this.readyState !== 4) {
                    return;
                }
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    reject(new Error(this.statusText));
                }
            };
            const client = new XMLHttpRequest();
            client.open(method, url);
            client.onreadystatechange = handler;
            client.send(data);
        });
        return promise;
      };
    //上传完成后的监听
    uploadComplete = async (index) => {
        const { dispatch } = this.props;
        this.count[index] = this.count[index] ? ++this.count[index] : 1;
        let midPercent = Math.floor(this.count[index]/this.state.Pieces[index].totalPieces * 100-1);
        let realPercent = midPercent < 0 ? 0 : midPercent;
        this.state.Pieces[index].uploadPercent = realPercent;
        this.state.Pieces[index].ProgressStatus = "active";
        if(this.count[index] == this.state.Pieces[index].totalPieces -1 ) {
            let blob = document.getElementById("file").files[index]; //文件
            let filesize = blob.size; //文件大小 
            let filename = blob.name; //文件名称
            let bytesPerPiece = 1024 * 1024; // 每个文件切片大小定为1MB .
            let lastpiece = this.count[index] * bytesPerPiece;
            let formData = new FormData();
            let chunk = blob.slice(lastpiece,filesize);
            let url = "/allcommondocument/commondocument/uploadServlet";
            const newData = this.props.location.query;
            formData.append("file", chunk, filename);
            formData.append("fileId",this.state.fileIdArray[index]);
            formData.append("arg_visible", this.state.visibleRange);
            formData.append("arg_pathId", newData.arg_path_id); 
            formData.append("chunkSize", bytesPerPiece);
            formData.append("chunks", this.state.Pieces[index].totalPieces);
            formData.append("chunk", this.state.Pieces[index].totalPieces-1);
            formData.append("size",filesize);
            formData.append("name",filename);
            await this.ajaxMise1(url,"POST",formData).then(()=>{this.state.Pieces[index].uploadPercent = 99})

        }
        if(this.state.Pieces[index].uploadPercent == 99) {
            const data = {
                arg_file_id:this.state.fileIdArray[index]
            };
            let timeInterval = setInterval(() => {
                dispatch({
                    type:"commonData/queryFileState",
                    data
                });
                this.realCount++;
                this.time = (this.realCount * 2000 + 2000) > 10000 ? 10000 : (this.realCount * 2000 + 2000);
                if (this.props.fileState == this.state.fileIdArray[index]) {
                    this.time = 2000;
                    this.realCount = 1;
                    this.state.Pieces[index].uploadPercent = 100;
                    this.state.Pieces[index].ProgressStatus = "success";
                    message.success(this.state.Pieces[index].filename+"上传成功");
                    clearInterval(timeInterval)
                } else if(this.props.fileState == "0") {
                    this.time = 2000;
                    this.realCount = 1;
                    message.error(this.state.Pieces[index].filename+"上传失败");
                    this.state.Pieces[index].ProgressStatus = "exception";
                    clearInterval(timeInterval);
                } else {
                    return;
                }
            },this.time);
        }
        const bool = this.state.Pieces.every((item) => item.uploadPercent >= 99);
        if(bool) {
            this.setState({
                Bttonstate:true,
            });
            let obj = document.getElementById("file"); 
            //第二次上传相同内容触发change事件
            obj.value="";
        }
        this.setState({
            Pieces: JSON.parse(JSON.stringify(this.state.Pieces))
        })
    };
    uploadFailed = () => {
        message.error("上传失败")
    };
    //封装ajax
    ajaxMise = (url,method,data,index) => {
        const _this = this;
        const promise = new Promise(function(resolve, reject){
            const handler = function() {
                if (this.readyState !== 4) {
                    return;
                }
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    reject(new Error(this.statusText));
                }
            };
            const client = new XMLHttpRequest();
            client.onload = () => _this.uploadComplete(index);
            client.open(method, url);
            client.onreadystatechange = handler;
            client.send(data);
        });
        return promise;
      };
      //当文件上传时
      fileUpload = async () => {
        // const {fileList,visibleRange} = this.state;
        const {visibleRange} = this.state;
        let bytesPerPiece = 1024 * 1024; // 每个文件切片大小定为1MB .
        let length = document.getElementById("file").files.length;
        let url = "/allcommondocument/commondocument/uploadServlet";
        if(visibleRange.length <= 0 ) {
            message.error("请选择可见范围");
            return;
        }
        if(length <= 0) {
            message.error("请选择上传文件");
            return;
        }
        this.setState({
            Bttonstate: true
        });
        let fileIdArray = [];//存储文件id的数组
        for(let i=0; i< length; i++) {
            let formDataArray = [];
            let newformDataArray = [];
            let blob = document.getElementById("file").files[i]; //文件
            // let blob = fileList[i]; //文件
            let start = 0; //开始上传的
            let index = 0; //当前上传
            let filesize = blob.size; //文件大小
            let filename = blob.name; //文件名称
            let fileId =  this.setUuid()//文件的fileid
            fileIdArray.push(fileId);
            const newData = this.props.location.query;
            let totalPieces = Math.ceil(filesize /bytesPerPiece);//计算文件切片总数
            this.setState({
                Progress: "block",
            });
            if(totalPieces > 1) {
                for (let j = 0;j < totalPieces-1; j++) {
                    let end = (start + bytesPerPiece > filesize) ? filesize : (start + bytesPerPiece);
                    let chunk = blob.slice(start,end);//切割文件    
                    let formData = new FormData();
                    formData.append("file", chunk, filename);
                    formData.append("fileId",fileId);
                    formData.append("arg_visible", visibleRange);
                    formData.append("arg_pathId", newData.arg_path_id); 
                    formData.append("chunkSize", bytesPerPiece);
                    formData.append("chunks", totalPieces);
                    formData.append("chunk", index);
                    formData.append("size",filesize);
                    formData.append("name",filename);
                    formDataArray.push(formData);
                    //将上传的数据每subLength条放进一个数组
                    let cutArray = (array, subLength) => {
                        let index = 0;
                        let newArr = [];
                        while(index < array.length) {
                            newArr.push(array.slice(index, index += subLength));
                        }
                        return newArr;
                    };
                    newformDataArray = cutArray(formDataArray,5);
                    start = end;
                    index++;
                }
            } else {
                    let end = (start + bytesPerPiece > filesize) ? filesize : (start + bytesPerPiece);
                    let chunk = blob.slice(start,end);//切割文件    
                    let formData = new FormData();
                    formData.append("file", chunk, filename);
                    formData.append("fileId",fileId);
                    formData.append("arg_visible", visibleRange);
                    formData.append("arg_pathId", newData.arg_path_id); 
                    formData.append("chunkSize", bytesPerPiece);
                    formData.append("chunks", totalPieces);
                    formData.append("chunk", index);
                    formData.append("size",filesize);
                    formData.append("name",filename);
                    formDataArray.push(formData);
                    //将上传的数据每subLength条放进一个数组
                    let cutArray = (array, subLength) => {
                        let index = 0;
                        let newArr = [];
                        while(index < array.length) {
                            newArr.push(array.slice(index, index += subLength));
                        }
                        return newArr;
                    };
                    newformDataArray = cutArray(formDataArray,5);
            }
            this.setState({
                fileIdArray
            });
            let PatchUploading = async (newformDataArray) => {
                for(let item of newformDataArray) {
                   await Promise.all(item.map((v) => this.ajaxMise(url,"POST",v,i)))  
                }
            };
            await PatchUploading(newformDataArray);
        }
    };
    //当上传改变时
    uploadChange = (e) => {
        let bytesPerPiece = 1024 * 1024; // 每个文件切片大小定为1MB .
        let length = document.getElementById("file").files.length;
        // let fileList = [].slice.call(document.getElementById("file").files);
        // let fileList = document.getElementById("file").files;
        // this.setState({
        //     // fileList: [...this.state.fileList,...fileList],
        //     fileList: [...fileList]
        // },()=>{console.log(this.state.fileList,"回调")});
        let Pieces = [];
        let fileNameData = [];
        for(let i=0; i< length; i++) {
            this.count[i] = 0;
            let blob = document.getElementById("file").files[i]; //文件
            let filename = blob.name; //文件名称
            let filesize = blob.size; //文件大小
            let totalPieces = Math.ceil(filesize /bytesPerPiece);//计算文件切片总数
            Pieces.push({filename,totalPieces})
        }
        //显示上传的内容
        Object.values(e.target.files).forEach((item) =>{
            fileNameData.push(item.name)
        });
        if(e.target.files.length >= 1){
            this.setState({
                Bttonstate: false,
                fileNameData
            });
        }else {
            this.setState({
                Bttonstate: true,
                fileNameData: []
            }); 
        }
        this.setState({
            Pieces
        });  
    };
    render () {
        const { staffList } = this.props;
        let selectDepartmentDemo = staffList.map((item) => {
			return (
				<Select.Option
					key = {item.deptid}
					value = { item.userid + '#' + item.deptid }
				>
					{item.username}
				</Select.Option>
			);
        });
        return (
                <div className = {styles.blackWrapper}>
                    <h2 style = {{textAlign:"center",marginBottom:"40px"}}>上传文件</h2>
                    <Button onClick = {this.goBack} type = "primary" style = {{float:"right"}}>返回</Button>
                    <Button onClick = {this.clear} type = "primary" style = {{float:"right",marginRight:"10px"}}>清空</Button>
                    <div style = {{paddingLeft:"30%"}}>
                        <RadioGroup 
                            defaultValue = {"dept"}
                            onChange = {this.radioChange}
                        >
                            <Radio value = {"dept"}>按照部门选择可见范围</Radio>
                            <Radio value = {"staff"}>按照人员选择可见范围</Radio>
                        </RadioGroup>
                        {
                            this.props.uploadRadioValue == "dept" 
                            ?
                            // 按照部门查询
                            <div key = {this.state.visibleUuid}>
                                <Row style = {{marginTop:"20px"}}>
                                    <Col span = {4} key = "myBiography">
                                        <b style={{color:"red",marginRight:'3px'}}>*</b>
                                        可见部门:
                                    </Col>
                                    <Col span = {20} key = "myBiographyDepartment">
                                        <TreeSelect
                                            dropdownMatchSelectWidth = {false}
                                            className = {styles.inputSearch}
                                            size = "large"  
                                            treeData = {this.props.directoryList}
                                            onChange = {this.revisionDepar}
                                            treeCheckable
                                            placeholder="请选择可见部门"
                                        />
                                    </Col>
                                </Row>
                            </div>
                            :
                            //按照人员查询
                            <div key = {this.state.visibleUuid}>
                                <Row style = {{marginTop:"20px"}}>
                                    <Col span = {4}>
                                        <b style={{color:"red",marginRight:'3px'}}>*</b>
                                        可见部门:
                                    </Col>
                                    <Col span = {20} key = "mybiographysector">
                                        <TreeSelect
                                            dropdownMatchSelectWidth = {false}
                                            className = {styles.inputSearch} 
                                            size = "large"  
                                            treeData = {this.props.directoryList}
                                            onChange = { this.depTreeChange }
                                            treeCheckable
                                            placeholder="请选择可见部门"
                                        />
                                    </Col>
                                </Row>
                                <Row style = {{marginTop:"20px"}}>
                                    <Col span = {4}>
                                        <b style={{color:"red",marginRight:'3px'}}>*</b>
                                        可见人员：
                                    </Col>
                                    <Col span = {20} key = "myBiographypersonnel">
                                        <Select
                                            key = {this.state.staffUuid}
                                            className = {styles.inputSearch}
                                            size = "large"
                                            onChange = {this.staffSelect}
                                            mode='multiple'
                                            placeholder="请选择可见人员"
                                        >
                                            {selectDepartmentDemo}
                                        </Select>
                                    </Col>
                                </Row>
                            </div>
                        }
                        <div style = {{overflow:"hidden", marginTop: "20px"}}>
                            <div style = {{float: "left"}}>
                                <input 
                                    type = "file" 
                                    name="file" 
                                    id= "file" 
                                    multiple 
                                    onChange = {this.uploadChange} 
                                    style = {{color: "transparent"}}
                                />
                            </div>
                            <div style = {{float: "right"}}>
                                <Button onClick = {this.fileUpload} type = "primary" disabled = {this.state.Bttonstate}>
                                    上传文件
                                </Button>
                            </div>
                        </div>
                        <div>
                            <ul className = {styles.ulStyle}>
                                {this.uploadFileName()}
                            </ul>
                        </div>
                        {this.getProgress()}
                    </div>
                </div>
        )
    };
}
function mapStateToProps (state) {
    return {
        loading: state.loading.models.commonData,
        ...state.commonData
    };
}
export default connect (mapStateToProps)(UploadFiles)
