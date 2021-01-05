/**
 * 作者：韩爱爱
 * 日期：2020-11-03
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：争优创先首页-优秀新闻宣传组织者/个人
 */
import { message } from "antd";
import * as Services from '../../../services/newsOne/newsOneServers';
import { param } from "jquery";
import { months } from "moment";
import { routerRedux } from "dva/router"
export default {
  namespace: 'eachUpload',
  numberPages: false,
  state:{
    pageFlag: '',
    year: '',
    deptValue: [],//选中申请单位
    checkContentList:[],//人员名单
    deptData: [],//申请单位名单
    authorBy:[],//选中人员名单
    authorTypeName:[],
    authorDept:[],
    examineObj:"",//申请单位
    selectdept:[],
    selectauth:[],
    selectname:[],
    commentTin: [],//事迹介绍或评语
    pictureListArr: [],//图片存放
    author:[null],//添加-删除数组
    loading: [false],
    imporDataList:[],//导入数据
    showImpor:'false',
    imgList:[],
    subDataCurrent:'1',//当前页
    subDataCount:'0',//数据总数
    flagTime:''
  },
  reducers:{
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },
  effects: {
    * init({query}, {call, put, select}) {
      yield put({
        type: 'save',
        numberPages: false,
        payload: {
          year: query.year,
          pageFlag: query.flag,
          selectdept:[],//选中申请单位id
          commentTin: [],//事迹介绍或评语
          pictureList: [],//图片存放
          pictureListArr: [],//图片存放
          authorBy:[],
          author:[null],
          loading: [false],
        }
      });
      yield put({
        type:'queryDept'
      })
  },
    //单位
    *queryDept({},{call,put,select}){
      let data = yield call(Services.queryDept);
      if (data.retCode == '1') {
        data.dataRows.length == 0 ?  [] : data.dataRows.map((v, i) => {
          v.key = i + '';
          v.title = v.deptName
          v.value = v.deptId
          v.label = v.deptName;
          v.disabled = true;
          v.children.map((item, index) => {
            item.key = i + '-' + index;
            item.value = item.deptId
            item.title = item.deptName
            v.label = v.deptName;
          })
        });
        yield put({
          type: 'save',
          payload: {
            deptData: JSON.parse(JSON.stringify(data.dataRows))
          }
        })
      } else {
        message.error(data.retVal)
      }
    },
    //选中单位
    *deptValue({record,name}, {put, call, select}) {
      //人员名单`
      const {selectdept,author,checkContentList} = yield select(v =>v.eachUpload);
      author.map(itme=>{
        selectdept.push(itme);
        checkContentList.push(itme);
      });
      selectdept.splice(name,1,record);
      if(selectdept.length != author.length){
        selectdept.splice(author.length,selectdept.length-author.length);
      }
      yield put({
        type:'save',
        payload:{
          selectdept:JSON.parse(JSON.stringify(selectdept)),
        }
      });
      //人员
      const  postData = {
        deptId: record.value.toString(),//单位 id
      };
      let data = yield call(Services.tijiaoren, postData);
      if(data.retCode == '1') {
        data.dataRows.map((item ,index) => {
          item.key = index;
          item.title = item.deptName;
          item.value = item.deptId;
          item.disabled = true;
          item.children.map((v, i) => {
            v.key = index + '-' + i;
            v.title = v.userName;
            v.value = v.userName
          })
        });
        yield put({
          type:'save',
          payload:{
            checkContentList:JSON.parse(JSON.stringify(data.dataRows)),
          }
        })
      }
    },
    //选中人员
    * onAuthorList({record, name}, {put, call, select}) {
      const {authorBy,author,selectdept} = yield select(v => v.eachUpload);
      author.map(itme=>{
        authorBy.push(itme)
      });
      authorBy.splice(name,1,record);
      if(authorBy.length !== author.length){
        authorBy.splice(author.length,authorBy.length-author.length)
      }
      yield put({
          type: 'save',
          payload: {
            authorBy: JSON.parse(JSON.stringify(authorBy)),
          },
        })
    },
    //事迹介绍或评语
    *comment({record, name}, {put, select}) {
      const {commentTin,author} = yield select(v => v.eachUpload);
      author.map(itme=>{
        commentTin.push(itme)
      });
      commentTin.splice(name,1,record);
      if(commentTin.length !== author.length){
        commentTin.splice(author.length,commentTin.length-author.length)
      }
      yield put ({
        type : 'save',
        payload : {
          commentTin :JSON.parse(JSON.stringify(commentTin))
        }
      });
    },
    //图片存放
    *pictureChange({record, name}, {call, put, select}){
      const { pictureListArr,author} = yield select(v => v.eachUpload );
      if (record.status === 'done') {
        if (record.response.RetCode === '1') {
            author.map(itme=>{
              pictureListArr.push(itme)
            });
            pictureListArr.splice(name,1,record.response.filename);
            if(pictureListArr.length !== author.length){
              pictureListArr.splice(author.length,pictureListArr.length-author.length)
            }
          yield put({
            type: 'save',
            payload: {
              pictureListArr:JSON.parse(JSON.stringify(pictureListArr)),
              loading: false,
            }
          });
        }
      }else if (record.status === 'error') {
        message.error(`${record.name} 上传失败！.`);
      } else  if(record.status === 'uploading'){
        yield put({
          type: 'save',
          payload: {
            loading: true,
          }
        })
      }
    },

    // 删去
    * remove({record, name}, {put, call, select}) {
      const {author, selectdept, authorBy, commentTin, pictureListArr} = yield select(v => v.eachUpload);
      author.splice(record, 1);
      selectdept.splice(record, 1);
      authorBy.splice(record, 1);
      commentTin.splice(record, 1);
      pictureListArr.splice(record, 1);
      yield put({
        type: 'save',
        payload: {
          author: JSON.parse(JSON.stringify(author)),
        }
      })
    },
    //添加
    * add({record}, {put, call, select}) {
      const {author,deptData} = yield select(v => v.eachUpload);
      author.length++;
      yield put({
        type: 'save',
        payload: {
          author: JSON.parse(JSON.stringify(author)),
        }
      })
    },
    //导入
    *importClick({record},{call, put, select}){
      if(record.status =='done' ){
        if(record.response.retCode == '1') {
          message.info('导入成功');
          record.response.dataRows.map((item, index) => {
            item.key = index;
          });
          yield put({
            type: 'save',
            payload: {
              showImpor: "true",
              numberPages: false,
              imporDataList: JSON.parse(JSON.stringify(record.response.dataRows)),
              subDataCount: record.response.dataRows.length,
              flagTime:record.response.dataRows[0].flagTime
            }
          });
        }
      }else if(record.status === 'error'){
        message.error(`${record.name} 文件上传失败.`);
      }else if (record.status !== 'uploading') {
      }
    },
    //导入-图片导入
    *imgChange({record,name},{call, put, select}){
      const {imporDataList} = yield select(v => v.eachUpload );
      if (record.status === 'done') {
        if (record.response.RetCode === '1'){
          const strData ={
            id:name.id,
            imageInfo:JSON.stringify(record.response.filename)
          };
          let data = yield call (Services.uploadImage,strData);
          if(data.retCode == '1'){
            imporDataList.map(item=>{
              if(item.id == name.id){
                item.image=JSON.parse(data.dataRows)
              }
            });
            yield put({
              type: 'save',
              payload: {
                loading: false,
                imporDataList: JSON.parse(JSON.stringify(imporDataList)),
              }
            });
          }else {
            message.error(`${data.retVal}`)
          }
        }
      }else if (record.status === 'error') {
        message.error(`${record.name} 上传失败！.`);
      } else  if(record.status === 'uploading'){
        yield put({
          type: 'save',
          payload: {
            loading: true,
          }
        })
      }
    },
    //页码
    *handlePageChange({record},{put,call}){
      yield  put({
        type:'save',
        payload:{
          subDataCurrent:record
        }
      });
    },
    //导入-单条删除
    *details({record,name},{call, put, select}){
      const { imgList,imporDataList} = yield select(v => v.eachUpload );
      imporDataList.map((item,index)=>{
        if(item.id == record.id){
          imporDataList.splice(index,1)
        }
      });
      yield put ({
        type : 'save',
        payload : {
          imporDataList: JSON.parse(JSON.stringify(imporDataList)),
          subDataCount:imporDataList.length
        }
      });
    },
    //取消-保存
    *submissionTopic({record, saveData,outputHTML}, {call, put, select}){
      if(record == '取消'){
        yield put(routerRedux.push({
          pathname:'/adminApp/newsOne/creatExcellence',
        }));
        yield put ({
          type : 'save',
          payload : {
            commentTin : [],
            selectdept: [] ,
            author:[null],
            authorBy:[],
            pictureListArr:[],
            showImpor: 'false',
          }
        });
      }else if(record == '保存') {
        const {year, pageFlag, author, selectdept, authorBy, commentTin, pictureListArr, showImpor, imporDataList, deptData,flagTime} = yield select(v => v.eachUpload);
        let dataArr = [];
        const strData = {
          uploadTime: year,//年份
          type: pageFlag,//个体c/单位u
          flagTime:flagTime
        };
        if (showImpor == 'true') { //符合
          for (let i = 0; i < imporDataList.length; i++) {
            if (imporDataList[i].image.length == 0) {
              return message.error('图片不能为空')
            } else if (imporDataList[i].name.length == 0) {
              return message.error('姓名不能为空')
            } else if (imporDataList[i].deptName.length == 0) {
              return message.error('单位不能为空')
            } else if (imporDataList[i].comment.length == 0) {
              return message.error('事迹介绍或评语不能为空')
            } else {
              deptData.map((v, x) => {
                v.children.map((ite, ind) => {
                  if (imporDataList[i].deptName === ite.deptName) {
                    dataArr.push({
                      deptId: ite.deptId,//部门ID
                      deptName: imporDataList[i].deptName,//// 部index+门名字
                      deed: imporDataList[i].comment,//事迹描述
                      fullName: imporDataList[i].name,//人员名字
                      image: imporDataList[i].image,
                    })
                  }
                })
              })
            }
          }
          if (dataArr.length != imporDataList.length) {
            return message.error('其中的部门不符合')
          } else {
            strData['selectionJson'] = JSON.stringify(dataArr);
            let data = yield call(Services.uploadEvaluationUpload, strData);
            if (data.retCode === '1') {
              message.info('提交成功');
              yield put(routerRedux.push({
                pathname: '/adminApp/newsOne/creatExcellence',
              }));
              yield put({
                type: 'save',
                payload: {
                  commentTin: [],
                  selectdept: [],
                  author: [null],
                  authorBy: [],
                  pictureListArr: [],
                  showImpor: 'false',
                }
              });
            }else {
              message.error(`${data.retVal}`)
            }
          }
        } else if(showImpor == 'false'){
          if (selectdept.length == '0' || commentTin.length == '0' || pictureListArr.length == '0' || authorBy.length == '0') {
            message.info('必填项不能为空')
          } else {
            author.map((item, index) => {
              if (selectdept[index] === "null" || selectdept[index] == undefined) {
                message.info('部门不能为空')
              } else if (authorBy[index] == null || authorBy[index] == undefined) {
                message.info('姓名不能为空')
              } else if (commentTin[index] == null || commentTin[index] == undefined) {
                message.info('事迹介绍或评语不能为空')
              } else if (pictureListArr[index] == null || pictureListArr[index] == undefined) {
                message.info('图片不能为空')
              } else {
                dataArr.push({
                  deptId: selectdept[index].value,//部门ID
                  deptName: selectdept[index].label,//// 部门名字
                  deed: commentTin[index],//事迹描述
                  fullName: authorBy[index].toString(),//人员名字
                  image: pictureListArr[index],
                })
              }
            });
          }
          //判断
          if (dataArr.length == author.length) {
            strData['selectionJson'] = JSON.stringify(dataArr);
            let data = yield call(Services.uploadEvaluationUpload, strData);
            if (data.retCode === '1') {
              message.info('提交成功');
              yield put(routerRedux.push({
                pathname: '/adminApp/newsOne/creatExcellence',
              }));
              yield put({
                type: 'save',
                payload: {
                  commentTin: [],
                  selectdept: [],
                  author: [null],
                  authorBy: [],
                  pictureListArr: [],
                  showImpor: 'false',
                }
              });
            }else {
              message.error(`${data.retVal}`)
            }
          }
        }
      }
    },

  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/creatExcellence/eachUpload') { //此处监听的是连接的地址
          dispatch({type: 'init', query});
        }
      });
    },
  },
}