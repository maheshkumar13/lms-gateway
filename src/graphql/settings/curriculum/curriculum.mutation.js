/**
   @author Rahul Islam
   @date    XX/XX/XXXX
   @version 1.0.0
*/

import {
  GraphQLList as List,
  GraphQLString as StringType,
  // GraphQLBoolean as BooleanType,
  // GraphQLNonNull as NonNull,
} from 'graphql';
// import GraphQLJSON from 'graphql-type-json';
import fetch from '../../../utils/fetch';
import { config } from '../../../config/environment';
import { SubjectTaxonomyType } from '../subject/subjectTaxonomy.type';

export const createCurriculum = {
  args: {
    curriculumList: { type: new List(StringType) },
  },
  type: new List(SubjectTaxonomyType),
  async resolve(obj, args, context) {
    args.curriculumList = JSON.stringify(args.curriculumList);//eslint-disable-line
    const url = `${config.services.settings}/api/subjectTaxonomy/create/curriculum`;
    return fetch(url, { method: 'POST', body: JSON.stringify(args), headers: { 'Content-Type': 'application/json' } }, context)
      .then((response) => {
        if (response.status >= 400) {
          return new Error(response.statusText);
        }
        return response.json();
      })
      .catch((err) => {
        console.error(err);
      });
  },
};


export default {
  createCurriculum,
};
