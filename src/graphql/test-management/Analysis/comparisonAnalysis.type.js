import {
  // GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  // GraphQLBoolean as BooleanType,
  // GraphQLInt as IntType,
  GraphQLList as List,
  // GraphQLFloat as FloatType,
  GraphQLEnumType as EnumType,
  GraphQLInputObjectType as InputObjectType,
} from 'graphql';
// import GraphQLJSON from 'graphql-type-json';

const FilterNameEnumType = new EnumType({ // eslint-disable-line
  name: 'ComparisonFilterNameEnumType',
  values: {
    avgPercentage: {
      value: 'avgPercentage',
    },
    marksDistribution: {
      value: 'marksDistribution',
    },
  },
});

export const ComparisonAnalysisHierarchyInputType = new InputObjectType({
  name: 'ComparisonAnalysisHierarchyInputType',
  description: 'Input type for hierarchies in comaprison analysis',
  fields: {
    child: { type: new NonNull(StringType), description: 'Name of the hierarchy node' },
    childCode: { type: new NonNull(StringType), description: 'Internal code of the hierarchy node' },
    level: { type: new NonNull(StringType), description: 'Level number of the hierarchy node' },
  },
});

export const ComparisonAnalysisInputType = new InputObjectType({
  name: 'ComparisonAnalysisInputType',
  description: 'Hierarchy wise student results comparison',
  fields: {
    testIds: { type: new List(new NonNull(StringType)), description: 'testIds' },
    hierarchies: { type: new List(ComparisonAnalysisHierarchyInputType), description: 'Input type for hierarchies in comaprison analysis' },
    filterName: { type: FilterNameEnumType, description: 'Different type of filters, which can be applied on comparison anlaysis' },
    viewLevel: { type: new NonNull(StringType), description: 'Level number of the hierarchy nodes to display daata' },
  },
});

export default {
  ComparisonAnalysisInputType,
};
