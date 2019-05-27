/**
@author Aslam Shaik
@data    14/03/2018
@version 1.0.0
*/

import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
  GraphQLInt as IntType,
  GraphQLList as List,
  GraphQLFloat as FloatType,
  GraphQLInputObjectType as InputObjectType,
  GraphQLEnumType as EnumType,
} from 'graphql';
// import GraphQLJSON from 'graphql-type-json';

const QuestionEnumType = new EnumType({
  name: 'QuestionEnumType',
  values: {
    single_answer_type: {
      value: 'Single Answer Type',
    },
    multiple_answer_type: {
      value: 'Multiple Answer',
    },
    integer_type: {
      value: 'Integer Type',
    },
    matrix_match: {
      value: 'Matrix match',
    },
    paragraph_type: {
      value: 'Paragraph Type',
    },
  },
});

export const markingSchemaEnumType = new EnumType({ // eslint-disable-line
  name: 'markingSchemaEnumType',
  values: {
    competitiveExam: {
      value: 'competitiveExam',
    },
    olympiad: {
      value: 'olympiad',
    },
    acads: {
      value: 'acads',
    },
  },
});


const InputSubjectMarksType = new InputObjectType({
  name: 'InputSubjectMarksType',
  description: 'Section wise marks in subject',
  fields: {
    questionType: { type: new NonNull(QuestionEnumType), description: 'Type of question' },
    numberOfQuestions: { type: new NonNull(IntType), description: 'Number of question in this section' },
    numberOfSubQuestions: { type: new NonNull(IntType), description: 'Number of sub questions in this question' },
    C: { type: new NonNull(IntType), description: 'Marks for each correct answered question in this question' },
    W: { type: new NonNull(IntType), description: 'Marks for each wrong answered question in this question' },
    U: { type: new NonNull(IntType), description: 'Marks for each Unattempted question' },
    P: { type: IntType, description: 'Partial Marks' },
    ADD: { type: IntType, description: 'Additional marks if any' },
    totalMarks: { type: new NonNull(IntType), description: 'Total marks in this section' },
    marksPerQuestion: { type: new NonNull(IntType), description: 'Marks per question' },
  },
});


const InputSubjectsType = new InputObjectType({
  name: 'InputSubjectsType',
  description: 'Subject wise marks distribution',
  fields: {
    tieBreaker: { type: IntType, description: 'Priority in case of tie' },
    subject: { type: new NonNull(StringType), description: 'Name of the subject' },
    code: { type: new NonNull(StringType), description: 'Internal code fo the subject' },
    parentCode: { type: new NonNull(StringType), description: 'Parent Internal code of the subject' },
    subjectCode: { type: new NonNull(StringType), description: 'Subject code given by the user' },
    totalQuestions: { type: new NonNull(IntType), description: 'Total questions in this subject' },
    totalMarks: { type: new NonNull(IntType), description: 'Total marks in this subject' },
    marks: { type: new NonNull(new List(InputSubjectMarksType)), description: 'Section wise marks distribution for this subject' },
  },
});

export const InputTestPatternSchemaType = new InputObjectType({
  name: 'InputTestPatternSchemaType',
  description: 'Marks distribution subjects and questions wise',
  fields: {
    testType: { type: StringType, description: 'Type of marking schema based on test pattern selected' },
    testName: { type: new NonNull(StringType), description: 'Name of marking schema based on test pattern selected' },
    totalQuestions: { type: new NonNull(IntType), description: 'Total number of questions in the test' },
    totalMarks: { type: new NonNull(IntType), description: 'Total marks in the test' },
    subjects: { type: new NonNull(new List(InputSubjectsType)), description: 'Marks distribution' },
    markingSchemaType: { type: markingSchemaEnumType, description: 'Type of marking schema' },
  },
});


const SubjectMarksType = new ObjectType({
  name: 'SubjectMarksType',
  description: 'Section wise marks in subject',
  fields: {
    questionType: { type: StringType, description: 'Type of question' },
    numberOfQuestions: { type: IntType, description: 'Number of question in this section' },
    numberOfSubQuestions: { type: IntType, description: 'Number of sub questions in this question' },
    C: { type: FloatType, description: 'Marks for each correct answered question in this question' },
    W: { type: FloatType, description: 'Marks for each wrong answered question in this question' },
    U: { type: FloatType, description: 'Marks for each Unattempted question' },
    P: { type: FloatType, description: 'Partial Marks' },
    ADD: { type: FloatType, description: 'Additional marks if any' },
    totalMarks: { type: IntType, description: 'Total marks in this section' },
    start: { type: IntType, description: 'Starting question number' },
    end: { type: IntType, description: 'Ending question number' },
    section: { type: IntType, description: 'Current section' },
    marksPerQuestion: { type: IntType, description: 'Marks per question' },
  },
});


const SubjectsType = new ObjectType({
  name: 'SubjectsType',
  description: 'Subject wise marks distribution',
  fields: {
    tieBreaker: { type: IntType, description: 'Priority in case of tie' },
    subject: { type: StringType, description: 'Name of the subject' },
    code: { type: StringType, description: 'Internal code fo the subject' },
    parentCode: { type: StringType, description: 'Parent Internal code of the subject' },
    subjectCode: { type: StringType, description: 'Subject code given by the user' },
    totalQuestions: { type: IntType, description: 'Total questions in this subject' },
    totalMarks: { type: IntType, description: 'Total marks in this subject' },
    marks: { type: new List(SubjectMarksType), description: 'Section wise marks distribution for this subject' },
    start: { type: IntType, description: 'Starting question number' },
    end: { type: IntType, description: 'Ending question number' },
  },
});

export const TestPatternSchemaType = new ObjectType({
  name: 'TestPatternSchemaType',
  description: 'Marks distribution subjects and questions wise',
  fields: {
    default: { type: BooleanType, description: 'Default or not' },
    testType: { type: StringType, description: 'Type of marking schema based on test pattern selected' },
    testName: { type: StringType, description: 'Name of marking schema based on test pattern selected' },
    totalQuestions: { type: IntType, description: 'Total number of questions in the test' },
    totalMarks: { type: IntType, description: 'Total marks in the test' },
    subjects: { type: new List(SubjectsType), description: 'Marks distribution' },
    markingSchemaType: { type: markingSchemaEnumType, description: 'Type of marking schema' },
  },
});


export default{
  InputTestPatternSchemaType,
  TestPatternSchemaType,
  markingSchemaEnumType,
};