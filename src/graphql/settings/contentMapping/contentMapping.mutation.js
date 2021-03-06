/**
   @description GraphQl queries for Institute Hierarchy.

   @author Aakash Parsi
   @date   09/05/2019
   @version 1.0.0
*/

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { ContentMappingInsertionInputType,UpdateContentOutputType,UpdateContentInputType,UpdateMetaDataInputType, RemoveAudioMappingInputType } from './contentMapping.type';
import { validateAccess } from '../../../utils/validator';

const controller = require('../../../api/settings/contentMapping/contentMapping.controller');

export const InsertContent = {
  args: {
    input: { type: new NonNull(ContentMappingInsertionInputType) },
  },
  type: StringType,
  async resolve(obj, args, context) {
    return controller.insertContent(args.input, context);
  },
};

export const UpdateContent ={
  args:{
    input :{type : UpdateContentInputType} ,
  },
  type : GraphQLJSON,
  async resolve(obj,args,context){
    return controller.updateContent(args,context);
  }
}

export const updateMetaData = {
  args: {
    input: { type: new NonNull(UpdateMetaDataInputType)},
  },
  type: StringType,
  async resolve(obj, args, context) {
    return controller.updateAnimationMetaData(args.input, context);
  }
};

export const changeAssetStates = {
  args: {
    assetIds: { type: new NonNull(new List(StringType)), description: 'Unique Identifier for asset'},
    active: { type: new NonNull(BooleanType), description: 'Active state information' },
    reviewed: { type: new NonNull(BooleanType), description: 'Reviewed state information' },
  },
  type: StringType,
  async resolve(obj, args, context){
    const validRoles = ['CMS_CONTENT_MANAGER'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    return controller.changeAssetStates(args, context);
  }
}

export const removeAudioMapping = {
  args: {
    input: { type: new NonNull(new List(RemoveAudioMappingInputType))},
  },
  type: StringType,
  async resolve(obj, args, context){
    const validRoles = ['CMS_CONTENT_MANAGER'];
    if (!validateAccess(validRoles, context)) throw new Error('Access Denied');
    if(!args.input || !args.input.length) throw new Error('Invalid data');
    return controller.removeAudioMapping(args.input, context);
  }
}


export default { 
  InsertContent,
  UpdateContent,
  updateMetaData,
};
