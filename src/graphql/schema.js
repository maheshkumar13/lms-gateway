/**
   @author Rahul Islam
   @date    XX/XX/XXXX
   @version 1.0.0
*/

import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import { Subjects, getSubjectTextbookTopic } from './settings/subject/subject.query';
import { InstituteHierarchy, InstituteHierarchyPaginated,ChildDataFromParent } from './settings/instituteHierarchy/instituteHierarchy.query';
import { Institute } from './settings/institute/institute.query';
import { InstituteHierarchyGrid } from './settings/instituteHierarchy/instituteHierarchyGrid.query';
import { updateCategory } from './settings/instituteHierarchy/instituteHierarchy.mutaion';
import { createSubject } from './settings/subject/subject.mutation';
import { Programs } from './settings/programs/programs.query';
import { Textbooks , TextbooksInfo} from './settings/textbook/textbook.query';
import { createTextbook, updateTextbook, deleteTextbook } from './settings/textbook/textbook.mutation';
import { Students, StudentUniqueValues, StudentsByLastNode, StudentById } from './settings/student/student.query';
import { updateStudentAvatar, updateStudentSubjects } from './settings/student/student.mutation';
import { ConceptTaxonomy } from './settings/conceptTaxonomy/conceptTaxonomy.query';
import { ContentMapping, ContentMappingStats, CmsCategoryStats, CategoryWiseFiles, FileData, CmsTopicLevelStats, TextbookBasedQuiz } from './settings/contentMapping/contentMapping.query';
import { LaunchRequest } from './launcher/launchRequest/launchRequest.query';
import { Questions, Results, QuestionEvaluation } from './tests/questions/questions.query';
import { MasterResults } from './tests/masterResults/masterResults.query';
import { InsertContent } from './settings/contentMapping/contentMapping.mutation';
import { CreateTestType,DeleteTestType,UpdateTestType} from  './settings/testType/testType.mutation';
import { TestType} from './settings/testType/testType.query';
import {TestPatterns} from './settings/testPattern/testPattern.query'
import {createTestPattern,updateTestPattern,deleteTestPattern} from './settings/testPattern/testPattern.mutation'

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      Subjects,
      InstituteHierarchy,
      Institute,
      InstituteHierarchyGrid,
      Textbooks,
      ConceptTaxonomy,
      InstituteHierarchyPaginated,
      Students,
      StudentUniqueValues,
      StudentsByLastNode,
      Programs,
      ContentMapping,
      LaunchRequest,
      Questions,
      Results,
      StudentById,
      MasterResults,
      CmsCategoryStats,
      CategoryWiseFiles,
      FileData,
      QuestionEvaluation,
      CmsTopicLevelStats,
      TextbookBasedQuiz,
      getSubjectTextbookTopic,
      ContentMappingStats,
      ChildDataFromParent,
      TestType,
      TextbooksInfo,
      TestPatterns
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      createSubject,
      createTextbook,
      updateTextbook,
      deleteTextbook,
      updateCategory,
      updateStudentAvatar,
      updateStudentSubjects,
      InsertContent,
      CreateTestType,
      DeleteTestType,
      UpdateTestType,
      createTestPattern,
      updateTestPattern,
      deleteTestPattern
    },
  }),
});

export default schema;
