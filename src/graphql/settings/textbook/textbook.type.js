/**
@author Rahul Islam
@date    XX/XX/XXXX
@version 1.0.0
*/

import {
  GraphQLList as List,
  GraphQLObjectType as ObjectType,
  GraphQLInputObjectType as InputType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
} from 'graphql';

export const nameCodeType = new ObjectType({
  name: 'TextbookNameCodeType',
  fields: {
    name: { type: StringType, description: 'Name' },
    code: { type: StringType, description: 'Interal code' },
  },
});

export const refsType = new ObjectType({
  name: 'TextbookRefsType',
  fields: {
    board: { type: nameCodeType, description: 'Board' },
    class: { type: nameCodeType, description: 'Class' },
    subject: { type: nameCodeType, description: 'Subject' }
  },
});



export const TextbookType = new ObjectType({
  name: 'TextbookType',
  fields: {
    name: { type: StringType, description: 'Name of the textbook' },
    code: { type: StringType, description: 'Interal code of the subject' },
    imageUrl: { type: StringType, description: 'image url' },
    refs: { type: refsType, description: 'refs' },
  },
});

export const TextbookInputType = new InputType({
  name: 'TextbookInputType',
  fields: {
    name: { type: new NonNull(StringType), description: 'Name of the textbook' },
    boardCode: { type: new NonNull(StringType), description: 'childCode of board' },
    classCode: { type: new NonNull(StringType), description: 'childCode of class' },
    subjectCode: { type: new NonNull(StringType), description: 'Internal code of subject' },
    imageUrl: { type: StringType, description: 'image url' },
  }
})

export const updateTextbookInputType = new InputType({
  name: 'updateTextbookInputType',
  fields: {
    name: { type: StringType, description: 'Name of the textbook' },
    imageUrl: { type: StringType, description: 'image url' },
    code: { type: new NonNull(StringType), description: 'Internal code of textbook' },
  }
})


export default {
  TextbookType,
  TextbookInputType,
  updateTextbookInputType,
};