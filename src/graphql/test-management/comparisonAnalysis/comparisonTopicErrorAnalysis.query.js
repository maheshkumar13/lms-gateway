import {
  // GraphQLObjectType as ObjectType,
  // GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  // GraphQLBoolean as BooleanType,
  // GraphQLInt as IntType,
  // GraphQLList as List,
  // GraphQLFloat as FloatType,
  // GraphQLInputObjectType as InputObjectType,
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';
import fetch from '../../../utils/fetch';
import { config } from '../../../config/environment';

import { ComparisonTopicErrorAnalysisInputType } from './comparisonTopicErrorAnalysis.type';

export const ComparisonTopicErrorAnalysis = {
  args: {
    input: {
      type: new NonNull(ComparisonTopicErrorAnalysisInputType),
      description: 'Inputs for comparison topic error analysis',
    },
  },
  type: GraphQLJSON,
  async resolve(obj, args, context) {
    const url = `${config.services.test}/api/v1/comparisonAnalysis/topicError`;
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

export default {
  ComparisonTopicErrorAnalysis,
};
