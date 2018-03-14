/**
   @author  Bharath Vemula
   @date    XX/XX/XXXX
   @version 1.0.0
*/

import {
  // GraphQLList as List,
  GraphQLInt as IntType,
  GraphQLBoolean as BooleanType,
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import fetch from 'universal-fetch';
import { config } from '../../../config/environment';

// import InstituteHierarchyGridType from './instituteHierarchyGrid.type';

const pageInfoType = new ObjectType({
  name: 'InstituteHierarchypageInfoType',
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

const InstituteHierarchyGridType = new ObjectType({
  name: 'InstituteHierarchyGridType',
  fields() {
    return {
      data: {
        type: GraphQLJSON,
      },
      pageInfo: {
        type: pageInfoType,
      },
    };
  },
});


const InstituteHierarchyGrid = {
  args: {
    pageNumber: { type: NonNull(IntType) },
    limit: { type: NonNull(IntType) },
  },
  type: InstituteHierarchyGridType,
  async resolve(obj, args) {
    const url = `${config.services.settings}/api/instituteHierarchy/get/dataGrid`;

    let limit = 1000;
    if (args.limit) limit = args.limit; // eslint-disable-line

    const pagination = {
      pageNumber: args.pageNumber,
      limit,
    };

    return fetch(
      url,
      {
        method: 'POST',
        body: JSON.stringify({ pagination: JSON.stringify(pagination) }),
        headers: { 'Content-Type': 'application/json' },
      },
    )
      .then(async (response) => {
        if (response.status >= 400) {
          return new Error(response.statusText);
        }
        return response.json();
      })
      .then((json) => {
        if (json.data) {
          const pageInfo = {};
          const resp = {};
          pageInfo.prevPage = true;
          pageInfo.nextPage = true;
          pageInfo.pageNumber = args.pageNumber;
          pageInfo.totalPages = Math.ceil(json.count / args.limit)
            ? Math.ceil(json.count / args.limit)
            : 1;
          pageInfo.totalQuestions = json.count;
          resp.data = json.data;

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
        }
        return json;
      })
      .catch((err) => {
        console.error(err);
      });
  },
};

export default InstituteHierarchyGrid;
