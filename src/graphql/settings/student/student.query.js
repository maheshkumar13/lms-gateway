/**
   @author Aakash Parsi
   @date    22/04/2019
   @version 1.0.0
*/

import {
  GraphQLList as List,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import controller from '../../../api/settings/student/student.controller';
import { StudentType, StudentDetailsOutputType, StudentHeaderType, StudentListByFiltersOutputType} from './student.type';

const pageInfoType = new ObjectType({
  name: 'StudentpageInfo',
  fields() {
    return {
      pageNumber: {
        type: IntType,
      },
      nextPage: {
        type: BooleanType,
      },
      prevPage: {
        type: BooleanType,
      },
      totalPages: {
        type: IntType,
      },
      totalEntries: {
        type: IntType,
      },
    };
  },
});

const studentDetailsType = new ObjectType({
  name: 'StudentDetailsType',
  fields() {
    return {
      page: {
        type: new List(StudentType),
      },
      hierarchy: {
        type: GraphQLJSON,
      },
      pageInfo: {
        type: pageInfoType,
      },
    };
  },
});

export const Students = {
  args: {
    egnifyId: { type: StringType },
    sortby: { type: StringType },
    order: { type: IntType },
    pageNumber: { type: NonNull(IntType) },
    limit: { type: NonNull(IntType) },
    regex: { type: StringType },
    childCode: { type: StringType },
    filters: { type: GraphQLJSON },
    studentIdAndNameOnly: { type: BooleanType },
  },
  type: studentDetailsType,
  async resolve(obj, args, context) {
    if (!args.pageNumber) args.pageNumber = 1; // eslint-disable-line
    // if (!args.limit) args.limit = 100; // eslint-disable-line
    if (args.pageNumber < 1) {
      return new Error('Page Number must be positive');
    }
    if (args.regex !== undefined) {
      args.regex = args.regex.replace(/\s\s+/g, ' ').trim(); //eslint-disable-line
      if (args.regex === '') {
        args.regex = undefined; //eslint-disable-line
      }
    }
    if (args.filters !== undefined) {
      args.filters = JSON.stringify(args.filters); // eslint-disable-line
    }
    return controller.getStudents(args, context) //eslint-disable-line
      .then((json) => {
        const data = {};
        data.page = json.students;
        data.hierarchy = json.hierarchy;

        const pageInfo = {};
        pageInfo.prevPage = true;
        pageInfo.nextPage = true;
        pageInfo.pageNumber = args.pageNumber;
        pageInfo.totalPages = Math.ceil(json.count / args.limit)
          ? Math.ceil(json.count / args.limit)
          : 1;
        pageInfo.totalEntries = json.count;

        if (args.pageNumber < 1 || args.pageNumber > pageInfo.totalPages) {
          return new Error('Page Number is invalid');
        }

        if (args.pageNumber === pageInfo.totalPages) {
          pageInfo.nextPage = false;
        }
        if (args.pageNumber === 1) {
          pageInfo.prevPage = false;
        }
        data.pageInfo = pageInfo;
        return data;
      }).catch((err) => {
        console.error(err);
        return new Error(err.message);
      });
  },
};

export const StudentUniqueValues = {
  args: {
    key: { type: StringType },
    level: { type: IntType },
    childCode: { type: new List(StringType) },
  },
  type: GraphQLJSON,
  async resolve(obj, args, context) { // eslint-disable-line
    return controller.getUniqueValues(args, context) //eslint-disable-line
      .then(response => response.json())
      .then(json => json)
      .catch((err) => {
        console.error(err);
      });
  },
};

export const StudentsByLastNode = {
  args: {
    list: { type: new NonNull(new List(StringType)) },
  },
  type: GraphQLJSON,
  async resolve(obj, args, context) { // eslint-disable-line

    args.list = JSON.stringify(args.list) // eslint-disable-line
    return controller.numberOfStudentsByLastNode(args, context) //eslint-disable-line
      .then((response) => {
        if (response.status >= 400) {
          return new Error(response.statusText);
        }
        return response.json();
      })
      .catch(err =>
        new Error(err.message));
  },
};

export const StudentById = {
  args: {
    studentId: { type: new NonNull(StringType) },
  },
  type: StudentDetailsOutputType,
  async resolve(obj, args, context) { // eslint-disable-line
    // args.list = JSON.stringify(args.list) // eslint-disable-line
    return controller.getStudentDetailsById(args, context) //eslint-disable-line
      .then(response => response)
      .catch(err => err);
  },
};
export const studentHeader = {
  args: {
    className: { type: new List(StringType) },
    branch: { type: new List(StringType) },
    country: { type: new List(StringType) },
    state: { type: new List(StringType) },
    city: { type: new List(StringType) },
    section: { type: new List(StringType) },
    orientation: { type: new List(StringType) },
  },
  type: StudentHeaderType,
  async resolve(obj, args, context) {
    try {
      const docs = await controller.getStudentHeader(args, context);
      return docs;
    } catch (err) {
      throw new Error("Internal Error");
    }
  },
};
//studentlistbyfilters api start here
export const StudentListByFilters = {
  //argument list
  args: {
    pageNumber: { type: NonNull(IntType) },
    limit: { type: NonNull(IntType) },
    className: { type: new List(StringType) },
    branch: { type: new List(StringType) },
    country: { type: new List(StringType) },
    state: { type: new List(StringType) },
    city: { type: new List(StringType) },
    section: { type: new List(StringType) },
    orientation: { type: new List(StringType) },
  },
  //return type
  type: StudentListByFiltersOutputType,
  async resolve(obj, args, context) {
    try {
      if (!args.pageNumber) args.pageNumber = 1;
      if (args.pageNumber < 1) {
        return new Error('Page Number must be positive');
      }
      const studentData = await controller.getStudentListByFilters(args, context);
      const data = {};
          data.page = studentData.pageData;
          const pageInfo = {};
          pageInfo.prevPage = true;
          pageInfo.nextPage = true;
          pageInfo.pageNumber = args.pageNumber;
          pageInfo.limit = args.limit;
          pageInfo.totalPages = Math.ceil(studentData.count / args.limit)
            ? Math.ceil(studentData.count / args.limit)
            : 1;
          pageInfo.totalEntries = studentData.count;
          if (args.pageNumber < 1 || args.pageNumber > pageInfo.totalPages) {
            return new Error('Page Number is invalid');
          }
          if (args.pageNumber === pageInfo.totalPages) {
            pageInfo.nextPage = false;
          }
          if (args.pageNumber === 1) {
            pageInfo.prevPage = false;
          }
          data.pageInfo = pageInfo;
          return data;
      }
     catch (err) {
      throw new Error("Internal Error");
    }
  },
};
//studentlistbyfilters api ends here
export default{
  StudentUniqueValues,
  Students,
  StudentsByLastNode,
  StudentById,
  studentHeader,
  StudentListByFilters
};
