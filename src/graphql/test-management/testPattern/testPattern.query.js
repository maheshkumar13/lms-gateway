

import {
  GraphQLList as List,
  // GraphQLNonNull as NonNull,
  // GraphQLInt as IntType,
  GraphQLString as StringType,
  // GraphQLObjectType as ObjectType,
  // GraphQLBoolean as BooleanType,
  // GraphQLEnumType,
} from 'graphql';

// import GraphQLJSON from 'graphql-type-json';
import fetch from '../../../utils/fetch';
import { config } from '../../../config/environment';


import { TestPatternSchemaType, markingSchemaEnumType } from './testPattern.type';

export const TestPatternSchema = {
  args: {
    testName: { type: StringType },
    testType: { type: StringType },
    markingSchemaType: { type: markingSchemaEnumType },
  },
  type: new List(TestPatternSchemaType),
  async resolve(obj, args, context) {
    const url = `${config.services.test}/api/v1/testPattern/getTestPatterns`;
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

export default{
  TestPatternSchema,
};