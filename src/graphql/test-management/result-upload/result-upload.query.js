import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
  GraphQLList as List,
  GraphQLInputObjectType as InputObjectType,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import fetch from '../../../utils/fetch';
// import GraphQLJSON from 'graphql-type-json';
import { config } from '../../../config/environment';
import { ResultType, SampleDownloadType, FilterInputType, OnlineStudentType } from './result-upload.type';

const ResultInputType = new InputObjectType({
  name: 'ResultInputType',
  description: 'result filters input type',
  fields: {
    testId: { type: new NonNull(StringType), description: 'unique id of the test' },
    childCode: { type: StringType, description: 'childCode of the leaf Node' },
  },
});


const ResultInputTypeV2 = new InputObjectType({
  name: 'ResultInputTypeV2',
  description: 'result filters input type',
  fields: {
    testId: { type: new NonNull(StringType), description: 'unique id of the test' },
  },
});

const SampleResultUploadType = new InputObjectType({
  name: 'SampleResultUploadType',
  description: 'Input arguments to download sample result',
  fields: {
    testId: { type: new NonNull(StringType), description: 'unique id of the test' },
  },
});

export const Results = {
  args: {
    input: { type: new NonNull(ResultInputType) },
  },
  type: ResultType,
  async resolve(obj, args, context) {
    const url = `${config.services.test}/api/v1/resultUpload/read/results`;
    const body = JSON.parse(JSON.stringify(args.input));
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },//eslint-disable-line
    }, context)
      .then((response) => {
        if (response.status === 403) {
          return new Error(response.statusText);
        }
        return response.json();
      })
      .then(json => json);
  },
};


export const ResultsV2 = {
  args: {
    input: { type: new NonNull(ResultInputTypeV2) },
  },
  type: GraphQLJSON,
  async resolve(obj, args, context) {
    const url = `${config.services.test}/api/v1/resultUpload/v2/read/results`;
    const body = JSON.parse(JSON.stringify(args.input));
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },//eslint-disable-line
    }, context)
      .then((response) => {
        if (response.status === 403) {
          return new Error(response.statusText);
        }
        return response.json();
      })
      .then(json => json);
  },
};

export const GetOnlineStudents = {
  args: {
    testId: { type: new NonNull(new List(StringType)) },
    filter: { type: FilterInputType },
    pageNumber: { type: IntType },
    limit: { type: IntType },
  },
  type: OnlineStudentType,
  async resolve(obj, args, context) {
    const url = `${config.services.test}/api/v1/resultUpload/getOnlineStudents`;
    const body = JSON.parse(JSON.stringify(args));
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },//eslint-disable-line
    }, context)
      .then((response) => {
        if (response.status >= 400) {
          return new Error(response.statusText);
        }
        return response.json()
          .then((json) => {
            const data = {};
            data.page = json.onlineStudents;
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
            if (pageInfo.totalEntries === 0) {
              pageInfo.totalPages = 0;
            }
            data.pageInfo = pageInfo;
            return data;
          });
      })
      .catch(err => new Error(err.message));
  },
};


export const ResultsSampleDownload = {
  args: {
    input: { type: new NonNull(SampleResultUploadType) },
  },
  type: SampleDownloadType,
  async resolve(obj, args, context) {
    const url = `${config.services.test}/api/v1/resultUpload`;
    const body = JSON.parse(JSON.stringify(args.input));
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },//eslint-disable-line
    }, context)
      .then((response) => {
        if (response.status === 403) {
          return new Error(response.statusText);
        }
        return response.json();
      })
      .then(json => json);
  },
};

export default { Results, ResultsSampleDownload, GetOnlineStudents };