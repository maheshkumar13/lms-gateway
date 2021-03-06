import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLBoolean as BooleanType,
  GraphQLList as List,
  GraphQLEnumType as EnumType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import GraphQLDate from 'graphql-date';
import GraphQLJSON from 'graphql-type-json';

import { TimeAnalysisType, TimeAnalysisHeadersType, TimeAnalysisListType, TimeAnalysisListByDayType, TimeAnalysisHeadersTypev2, TimeAnalysisViewStudentsListType } from './timeAnalysis.type';
import { validateAccess } from '../../../utils/validator';

const controller = require('../../../api/analysis/timeAnalysis/timeAnalysis.controller');

const pageInfoType = new ObjectType({
  name: 'TimeAnalysisgPageInfoType',
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

const TimeAnalysisPaginatedType = new ObjectType({
  name: 'TimeAnalysisPaginatedType',
  fields() {
    return {
      data: {
        type: new List(TimeAnalysisType),
      },
      pageInfo: {
        type: pageInfoType,
      },
    };
  },
});

export const StudentLevelTimeAnalysis = {
  args: {
    studentId: { type: StringType, description: 'Unique Identifier for the student' },
    class: { type: StringType, description: 'Class name' },
    branch: { type: StringType, description: 'Branch name' },
    orientation: { type: StringType, description: 'Orientation' },
    startDate: { type: GraphQLDate, description: 'Start date' },
    endDate: { type: GraphQLDate, description: 'End date' },
    pageNumber: { type: IntType, description: 'Page number' },
    limit: { type: IntType, description: 'Number of docs per page' },
  },
  type: TimeAnalysisPaginatedType,
  async resolve(obj, args, context) {
    const validRoles = ['LMS_ENGAGEMENT_VIEWER', 'Egni_u001_student'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    if (!args.pageNumber) args.pageNumber = 1; // eslint-disable-line
    if (!args.limit) args.limit = 0; // eslint-disable-line
    if (args.pageNumber < 1) throw new Error('Page Number is invalid');
    if (args.limit < 0) throw new Error('Invalid limit');
    return controller.getStudentLevelTimeAnalysis(args, context).then(([count, data]) => {
      const pageInfo = {};
      const resp = {};
      pageInfo.prevPage = true;
      pageInfo.nextPage = true;
      pageInfo.pageNumber = args.pageNumber;
      pageInfo.totalPages = args.limit && count ? Math.ceil(count / args.limit) : 1;
      pageInfo.totalEntries = count;
      resp.data = data;

      if (args.pageNumber < 1 || args.pageNumber > pageInfo.totalPages) {
        throw new Error('Page Number is invalid');
      }
      if (args.pageNumber === pageInfo.totalPages) {
        pageInfo.nextPage = false;
      }
      if (args.pageNumber === 1) {
        pageInfo.prevPage = false;
      }
      resp.pageInfo = pageInfo;
      return resp;
    });
  },
}

export const TeacherLevelTimeAnalysis = {
  args: {
    class: { type: StringType, description: 'Class name' },
    branch: { type: StringType, description: 'Branch name' },
    orientation: { type: StringType, description: 'Orientation' },
    section: { type: StringType, description: 'Section' },
    startDate: { type: GraphQLDate, description: 'Start date' },
    endDate: { type: GraphQLDate, description: 'End date' },
    pageNumber: { type: IntType, description: 'Page number' },
    limit: { type: IntType, description: 'Number of docs per page' },
  },
  type: TimeAnalysisPaginatedType,
  async resolve(obj, args, context) {
    const validRoles = ['CMS_ENGAGEMENT_VIEWER'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    if (!args.pageNumber) args.pageNumber = 1; // eslint-disable-line
    if (!args.limit) args.limit = 0; // eslint-disable-line
    if (args.pageNumber < 1) throw new Error('Page Number is invalid');
    if (args.limit < 0) throw new Error('Invalid limit');
    return controller.getTeacherLevelTimeAnalysis(args, context).then(([count, data]) => {
      const pageInfo = {};
      const resp = {};
      pageInfo.prevPage = true;
      pageInfo.nextPage = true;
      pageInfo.pageNumber = args.pageNumber;
      pageInfo.totalPages = args.limit && count ? Math.ceil(count / args.limit) : 1;
      pageInfo.totalEntries = count;
      resp.data = data;

      if (args.pageNumber < 1 || args.pageNumber > pageInfo.totalPages) {
        throw new Error('Page Number is invalid');
      }
      if (args.pageNumber === pageInfo.totalPages) {
        pageInfo.nextPage = false;
      }
      if (args.pageNumber === 1) {
        pageInfo.prevPage = false;
      }
      resp.pageInfo = pageInfo;
      return resp;
    });
  },
}
export const TimeAnalysis = {
  args: {
    studentId: { type: StringType, description: 'Unique Identifier for the student' },
    isStudent: { type: BooleanType, description: 'true for students data' },
    fullData: { type: BooleanType, description: 'full student analysis' },
    class: { type: StringType, description: 'Class name' },
    branch: { type: StringType, description: 'Branch name' },
    orientation: { type: StringType, description: 'Orientation' },
    startDate: { type: GraphQLDate, description: 'Start date' },
    endDate: { type: GraphQLDate, description: 'End date' },
    pageNumber: { type: IntType, description: 'Page number' },
    limit: { type: IntType, description: 'Number of docs per page' },
  },
  type: TimeAnalysisPaginatedType,
  async resolve(obj, args, context) {
    if (!args.pageNumber) args.pageNumber = 1; // eslint-disable-line
    if (!args.limit) args.limit = 0; // eslint-disable-line
    if (args.pageNumber < 1) throw new Error('Page Number is invalid');
    if (args.limit < 0) throw new Error('Invalid limit');
    return controller.getTimeAnalysis(args, context).then(([count, data]) => {
      const pageInfo = {};
      const resp = {};
      pageInfo.prevPage = true;
      pageInfo.nextPage = true;
      pageInfo.pageNumber = args.pageNumber;
      pageInfo.totalPages = args.limit && count ? Math.ceil(count / args.limit) : 1;
      pageInfo.totalEntries = count;
      resp.data = data;

      if (args.pageNumber < 1 || args.pageNumber > pageInfo.totalPages) {
        throw new Error('Page Number is invalid');
      }
      if (args.pageNumber === pageInfo.totalPages) {
        pageInfo.nextPage = false;
      }
      if (args.pageNumber === 1) {
        pageInfo.prevPage = false;
      }
      resp.pageInfo = pageInfo;
      return resp;
    });
  },
};

export const TimeAnalysisHeaders = {
  args: {
    class: { type: StringType, description: 'Class name' },
    branch: { type: StringType, description: 'Branch name' },
    orientation: { type: StringType, description: 'Orientation' },
    subject: { type: StringType, description: 'Subject name' },
    startDate: { type: GraphQLDate, description: 'Start date' },
    endDate: { type: GraphQLDate, description: 'End date' },
  },
  type: TimeAnalysisHeadersType,
  async resolve(obj, args, context) {
    const validRoles = ['CMS_ENGAGEMENT_VIEWER'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    return controller.getTimeAnalysisHeaders(args, context);
  },
};

export const TimeAnalysisHeadersv2 = {
  args: {
    class: { type: StringType, description: 'Class name' },
    branch: { type: StringType, description: 'Branch name' },
    orientation: { type: StringType, description: 'Orientation' },
    section: { type: StringType, description: 'Section' },
    startDate: { type: GraphQLDate, description: 'Start date' },
    endDate: { type: GraphQLDate, description: 'End date' },
  },
  type: TimeAnalysisHeadersTypev2,
  async resolve(obj, args, context) {
    const validRoles = ['CMS_ENGAGEMENT_VIEWER'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    return controller.getTimeAnalysisHeadersv2(args, context);
  },
};

const pageInfoListByDayType = new ObjectType({
  name: 'pageInfoListByDayType',
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

const TimeAnalysisPaginatedListType = new ObjectType({
  name: 'TimeAnalysisPaginatedListType',
  fields() {
    return {
      data: {
        type: new List(TimeAnalysisListType),
      },
      pageInfo: {
        type: pageInfoListByDayType,
      },
    };
  },
});

export const SortEnumType = new EnumType({ // eslint-disable-line
  name: 'SortEnumType',
  values: {
    ASC: {
      value: 1,
    },
    DESC: {
      value: -1,
    },
  },
});

export const SortByEnumType = new EnumType({ // eslint-disable-line
  name: 'SortByEnumType',
  values: {
    studentName: {},
    date: {}
  },
});

export const TimeAnalysisStudentsList = {
  args: {
    class: { type: StringType, description: 'Class name' },
    branch: { type: StringType, description: 'Branch name' },
    orientation: { type: StringType, description: 'Orientation' },
    startDate: { type: GraphQLDate, description: 'Start date' },
    endDate: { type: GraphQLDate, description: 'End date' },
    pageNumber: { type: IntType, description: 'Page number' },
    limit: { type: IntType, description: 'Number of docs per page' },
    sortBy: { type: SortByEnumType, description: 'Sort By' },
    sortType: { type: SortEnumType, description: 'Sort Type' },
    sortValue: { type: GraphQLDate, description: 'Sort Value' },
  },
  type: TimeAnalysisPaginatedListType,
  async resolve(obj, args, context) {
    const validRoles = ['CMS_ENGAGEMENT_VIEWER'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    if (!args.pageNumber) args.pageNumber = 1; // eslint-disable-line
    if (!args.limit) args.limit = 0; // eslint-disable-line
    if (args.pageNumber < 1) throw new Error('Page Number is invalid');
    if (args.limit < 0) throw new Error('Invalid limit');
    return controller.getTimeAnalysisStudentsList(args, context).then(([count, data]) => {
      const pageInfo = {};
      const resp = {};
      pageInfo.prevPage = true;
      pageInfo.nextPage = true;
      pageInfo.pageNumber = args.pageNumber;
      pageInfo.totalPages = args.limit && count ? Math.ceil(count / args.limit) : 1;
      pageInfo.totalEntries = count;
      resp.data = data;
      //console.log("datann : ",data)
      if (args.pageNumber < 1 || args.pageNumber > pageInfo.totalPages) {
        throw new Error('Page Number is invalid');
      }
      if (args.pageNumber === pageInfo.totalPages) {
        pageInfo.nextPage = false;
      }
      if (args.pageNumber === 1) {
        pageInfo.prevPage = false;
      }
      resp.pageInfo = pageInfo;
      
      return resp;
    });
  },
};


/************************TimeAnalysisStudentsListByDay****************************/


const pageInfoListType = new ObjectType({
  name: 'TimeAnalysisgFilterPageInfoType',
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

const TimeAnalysisPaginatedListByDayType = new ObjectType({
  name: 'TimeAnalysisPaginatedListByDayType',
  fields() {
    return {
      data: {
        type: new List(TimeAnalysisListByDayType),
      },
      pageInfo: {
        type: pageInfoListType,
      },
    };
  },
});
export const SortByDayValueType = new EnumType({ // eslint-disable-line
  name: 'SortByDayValueType',
  values: {
    Sun: {
      value: 1,
    },
    Mon: {
      value: 2,
    },
    Tue: {
      value: 3,
    },
    Wed: {
      value: 4,
    },
    Thu: {
      value: 5,
    },
    Fri: {
      value: 6,
    },
    Sat: {
      value: 7,
    },
  },
});
export const SortTypeByDayEnumType = new EnumType({ // eslint-disable-line
  name: 'SortTypeByDayEnumType',
  values: {
    ASC: {
      value: 1,
    },
    DESC: {
      value: -1,
    },
  },
});

export const SortByDayEnumType = new EnumType({ // eslint-disable-line
  name: 'SortByDayEnumType',
  values: {
    studentName: {},
    day: {},
    totalTimeSpent: {},
  
  },
});
export const TimeAnalysisStudentsListByDay = {
  args: {
    class: { type: StringType, description: 'Class name' },
    branch: { type: StringType, description: 'Branch name' },
    orientation: { type: StringType, description: 'Orientation' },
    startDate: { type: GraphQLDate, description: 'Start date' },
    endDate: { type: GraphQLDate, description: 'End date' },
    pageNumber: { type: IntType, description: 'Page number' },
    limit: { type: IntType, description: 'Number of docs per page' },
    sortBy: { type: SortByDayEnumType, description: 'Sort By' },
    sortType: { type: SortTypeByDayEnumType, description: 'Sort Type' },
    sortValue: { type: SortByDayValueType, description: 'Sort Value' },
  },
  type: TimeAnalysisPaginatedListByDayType,
  async resolve(obj, args, context) {
    const validRoles = ['CMS_ENGAGEMENT_VIEWER'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    if (!args.pageNumber) args.pageNumber = 1; // eslint-disable-line
    if (!args.limit) args.limit = 0; // eslint-disable-line
    if (args.pageNumber < 1) throw new Error('Page Number is invalid');
    if (args.limit < 0) throw new Error('Invalid limit');
    return controller.getTimeAnalysisStudentsListByDay(args, context).then(([count, data]) => {
      const pageInfo = {};
      const resp = {};
      pageInfo.prevPage = true;
      pageInfo.nextPage = true;
      pageInfo.pageNumber = args.pageNumber;
      pageInfo.totalPages = args.limit && count ? Math.ceil(count / args.limit) : 1;
      pageInfo.totalEntries = count;
      resp.data = data;
      //console.log("datann : ",data)
      if (args.pageNumber < 1 || args.pageNumber > pageInfo.totalPages) {
        throw new Error('Page Number is invalid');
      }
      if (args.pageNumber === pageInfo.totalPages) {
        pageInfo.nextPage = false;
      }
      if (args.pageNumber === 1) {
        pageInfo.prevPage = false;
      }
      resp.pageInfo = pageInfo;

      return resp;
    });
  },
};
/*******************************************************************************/

const TimeAnalysisPaginatedViewStudentsListType = new ObjectType({
  name: 'TimeAnalysisPaginatedViewStudentsListType',
  fields() {
    return {
      data: {
        type: new List(TimeAnalysisViewStudentsListType),
      },
      pageInfo: {
        type: pageInfoListType,
      },
    };
  },
});

// export const WeekDayEnumType = new EnumType({ // eslint-disable-line
//   name: 'WeekDayEnumType',
//   values: {
//     1: {},
//     2: {},
//     3: {},
//     4: {},
//     5: {},
//     6: {},
//     7: {},
//   },
// });
export const SortingOrderEnumType = new EnumType({ // eslint-disable-line
  name: 'SortingOrderEnumType',
  values: {
    ASC: {
      value: 1,
    },
    DESC: {
      value: -1,
    },
  },
});

export const SortByEnumTypev2 = new EnumType({ // eslint-disable-line
  name: 'SortByEnumTypev2',
  values: {
    studentName: {},
    studentId: {},
    day: {},
    totalTimeSpent: {},
    class:{},
    branch:{},
    orientation:{},
    section: {},
  },
});

export const TimeAnalysisStudentsListByDayv2 = {
  args: {
    class: { type: StringType, description: 'Class name' },
    branch: { type: StringType, description: 'Branch name' },
    orientation: { type: StringType, description: 'Orientation' },
    section: { type: StringType, description: 'Section' },
    startDate: { type: new NonNull(GraphQLDate), description: 'Start date' },
    endDate: { type: new NonNull(GraphQLDate), description: 'End date' },
    pageNumber: { type: IntType, description: 'Page number' },
    limit: { type: IntType, description: 'Number of docs per page' },
    sortBy: { type: SortByEnumTypev2, description: 'Sort By' },
    sortType: { type: SortingOrderEnumType, description: 'Sort Type' },
    sortValue: { type: IntType, description: 'Sort Value' },
  },
  type: TimeAnalysisPaginatedViewStudentsListType,
  async resolve(obj, args, context) {
    const validRoles = ['CMS_ENGAGEMENT_VIEWER'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    if (!args.pageNumber) args.pageNumber = 1; // eslint-disable-line
    if (!args.limit) args.limit = 0; // eslint-disable-line
    if (args.pageNumber < 1) throw new Error('Page Number is invalid');
    if (args.limit < 0) throw new Error('Invalid limit');
    return controller.getTimeAnalysisStudentsListByDayv2(args, context).then(([count, data]) => {
      const pageInfo = {};
      const resp = {};
      pageInfo.prevPage = true;
      pageInfo.nextPage = true;
      pageInfo.pageNumber = args.pageNumber;
      pageInfo.totalPages = args.limit && count ? Math.ceil(count / args.limit) : 1;
      pageInfo.totalEntries = count;
      resp.data = data;
      //console.log("datann : ",data)
      if (args.pageNumber < 1 || args.pageNumber > pageInfo.totalPages) {
        throw new Error('Page Number is invalid');
      }
      if (args.pageNumber === pageInfo.totalPages) {
        pageInfo.nextPage = false;
      }
      if (args.pageNumber === 1) {
        pageInfo.prevPage = false;
      }
      resp.pageInfo = pageInfo;

      return resp;
    });
  },
};

/*******************************************************************************/

export const TimeAnalysisStudentsListBySubjectSortByEnumTypev2 = new EnumType({ // eslint-disable-line
  name: 'TimeAnalysisStudentsListBySubjectSortByEnumTypev2',
  values: {
    studentName: {},
    studentId: {},
    subject: {},
    totalTimeSpent: {},
    class:{},
    branch:{},
    orientation:{},
    section: {},
  },
});



export const TimeAnalysisStudentsListBySubjects = {
  args: {
    class: { type: StringType, description: 'Class name' },
    branch: { type: StringType, description: 'Branch name' },
    orientation: { type: StringType, description: 'Orientation' },
    section: { type: StringType, description: 'Section' },
    startDate: { type: new NonNull(GraphQLDate), description: 'Start date' },
    endDate: { type: new NonNull(GraphQLDate), description: 'End date' },
    pageNumber: { type: IntType, description: 'Page number' },
    limit: { type: IntType, description: 'Number of docs per page' },
    sortBy: { type: TimeAnalysisStudentsListBySubjectSortByEnumTypev2, description: 'Sort By' },
    sortType: { type: SortingOrderEnumType, description: 'Sort Type' },
    sortValue: { type: StringType, description: 'Sort Value' },
  },
  type: TimeAnalysisPaginatedViewStudentsListType,
  async resolve(obj, args, context) {
    const validRoles = ['CMS_ENGAGEMENT_VIEWER'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    if (!args.pageNumber) args.pageNumber = 1; // eslint-disable-line
    if (!args.limit) args.limit = 0; // eslint-disable-line
    if (args.pageNumber < 1) throw new Error('Page Number is invalid');
    if (args.limit < 0) throw new Error('Invalid limit');
    return controller.getTimeAnalysisStudentsListBySubjects(args, context).then(([count, data]) => {
      const pageInfo = {};
      const resp = {};
      pageInfo.prevPage = true;
      pageInfo.nextPage = true;
      pageInfo.pageNumber = args.pageNumber;
      pageInfo.totalPages = args.limit && count ? Math.ceil(count / args.limit) : 1;
      pageInfo.totalEntries = count;
      resp.data = data;
      //console.log("datann : ",data)
      if (args.pageNumber < 1 || args.pageNumber > pageInfo.totalPages) {
        throw new Error('Page Number is invalid');
      }
      if (args.pageNumber === pageInfo.totalPages) {
        pageInfo.nextPage = false;
      }
      if (args.pageNumber === 1) {
        pageInfo.prevPage = false;
      }
      resp.pageInfo = pageInfo;

      return resp;
    });
  },
};

//************************************************************************** */


export const TimeAnalysisStudentsListByCategorySortByEnumTypev2 = new EnumType({ // eslint-disable-line
  name: 'TimeAnalysisStudentsListByCategorySortByEnumTypev2',
  values: {
    studentName: {},
    studentId: {},
    category: {},
    totalTimeSpent: {},
    class:{},
    branch:{},
    orientation:{},
    section: {},
  },
});



export const TimeAnalysisStudentsListByCategory = {
  args: {
    class: { type: StringType, description: 'Class name' },
    branch: { type: StringType, description: 'Branch name' },
    orientation: { type: StringType, description: 'Orientation' },
    section: { type: StringType, description: 'Section' },
    startDate: { type: new NonNull(GraphQLDate), description: 'Start date' },
    endDate: { type: new NonNull(GraphQLDate), description: 'End date' },
    pageNumber: { type: IntType, description: 'Page number' },
    limit: { type: IntType, description: 'Number of docs per page' },
    sortBy: { type: TimeAnalysisStudentsListByCategorySortByEnumTypev2, description: 'Sort By' },
    sortType: { type: SortingOrderEnumType, description: 'Sort Type' },
    sortValue: { type: StringType, description: 'Sort Value' },
  },
  type: TimeAnalysisPaginatedViewStudentsListType,
  async resolve(obj, args, context) {
    const validRoles = ['CMS_ENGAGEMENT_VIEWER'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    if (!args.pageNumber) args.pageNumber = 1; // eslint-disable-line
    if (!args.limit) args.limit = 0; // eslint-disable-line
    if (args.pageNumber < 1) throw new Error('Page Number is invalid');
    if (args.limit < 0) throw new Error('Invalid limit');
    return controller.getTimeAnalysisStudentsListByCategory(args, context).then(([count, data]) => {
      const pageInfo = {};
      const resp = {};
      pageInfo.prevPage = true;
      pageInfo.nextPage = true;
      pageInfo.pageNumber = args.pageNumber;
      pageInfo.totalPages = args.limit && count ? Math.ceil(count / args.limit) : 1;
      pageInfo.totalEntries = count;
      resp.data = data;
      //console.log("datann : ",data)
      if (args.pageNumber < 1 || args.pageNumber > pageInfo.totalPages) {
        throw new Error('Page Number is invalid');
      }
      if (args.pageNumber === pageInfo.totalPages) {
        pageInfo.nextPage = false;
      }
      if (args.pageNumber === 1) {
        pageInfo.prevPage = false;
      }
      resp.pageInfo = pageInfo;

      return resp;
    });
  },
};

//************************************************************************** */


export const TimeAnalysisStudentsListByDateSortByEnumTypev2 = new EnumType({ // eslint-disable-line
  name: 'TimeAnalysisStudentsListByDateSortByEnumTypev2',
  values: {
    studentName: {},
    studentId: {},
    date: {},
    totalTimeSpent: {},
    class:{},
    branch:{},
    orientation:{},
    section: {},
  },
});



export const TimeAnalysisStudentsListByDate = {
  args: {
    class: { type: StringType, description: 'Class name' },
    branch: { type: StringType, description: 'Branch name' },
    orientation: { type: StringType, description: 'Orientation' },
    section: { type: StringType, description: 'Section' },
    startDate: { type: new NonNull(GraphQLDate), description: 'Start date' },
    endDate: { type: new NonNull(GraphQLDate), description: 'End date' },
    pageNumber: { type: IntType, description: 'Page number' },
    limit: { type: IntType, description: 'Number of docs per page' },
    sortBy: { type: TimeAnalysisStudentsListByDateSortByEnumTypev2, description: 'Sort By' },
    sortType: { type: SortingOrderEnumType, description: 'Sort Type' },
    sortValue: { type: GraphQLDate, description: 'Sort Value' },
  },
  type: TimeAnalysisPaginatedViewStudentsListType,
  async resolve(obj, args, context) {
    const validRoles = ['CMS_ENGAGEMENT_VIEWER'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    if (!args.pageNumber) args.pageNumber = 1; // eslint-disable-line
    if (!args.limit) args.limit = 0; // eslint-disable-line
    if (args.pageNumber < 1) throw new Error('Page Number is invalid');
    if (args.limit < 0) throw new Error('Invalid limit');
    return controller.getTimeAnalysisStudentsListByDate(args, context).then(([count, data]) => {
      const pageInfo = {};
      const resp = {};
      pageInfo.prevPage = true;
      pageInfo.nextPage = true;
      pageInfo.pageNumber = args.pageNumber;
      pageInfo.totalPages = args.limit && count ? Math.ceil(count / args.limit) : 1;
      pageInfo.totalEntries = count;
      resp.data = data;
      //console.log("datann : ",data)
      if (args.pageNumber < 1 || args.pageNumber > pageInfo.totalPages) {
        throw new Error('Page Number is invalid');
      }
      if (args.pageNumber === pageInfo.totalPages) {
        pageInfo.nextPage = false;
      }
      if (args.pageNumber === 1) {
        pageInfo.prevPage = false;
      }
      resp.pageInfo = pageInfo;

      return resp;
    });
  },
};

// ******************************************************************** /

export const TimeAnalysisUniqueSubjectsByFilters = {
  args: {
    class: { type: StringType, description: 'Class name' },
    branch: { type: StringType, description: 'Branch name' },
    orientation: { type: StringType, description: 'Orientation' },
    section: { type: StringType, description: 'Section' },
    startDate: { type: GraphQLDate, description: 'Start date' },
    endDate: { type: GraphQLDate, description: 'End date' },
  },
  type: GraphQLJSON,
  async resolve(obj, args, context) {
    const validRoles = ['CMS_ENGAGEMENT_VIEWER'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    return controller.getTimeAnalysisUniqueSubjectsByFilters(args, context);
  },
};

//************************************************************************** */


export const TimeAnalysisStudentsListBySubjectDateWiseSortByEnumTypev2 = new EnumType({ // eslint-disable-line
  name: 'TimeAnalysisStudentsListBySubjectDateWiseSortByEnumTypev2',
  values: {
    studentName: {},
    studentId: {},
    date: {},
    totalTimeSpent: {},
    class:{},
    branch:{},
    orientation:{},
    section: {},
  },
});



export const TimeAnalysisStudentsListBySubjectDateWise = {
  args: {
    class: { type: StringType, description: 'Class name' },
    branch: { type: StringType, description: 'Branch name' },
    orientation: { type: StringType, description: 'Orientation' },
    section: { type: StringType, description: 'Section' },
    subject: { type: new NonNull(StringType), description: 'Subject' },
    startDate: { type: new NonNull(GraphQLDate), description: 'Start date' },
    endDate: { type: new NonNull(GraphQLDate), description: 'End date' },
    pageNumber: { type: IntType, description: 'Page number' },
    limit: { type: IntType, description: 'Number of docs per page' },
    sortBy: { type: TimeAnalysisStudentsListBySubjectDateWiseSortByEnumTypev2, description: 'Sort By' },
    sortType: { type: SortingOrderEnumType, description: 'Sort Type' },
    sortValue: { type: GraphQLDate, description: 'Sort Value' },
  },
  type: TimeAnalysisPaginatedViewStudentsListType,
  async resolve(obj, args, context) {
    const validRoles = ['CMS_ENGAGEMENT_VIEWER'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    if (!args.pageNumber) args.pageNumber = 1; // eslint-disable-line
    if (!args.limit) args.limit = 0; // eslint-disable-line
    if (args.pageNumber < 1) throw new Error('Page Number is invalid');
    if (args.limit < 0) throw new Error('Invalid limit');
    return controller.getTimeAnalysisStudentsListBySubjectDateWise(args, context).then(([count, data]) => {
      const pageInfo = {};
      const resp = {};
      pageInfo.prevPage = true;
      pageInfo.nextPage = true;
      pageInfo.pageNumber = args.pageNumber;
      pageInfo.totalPages = args.limit && count ? Math.ceil(count / args.limit) : 1;
      pageInfo.totalEntries = count;
      resp.data = data;
      if (args.pageNumber < 1 || args.pageNumber > pageInfo.totalPages) {
        throw new Error('Page Number is invalid');
      }
      if (args.pageNumber === pageInfo.totalPages) {
        pageInfo.nextPage = false;
      }
      if (args.pageNumber === 1) {
        pageInfo.prevPage = false;
      }
      resp.pageInfo = pageInfo;

      return resp;
    });
  },
};

export default {
  TimeAnalysis,
  TimeAnalysisHeaders,
  TimeAnalysisStudentsList,
  TimeAnalysisStudentsListByDay,
  TimeAnalysisHeadersv2,
  TimeAnalysisStudentsListByDayv2,
  TimeAnalysisStudentsListBySubjects,
  TimeAnalysisStudentsListByCategory,
  TimeAnalysisUniqueSubjectsByFilters,
  TimeAnalysisStudentsListBySubjectDateWise,
  TimeAnalysisStudentsListByDate,
};






