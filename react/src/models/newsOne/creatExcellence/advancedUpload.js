/**
 * 作者：窦阳春
 * 日期：2020-10-13 
 * 邮箱：douyc@itnova.com.cn
 * 功能：争优创先首页
 */
import { message } from "antd";
import * as Services from '../../../services/newsOne/newsOneServers';
import { routerRedux } from "dva/router";
export default {
	namespace: 'advancedUpload',
	loading: true, 
	state: {
    pageFlag: '',
		year: '',
    disAbled:false,
    deptData: [],//申请单位名单
    examineObj:"",//申请单位
    selectdept:[],//选中申请单位
    selectauth:[],
    selectnames:[],
    commentTin: [],//事迹介绍或评语
    pictureList: [],//图片存放
    pictureListArr: [],//图片存放
    nameKey:'',
    author:[null],
    loading: [false],
	},
	reducers: { // 刷新数据
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},
	effects: {
    *initNot({query}, {call, put, select}){
      yield put({
        type: 'save',
        payload: {
          selectdept:[],//选中申请单位id
          commentTin: [],//事迹介绍或评语
          pictureList: [],//图片存放
          pictureListArr: [],//图片存放
          author:[null],
          loading: [false],
          pageFlag:'',
        }
      });
    },
		*init({query}, {call, put, select}) {
      yield put({
        type: 'save',
        payload: {
          year: query.year,
          pageFlag: query.flag,
          selectdept:[],//选中申请单位id
          commentTin: [],//事迹介绍或评语
          pictureList: [],//图片存放
          pictureListArr: [],//图片存放
          author:[null],
          loading: [false],
        }
      });
      //默认单位
			let data = yield call(Services.queryDept);
      const {pageFlag} = yield select(v =>v.advancedUpload);
      if(pageFlag == 'u') {
        data.dataRows.length == 0 ?  [] : data.dataRows.map((v, i) => {
          v.key = i + '';
          v.title = v.deptName
          v.value =v.deptId;
          v.label = v.deptName;
          v.disabled = false;
          v.children = []
        })
      }else if(pageFlag == 'c'){
        data.dataRows.length == 0 ?  [] : data.dataRows.map((v, i) => {
          v.key = i + '';
          v.title = v.deptName
          v.value = v.deptId
          v.label = v.deptName;
          v.disabled = true;
          v.children.map((item, index) => {
            item.key = i + '-' + index;
            item.value =item.deptId
            item.title = item.deptName
            v.label = v.deptName;
          })
        })
      }
      if(data.retCode == '1') {
				yield put({
					type: 'save',
					payload: {
						deptData: JSON.parse(JSON.stringify(data.dataRows))
					}
				})
      }else{
				message.error(data.retVal)
			}
		},
    //选中单位
    *deptValue({record,name}, {put, call, select}) {
      const {selectdept,author} = yield select(v =>v.advancedUpload);
      author.map(itme=>{
        selectdept.push(itme)
      });
      selectdept.splice(name,1,record);
      if(selectdept.length !== author.length){
        selectdept.splice(author.length,selectdept.length-author.length);
      }
      yield put({
        type:'save',
        payload:{
          selectdept:JSON.parse(JSON.stringify(selectdept)),
        }
      });
    },
    //事迹介绍或评语
    *comment({record, name}, {put, select}) {
      const {commentTin,author} = yield select(v => v.advancedUpload);
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
      const {pictureListArr,author} = yield select(v => v.advancedUpload);
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
      const {author,selectdept, commentTin ,pictureList, pictureListArr} = yield select(v => v.advancedUpload);
      author.splice(record, 1);
      selectdept.splice(record, 1);//单位
      commentTin.splice(record, 1);//事迹介绍或评语
      pictureList.splice(record, 1);
      pictureListArr.splice(record, 1);
      yield put({
        type: 'save',
        payload: {
          author: JSON.parse(JSON.stringify(author)),
        }
      })
    },
    //添加
    * add({record}, {put, select}) {
      const {author} = yield select(v => v.advancedUpload);
      author.length++;
      yield put({
        type: 'save',
        payload: {
          author: JSON.parse(JSON.stringify(author)),
        }
      })
    },
    //取消-保存
    *submissionTopic({record, name,saveData,outputHTML}, {call, put, select}){
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
            pictureListArr:[],
          }
        });
      }if(record == '提交'){
        const {year,pageFlag,author,selectdept, commentTin , pictureListArr} = yield select(v => v.advancedUpload);
        let dataArr =[];
        if( selectdept.length == '0' || commentTin.length == '0'||pictureListArr.length == '0'){
          message.info('必填项不能为空')
        }else{
          author.map((item,index)=>{
            if(selectdept[index] == null ||selectdept[index] == undefined){
              message.info('部门不能为空')
            }else if(commentTin[index] == null ||commentTin[index] == undefined){
              message.info('事迹介绍或评语不能为空')
            }else if(pictureListArr[index] == null ||pictureListArr[index] == undefined){
              message.info('照片不能为空')
            }else {
              dataArr.push({
                deptId:selectdept[index].value,//部门ID
                deptName:selectdept[index].label,//// 部门名字
                deed:commentTin[index],//事迹描述
                image:pictureListArr[index]
              });
            }
          });
        }
        if(dataArr.length == author.length){
          const strData ={
            selectionJson:JSON.stringify(dataArr),
            uploadTime: year,//年份
            type:pageFlag,//个体c/单位u
          };
          let data = yield call(Services.uploadEvaluationUpload, strData);
          if(data.retCode==='1') {
            message.info('提交成功');
            yield put(routerRedux.push({
              pathname:'/adminApp/newsOne/creatExcellence',
            }));
            yield put({
              type: 'save',
              payload: {
                commentTin: [],
                selectdept: [],
                author: [null],
                authorBy: [],
                pictureListArr: []
              }
            });
          }
        }
      }
    },
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/newsOne/creatExcellence/advancedUpload') { //此处监听的是连接的地址
					dispatch({type: 'init', query}); 
			  }else {
          dispatch({type: 'initNot', query});
        }
			});
		},
	},
}
