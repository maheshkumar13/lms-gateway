/**
   @author Aslam
   @date    XX/XX/XXXX
   @version 1.0.0
*/

import {
  GraphQLList as List,
  // GraphQLNonNull as NonNull,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,

} from 'graphql';

import GraphQLJSON from 'graphql-type-json';

import { SubjectType } from './subject.type';

const controller = require('../../../api/settings/subject/subject.controller');

export const Subjects = {
  args: {
    classCode: { type: StringType, description: 'Internal code of class' },
    SubjectType: { type: StringType, description: 'Internal code of subjecttype' },
    all: { type: BooleanType, description: 'default false for student, default true for admin'}
  },
  type: new List(SubjectType),
  async resolve(obj, args, context) {
    return controller.getSubjects(args, context);
  },
};

export const getSubjectTextbookTopic = {
  type: GraphQLJSON,
  async resolve(obj, args, context) {
    return controller.getSubjectTextbookTopic(args, context);
  }
}

export default{
  Subjects,
  getSubjectTextbookTopic
};