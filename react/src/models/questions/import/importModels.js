/**
 * 文件说明：试题查询/导入
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-23
 */
import Cookie from 'js-cookie';
import * as service from '../../../services/questions/questionservices';
import message from '../../../components/commonApp/message'
import {getUuid} from '../../../utils/func';
export default {
  namespace:'questionsImport',
  state : {
    quesList:[],
    classifyList: [],
    typeList:[],
    sectionList:[]
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
    saveRes(state, {quesList,paramTag}) {
      return {
        ...state,
        quesList,
        paramTag
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
    saveSectionRes(state, {sectionList}) {
      return {
        ...state,
        sectionList
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
      yield put({type: 'classifySearch'});
      yield put({type: 'typeSearch'});
      yield put({type: 'sectionSearch'});
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
          classifyList: DataRows
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
    *sectionSearch({}, {call, put}) {
      const {DataRows} = yield call(service.sectionquery,
        {
          transjsonarray:JSON.stringify({"condition":{"parentid":"00000000","state":"0"},"sequence":[{"sortnum":"0"}]}),
        });
      if(DataRows.length){
        yield put({
          type: 'saveSectionRes',
          sectionList: DataRows
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
    *questionsSearch({query}, {call, put}) {
      yield put({
        type: 'saveRes',
        quesList: []
      });
      const data = yield call(service.questionsquery,query);
      if(data.RetCode === '1' && data.DataRows && data.DataRows.length){
        // let data = [
        //   {"type_uid":'1',"question_name":'在Oracle中，下面用于限制分组函数的返回值的子句是（）。',
        //     "options":[{"option_name":"WHERE"},{"option_name":"HAVING"},{"option_name":"ORDER BY"},
        //       {"option_name":"无法限定分组函数的返回值"}],
        //     "answer":[{"answer":'A'}],"state":'0'},
        //   {"type_uid":'2',"question_name":'_____年，______月回家过年！',
        //     "answer":[{"answer":'2017'},{"answer":'12'}],"state":'0'},
        //   {"type_uid":'2',"question_name":'在AIX UNIX操作系统中，使用______命令显示出当前的工作目录；' +
        //   '使用______命令将文件显示在终端上，每次一屏，在左下部显示百分比表示已显示的部分。',
        //     "answer":[{"answer":'2017'},{"answer":'12'}],"state":'0'},
        //   {"type_uid":'4',"question_name":'sse',
        //     "answer":[{"answer":'sdsd'}],"state":'0'}
        // ];

        yield put({
          type: 'saveRes',
          quesList: data.DataRows,
          paramTag:data.ParamTag
        });
      }else{
        message.warning("未查询到符合条件的试题！")
      }
    },
    /**
     * 功能：导入试题
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-23
     * @param pageCondition 分页数据
     */
      *import({path,arg_section,arg_post,arg_type,arg_tag}, {call, put}) {
      const {DataRows} = yield call(service.questionsimport,
        {
          path,arg_section,arg_post,arg_type,arg_tag
        });
      if(DataRows.length){
        let data = [
          {"question":'sse',"answer":"sdsd","state":'0'}
        ];
        yield put({
          type: 'saveRes',
          quesList: data
        });
      }
    },

  },
  subscriptions : {
    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        if (pathname ==='/humanApp/questions/import') {
          dispatch({
            type:'fetch',
          });
        }
      });

    },
  },
}
