/**
 * 文件说明：试题查询/导入
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-23
 */
import * as service from '../../../services/questions/questionservices';
import message from '../../../components/commonApp/message'
export default {
  namespace:'questionSelect',
  state : {
    quesList:[],
    classifyList: [],
    typeList:[],
    partList:[],
    difficultyList:[],
    countList:[]
  },

  reducers : {
    /**
     * 功能：更新状态树-题库岗位信息查询结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param state 初始状态
     * @param list 题库岗位信息查询结果
     */
    saveRes(state, {quesList,totalScore}) {
      return {
        ...state,
        quesList,
        totalScore
      };
    },
    /**
     * 功能：更新状态树-题库岗位信息查询结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param state 初始状态
     * @param list 题库岗位信息查询结果
     */
    saveClassifyRes(state, {classifyList}) {
      return {
        ...state,
        classifyList
      };
    },
    /**
     * 功能：更新状态树-试题类型信息查询结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param state 初始状态
     * @param list 题库岗位信息查询结果
     */
    saveTypeRes(state, {typeList}) {
      return {
        ...state,
        typeList
      };
    },
    /**
     * 功能：更新状态树-试题章节信息查询结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param state 初始状态
     * @param list 题库岗位信息查询结果
     */
    savePartRes(state, {partList}) {
      return {
        ...state,
        partList
      };
    },
    /**
     * 功能：更新状态树-难易程度信息查询结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param state 初始状态
     * @param list 题库岗位信息查询结果
     */
    saveDifficultyRes(state, {difficultyList}) {
      return {
        ...state,
        difficultyList
      };
    },
    /**
     * 功能：更新状态树-可选择试题数量查询结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param state 初始状态
     * @param countList 选择试题数量查询结果
     */
    saveCountRes(state, {countList}) {
      return {
        ...state,
        countList
      };
    },
  },
  effects:{
    /**
     * 功能：查询所有岗位记录
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param pageCondition 分页数据
     */
    *fetch({}, {call, put}) {
      yield put({
        type: 'saveRes',
        quesList: [],
        totalScore:0
      });
      yield put({type: 'classifySearch'});
      yield put({type: 'typeSearch'});
      yield put({type: 'partSearch'});
      yield put({type: 'difficultySearch'});
    },
    /**
     * 功能：查询所有岗位记录
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param pageCondition 分页数据
     */
    *classifySearch({}, {call, put}) {
      const {DataRows} = yield call(service.positionquery,
        {
          transjsonarray:JSON.stringify({"condition":{"state":"0"},"sequence":[{"sortnum":"0"}]}),
        });
      if(DataRows.length){
        yield put({
          type: 'saveClassifyRes',
          classifyList: DataRows.filter(item => item.classify_uid !== 'FFFFFFFFEEEEEEEE1111111100000000')
        });
      }
    },
    /**
     * 功能：查询所有问题类型
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param pageCondition 分页数据
     */
    *typeSearch({}, {call, put}) {
      const {DataRows} = yield call(service.typequery,
        {
          transjsonarray:JSON.stringify({"condition":{"state":"0"},"sequence":[{"sortnum":"0"}]}),
        });
      if(DataRows.length){
        yield put({
          type: 'saveTypeRes',
          typeList: DataRows
        });
      }
    },
    /**
     * 功能：查询所有章节类型
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param pageCondition 分页数据
     */
    *partSearch({}, {call, put}) {
      const {DataRows} = yield call(service.sectionquery,
        {
          transjsonarray:JSON.stringify({"condition":{"parentid":"00000000","state":"0"},"sequence":[{"sortnum":"0"}]}),
        });
      if(DataRows.length){
        yield put({
          type: 'savePartRes',
          partList: DataRows
        });
      }
    },
    /**
     * 功能：查询难易程度
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param pageCondition 分页数据
     */
    *difficultySearch({}, {call, put}) {
      const {DataRows} = yield call(service.difficultyquery,
        {
          transjsonarray:JSON.stringify({"condition":{"state":"0"},"sequence":[{"sortnum":"0"}]}),
        });
      if(DataRows.length){
        yield put({
          type: 'saveDifficultyRes',
          difficultyList: DataRows
        });
      }
    },
    /**
     * 功能：查询已导入试题
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param pageCondition 分页数据
     */
    *questionsSearch({post,condition}, {call, put}) {
      yield put({
        type: 'saveRes',
        quesList: [],
        totalScore:null
      });
      const data = yield call(service.questionsextract,
        {
          arg_post:post,
          arg_condition:JSON.stringify(condition),
        });
      if(data.RetCode ==='1'){
        if(data.BatchId){
          const dataRes = yield call(service.questionsextractselect,
            {
              arg_batch:data.BatchId
            });
          if(dataRes.RetCode === '1'){
            if(dataRes.DataRows && dataRes.DataRows.length){
              yield put({
                type: 'saveRes',
                quesList: dataRes.DataRows,
                totalScore:dataRes.TotalScore
              });
            }else{
              message.error("没有符合条件的试题结果！")
            }
          }else{
            message.error("试题抽取失败！")
          }

        }else{
          message.error("不存在BatchId")
        }
      }else{
        message.error("查询失败！")
      }
    },

    /**
     * 功能：查询可选择实体数量
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param pageCondition 分页数据
     */
      *toSelectCountSearch({index,query}, {call, put}) {
      const data = yield call(service.questionstoselectcount,query);
      if(data.RetCode === '1'){
        yield put({
          type: 'saveCountRes',
          countList: [{"index":index,"count":data.RowCount,"targetScore":data.TargetScore}]
        });
      }
    },
  },
  subscriptions : {
    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        if (pathname ==='/humanApp/questions/select') {
          dispatch({
            type:'fetch',
          });
        }
      });

    },
  },
}
