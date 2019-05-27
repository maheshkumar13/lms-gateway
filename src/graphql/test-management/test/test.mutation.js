/**
   @author Aslam Shaik
   @date    14/03/2018
   @version 1.0.0
*/

import {
  // GraphQLList as List,
  GraphQLNonNull as NonNull,
  // GraphQLInt as IntType,
  GraphQLString as StringType,
  // GraphQLObjectType as ObjectType,
  // GraphQLBoolean as BooleanType,
  // GraphQLEnumType,
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';
import fetch from '../../../utils/fetch';
import { config } from '../../../config/environment';
import { TestType, InputTestType, UpdateTestType, QmapFileUploadType } from './test.type';

// const GraphQLDate = require('graphql-date');

export const removeTest = {
  args: {
    testId: { type: new NonNull(StringType) },
  },
  type: TestType,
  async resolve(obj, args, context) {
    const url = `${config.services.test}/api/v1/test/remove`;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(args),
	    headers: { 'Content-Type': 'application/json' },//eslint-disable-line
    }, context)
      .then((response) => {
        if (response.status >= 400) {
          return new Error(response.statusText);
        }
        return response.json();
      });
  },
};


export const createDummyTest = {
  args: {
    input: { type: GraphQLJSON },
  },
  type: TestType,
  async resolve(obj, args, context) {
    const url = `${config.services.test}/api/v1/test/create/dummy`;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(args.input),
	    headers: { 'Content-Type': 'application/json' },//eslint-disable-line
    }, context)
      .then((response) => {
        if (response.status >= 400) {
          return new Error(response.statusText);
        }
        return response.json();
      });
  },
};

export const createDuplicateTest = {
  args: {
    testId: { type: new NonNull(StringType) },
  },
  type: TestType,
  async resolve(obj, args, context) {
    const url = `${config.services.test}/api/v1/test/create/duplicate`;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(args),
      headers: { 'Content-Type': 'application/json' },//eslint-disable-line
    }, context)
      .then((response) => {
        if (response.status >= 400) {
          return new Error(response.statusText);
        }
        return response.json();
      });
  },
};

export const createTest = {
  // args: {
  //   testName: { type: new NonNull(StringType) },
  //   totalMarks: { type: new NonNull(IntType) },
  //   date: { type: new NonNull(GraphQLDate) },
  //   startTime: { type: new NonNull(StringType) },
  //   duration: { type: new NonNull(StringType) },
  //   testType: { type: new NonNull(GraphQLJSON) },
  //   hierarchy: { type: new NonNull(GraphQLJSON) },
  //   subjects: { type: new NonNull(GraphQLJSON) },
  // },
  args: {
    input: { type: new NonNull(InputTestType) },
  },
  type: TestType,
  async resolve(obj, args, context) {
    const url = `${config.services.test}/api/v1/test/create`;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(args.input),
      headers: { 'Content-Type': 'application/json' },//eslint-disable-line
    }, context)
      .then((response) => {
        if (response.status >= 400) {
          return new Error(response.statusText);
        }
        return response.json();
      });
  },
  description: 'Create test',
};

export const updateTest = {
  args: {
    input: { type: new NonNull(UpdateTestType) },
  },
  type: TestType,
  async resolve(obj, args, context) {
    const url = `${config.services.test}/api/v1/test/update`;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(args.input),
      headers: { 'Content-Type': 'application/json' },//eslint-disable-line
    }, context)
      .then((response) => {
        if (response.status >= 400) {
          return new Error(response.statusText);
        }
        return response.json();
      })
      .catch(err => new Error(err.message)); // eslint-disable-line
  },
  description: 'Defined fields get updated',
};

export const QmapFileUpload = {
  args: {
    testId: { type: new NonNull(StringType), description: 'testId, Unique identifier for test' },
    url: { type: new NonNull(StringType), description: 'URL of file uploaded to GCS' },
  },
  type: QmapFileUploadType,
  async resolve(obj, args, context) {
    const url = `${config.services.test}/api/v1/test/QmapFileUpload`;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(args),
      headers: { 'Content-Type': 'application/json' },//eslint-disable-line
    }, context)
      .then((response) => {
        // only throw error when access is forbidden else it gives the list of errors to show in UI
        if (response.status === 403) { return new Error(response.statusText); }
        return response.json();
      })
      .catch(err => new Error(err.message)); // eslint-disable-line
  },
  description: 'Old Qmap will get totally replaced',
};

export default{
  removeTest,
  createDummyTest,
  createDuplicateTest,
  createTest,
  updateTest,
  QmapFileUpload,
};