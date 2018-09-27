import {
  // GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
  GraphQLInt as IntType,
  GraphQLList as List,
  // GraphQLFloat as FloatType,
  // GraphQLEnumType as EnumType,
  GraphQLInputObjectType as InputObjectType,
} from 'graphql';
// import GraphQLJSON from 'graphql-type-json';

export const ComparisonRankAnalysisHierarchyInputType = new InputObjectType({
  name: 'ComparisonRankAnalysisHierarchyInputType',
  description: 'Input type for hierarchies in comaprison rank analysis',
  fields: {
    child: { type: new NonNull(StringType), description: 'Name of the hierarchy node' },
    childCode: { type: new NonNull(StringType), description: 'Internal code of the hierarchy node' },
    level: { type: new NonNull(IntType), description: 'Level number of the hierarchy node' },
  },
});

export const ComparisonRankAnalysisParentInputType = new InputObjectType({
  name: 'ComparisonRankAnalysisParentInputType',
  description: 'Input type for parent node',
  fields: {
    child: { type: new NonNull(StringType), description: 'Name of the hierarchy node' },
    childCode: { type: new NonNull(StringType), description: 'Internal code of the hierarchy node' },
    level: { type: new NonNull(IntType), description: 'Level number of the hierarchy node' },
  },
});

export const ComparisonRankAnalysisInputType = new InputObjectType({
  name: 'ComparisonRankAnalysisInputType',
  description: 'Hierarchy wise students rank analysis',
  fields: {
    testIds: { type: new List(new NonNull(StringType)), description: 'testIds' },
    hierarchies: { type: new List(ComparisonRankAnalysisHierarchyInputType), description: 'Input type for hierarchies in comaprison analysis' },
    viewLevel: { type: new NonNull(IntType), description: 'Level number of the hierarchy nodes to display data' },
    topLimit: { type: new NonNull(IntType), description: 'Number of top students' },
    parent: { type: ComparisonRankAnalysisParentInputType, description: 'Input type for parent node' },
    studentData: { type: BooleanType, description: 'true to get student data' },
  },
});

export default {
  ComparisonRankAnalysisInputType,
};
