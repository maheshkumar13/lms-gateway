import {listTest , listTextBooksWithTestSubectWise, getDashboardHeadersAssetCountV2, getCMSTestStats, testAnalysis } from '../../../api/tests/upload/test.upload.controller';
import {ListInputType, ListTestOutput, TestHeadersAssetCountInputType,CmsTestStatsInputType,CmsTestStatsOutputType, TestAnalysisOutputType } from './upload.type';
import {getStudentDetailsById} from '../../../api/settings/student/student.controller';
import {getTextbooks, getTextbookForTeachers} from '../../../api/settings/textbook/textbook.controller';
import {GraphQLString as StringType, GraphQLNonNull as NonNull, GraphQLList as List, GraphQLInt as IntType } from 'graphql';
import { validateAccess } from '../../../utils/validator';
import {fetchNodesWithContext} from '../../../api/settings/instituteHierarchy/instituteHierarchy.controller'
import GraphQLJSON from 'graphql-type-json';

export const ListTest = {
    args: {
        input: {
            type: ListInputType
        }
    },
    type: ListTestOutput,
    async resolve(object, args, context) {
        try {
            const validRoles = ['CMS_PERFORMANCE_VIEWER'];
            if (!validateAccess(validRoles, context)){
                throw new Error('Access Denied');
            }
            const orientationOfTeacher = context.orientations || [];
            const levelNames = ["Branch","Class"]
            const Nodes = await fetchNodesWithContext({levelNames},context); //class name and class code
            let classCodes = []
            let branchOfTeacher = [];
            Nodes.forEach((obj)=>{
                if(obj["levelName"]==="Branch"){
                    branchOfTeacher.push(obj.child)
                }else{
                    classCodes.push(obj.childCode)
                }
            })

            if(args.input.classCode && !classCodes.includes(args.input.classCode)){
                throw new Error("Invalid class selection.");
            }

            if(args.input.branch && !branchOfTeacher.includes(args.input.branch)){
                throw new Error("Invalid branch selection.")
            }

            if(args.input.orientation && orientationOfTeacher.length && !orientationOfTeacher.includes(args.input.orientation)){
                throw new Error("Invalid orientation selection.")
            }

            const textbookCode = await getTextbookForTeachers(args.input, context);
            if(!textbookCode.length){
                throw new Error("Invalid selection.");
            }

            if(!args.input.textbookCode){
                args.input.textbookCode = textbookCode
            }else{
                if(!textbookCode.includes(args.input.textbookCode)){
                    throw new Error("Invalid textbook selection");
                }else{
                    args.input.textbookCode = [args.input.textbookCode]
                }
            }
            return listTest(args.input, context);
        } catch (err) {
            throw new Error(err);
        }
    }
}

export const ListSubjectWiseBooksAndTestCount = {
    args: {
        subjectCode: {
            type: NonNull(StringType)
        }
    },
    type: GraphQLJSON,
    async resolve(object, args, context) {
        try{
            let studentInfo = await getStudentDetailsById({studentId: context.studentId}, context);
            if(!studentInfo){
                throw "Invalid Student";
            }
            args.branch = studentInfo["hierarchyLevels"]["L_5"];
            args.classCode = studentInfo["hierarchy"][1]["childCode"];
            args.orientation = studentInfo["orientation"];
            const textbooks = await getTextbooks(args, context);
            args.textbookCodes = textbooks.map( textbook => textbook.code)
            return await listTextBooksWithTestSubectWise(args,context);
        }catch(err){
            throw new Error(err);
        }
    }
}

export const HeaderCountForTextBookBasedTest = {
    args: {
        input: { type: TestHeadersAssetCountInputType },
    },
    type : GraphQLJSON,
    async resolve (object , args , context){
        try{
          return await getDashboardHeadersAssetCountV2(args.input,context);
        }catch(err){
            throw new Error(err);
        }
    }
}

export const CmsTestStats = {
    args: {
      input: { type: CmsTestStatsInputType },
    },
    type: new List(CmsTestStatsOutputType),
    async resolve(obj, args, context) {
      return getCMSTestStats(args.input, context)
        .then(async json => json);
    },
};

export const TestAnalysis = {
    args:{
        testId: { type: StringType, description: "Test Id"},
        studentId: { type: StringType, description: "Student Id"},
        limit: { type: IntType, description: "Number of rows to be returned"},
        skip: { type: IntType, description: "Number of rows to skip"}
    },
    type: TestAnalysisOutputType,
    async resolve (objects,args,context){
        try{
            const levelNames = ["Branch"]
            const Nodes = await fetchNodesWithContext({levelNames},context); //class name and class code
            const accessibleBranches = Nodes.map( node => {
                return node.childCode
            })
            // console.log(accessibleBranches)
            args["accessibleBranches"] = accessibleBranches
            return await testAnalysis(args,context)
        }catch(err){
            throw new Error(err);
        }
    }
}