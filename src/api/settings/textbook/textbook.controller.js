import { getModel as TextbookModel } from './textbook.model';
import { getModel as InstituteHierarchyModel} from '../instituteHierarchy/instituteHierarchy.model'
import { getModel as SubjectModel } from '../subject/subject.model'
import { getModel as StudentModel } from '../student/student.model'
import { config } from '../../../config/environment';
import _ from 'lodash';

const xlsx = require('xlsx');
const csvjson = require('csvjson');


const crypto = require('crypto')

export async function getStudentData(context) {
  const { studentId } = context;
  return StudentModel(context).then((Student) => {
    if(!studentId) return false;
    const project = {
      _id: 0,
      subjects: 1,
      hierarchy: 1,
      orientation: 1,
      active: true,
    }
    return Student.findOne({ studentId }, project).cache(config.cacheTimeOut.student)
  })
}

function getTextbooksQuery(args){
  const query = { active: true }
  if (args.classCode) query['refs.class.code'] = args.classCode;
  if (args.subjectCode) query['refs.subject.code'] = args.subjectCode;
  if (args.orientation) {
    query['orientations'] = {$in: [null, "", args.orientation]}
  }
  if (args.branch) {
    query['branches'] = {$in: [null, "", args.branch]}
  }
  return query
}
export async function getTextbooks(args, context){
  return getStudentData(context).then((obj) => {
    if(obj && obj.orientation){
      args.orientation = obj.orientation
      const { hierarchy } = obj;
      if (hierarchy && hierarchy.length) {
        const branchData = hierarchy.find(x => x.level === 5);
        if(branchData && branchData.child) args.branch = branchData.child;
      }
    }
    const query = getTextbooksQuery(args)
    // console.log(query);
    return TextbookModel(context).then( (Textbook) => {
      return Textbook.find(query).cache(config.cacheTimeOut.textbook)
    })
  })
}

export async function getHierarchyData(context, hierarchyCodes){
  return InstituteHierarchyModel(context).then((InstituteHierarchy) => {
    const query = {
      active: true,
      childCode: {
        $in: hierarchyCodes
      }
    }
    const projection = {
      _id: 0,
      child: 1,
      childCode: 1,
      parentCode: 1,
      levelName: 1
    }
    return InstituteHierarchy.find(query, projection)
  })
}

export async function getSubjectData(context, args){
  const findQuery = {
    code: args.subjectCode,
    'refs.class.code': args.classCode,
    active: true
  }  
  return SubjectModel(context).then((Subject) => {
    return Subject.findOne(findQuery);
  })
}

export async function validateTextbook(args, context){

  const query = {
    active: true,
    name: args.name,
    'refs.class.code': args.classCode,
    'refs.subject.code': args.subjectCode,
  }
  return TextbookModel(context).then((Textbook) => {
    return Textbook.findOne(query).then((obj) => {
      if (obj) return true
      return false
    })
  })
}

function validateUrl(value) {
  return true;
  // return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

export async function createTextbook(args, context){
  args.name = args.name ? args.name.replace(/\s\s+/g, ' ').trim() : ''
  args.publisher = args.publisher ? args.publisher.replace(/\s\s+/g, ' ').trim() : ''
  if(args.orientations) {
    const items = []
    args.orientations.forEach(element => {
      if(element) items.push(element)
    });
    if(items.length) args.orientations = items;
    else args.orientations = null;
  }
  if (
    !args.name ||
    !args.classCode ||
    !args.subjectCode
  ) {
    throw new Error('Insufficient data');
  }
  return validateTextbook(args, context).then((isTextbookExist) => {
    if(isTextbookExist) throw new Error('Textbook already exists')
    return Promise.all([
      getHierarchyData(context, [args.classCode]),
      getSubjectData(context, args),
      TextbookModel(context)
    ]).then(([
      hierarchyData,
      subjectData,
      Textbook
    ]) => {
      const classData = hierarchyData.find( x => x.levelName === 'Class' && x.childCode === args.classCode)
      if(
        !classData ||
        !subjectData
      ) {
        throw new Error('Invalid input codes ')
      }
      const obj = {
        name: args.name,
        code: `${Date.now()}${crypto.randomBytes(5).toString('hex')}`,
        imageUrl: args.imageUrl,
        publisher: args.publisher,
        orientations: args.orientations,
        refs: {
          class: {
            name: classData.child,
            code: classData.childCode,
          },
          subject: {
            name: subjectData.subject,
            code: subjectData.code,
          }
        }
      }
      return Textbook.create(obj)
    })
  })
  
}

export async function validateTextbookForUpdate(args, context){
  let query = {
    active: true,
    code: args.code,
  }
  return TextbookModel(context).then((Textbook) => {
    return Textbook.findOne(query).then((obj) => {
      if (!obj) throw new Error('Textbook not found with given code')
      if (args.name){
        query = {
          active: true,
          name: args.name,
          code: { $ne: args.code },
          'refs.class.code': obj.refs.class.code,
          'refs.subject.code': obj.refs.subject.code
        }
        return Textbook.findOne(query).then((doc) => {
          if(doc) throw new Error('Textbook name already exists')
          return Textbook;
        })
      }
      return Textbook;
    })
  })
}


export async function updateTextbook(args, context){
  args.name = args.name ? args.name.replace(/\s\s+/g, ' ').trim() : ''
  args.publisher = args.publisher ? args.publisher.replace(/\s\s+/g, ' ').trim() : ''
  if (
      !args.code ||
     (!args.name && !args.imageUrl && !args.publisher && !args.orientations)
     ){
    throw new Error('Insufficient data')
  }
  if (args.imageUrl && !validateUrl(args.imageUrl)){
    throw new Error('Invalid image url')
  }

  if(args.orientations) {
    const items = []
    args.orientations.forEach(element => {
      if(element) items.push(element)
    });
    if(items.length) args.orientations = items;
    else args.orientations = null;
  }
  
  return validateTextbookForUpdate(args, context).then((Textbook) => { 
    const matchQuery ={
      active: true,
      code: args.code,
    }
    const patch = {}
    if(args.name) patch.name = args.name
    if(args.imageUrl) patch.imageUrl = args.imageUrl
    if(args.publisher) patch.publisher = args.publisher
    if(args.orientations) patch.orientations = args.orientations;
    return Textbook.updateOne(matchQuery, patch).then(() => {
      return Textbook.findOne(matchQuery)
    })
  })
}

export async function deleteTextbook(args, context) {
  if (!args.code) throw new Error('Code is requried')
  return TextbookModel(context).then((Textbook) => {
    const query = { active: true, code: args.code }
    const patch = { active: false}
    return Textbook.findOneAndUpdate(query,patch).then((doc) => {
      if(!doc) throw new Error('Textbook not found with given code')
      return doc
    })
  })
}

export async function codeAndTextbooks(context){
  return TextbookModel(context).then((Textbook) => {
    const query = {active : true};

    const aggregateQuery = [{
      $match : {'active' : true}} ,  
      {"$group" : {"_id" : {"code" : "$code"  , "data" :  {"subject" : "$refs.subject.name" , "class" : "$refs.class.name", "name" : "$name" , "branches" : "$branches" , "orientations" : "$orientations"}} }} ,
      {"$group" :{"_id" : null , "data" : {"$push" : {"k" : "$_id.code" , "v" : "$_id.data"}} } } , { "$replaceRoot": {"newRoot": { "$arrayToObject": "$data" }}} , 
    ]

  return Textbook.aggregate(aggregateQuery).cache(config.cacheTimeOut.textbook).then((docs) => {
    if(!docs || docs.length < 1){
      return {};
    }
    return docs
  })
  
  })
}

export async function returnAllBranches(context)
{
  return InstituteHierarchyModel(context).then((InstituteHierarchy) => {
    return InstituteHierarchy.distinct("child", {levelName: "Branch"}).then(branchesArray => {
      return branchesArray;
    })
  })  

}

export async function returnAllTextbooks(context)
{
  return TextbookModel(context).then((Textbook) => {
    return Textbook.distinct("name",{}).then(obj => {
      return obj
    })
  })  

}


export async function uploadTextbook(req)
{

  // console.log("req:",req.file)
  //initial error handling.
  if(!req || !req.file)
  {
    throw new Error("file not received.Please upload file.")
  }
  if(!req || !req.body || !req.body.class)
  {
    throw new Error("classObj is missing.")
  }
  if(!req  || !req.body || !req.body.subject)
  {
    throw new Error("subjectObj is missing.")
  }
  const workbook = xlsx.read(req.file.buffer, { type: 'buffer', cellDates: true });

  let  data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  const textbooksNames = []
  const tbclassdata = JSON.parse(req.body.class)
  const tbsubdata = JSON.parse(req.body.subject)
  let textbooksInSheet = []

//removing duplicates from sheets
for (let x=0;x<data.length;x+=1)
{
  textbooksNames.push(data[x]["Book Title"])

}

let textbooksNames_unique = _.uniq(textbooksNames);

if(textbooksNames_unique.length != textbooksNames.length)
{
  throw new Error("duplicates exist in the uploaded sheet.")
}

//forming object to insert data.

let textbookList =[]
for (var x=0;x<data.length;x+=1)
{
    let tempObj = data[x]
    const prepObj = {
      name: tempObj && tempObj["Book Title"] ? tempObj["Book Title"] : null ,
      orientations : tempObj && tempObj.Orientations ? tempObj.Orientations.split(",") :null,
      branches : tempObj && tempObj.Branches ? tempObj.Branches.split(",") : null,
      publisher : tempObj && tempObj.Publisher ? tempObj.Publisher : null,
      year : tempObj && tempObj["Publish Year"] ? tempObj["Publish Year"] :null,
      active: true,
      refs : {"class" : {"name" : tbclassdata.name , "code" : tbclassdata.code } , "subject" : {"name" : tbsubdata.name , "code" : tbsubdata.code}},
      code: `${Date.now()}${crypto.randomBytes(5).toString('hex')}`
    };
    if (!prepObj.orientations || !prepObj.branches)
    {
      throw new Error("orientations and branches are mandatory fields.")
    }
    textbookList.push(prepObj)
    textbooksInSheet.push(prepObj.name  )
}
  // console.log("-------------",textbookList)
  //ensuring branches are in db.
  let branchesInSheet = [];
  let allBranchesInDb = await returnAllBranches(req.user_cxt)
  for (var y = 0 ; y < textbookList.length ; y+=1) {
    const tempBranch = textbookList[y].branches;
    console.log(tempBranch)
    branchesInSheet = branchesInSheet.concat(tempBranch);
  }
  branchesInSheet = _.uniq(branchesInSheet);
  console.log("----------------------------------------------")

  let branchDifference = _.difference(branchesInSheet,allBranchesInDb)
  console.log(branchDifference)
  let errorBranches = []
  if(branchDifference.length>0)
  {
    for(var y=0; y < branchDifference.length ; y++ )
    { 
        errorBranches.push(branchDifference[y])
    }
    throw new Error(`${errorBranches} branches do not exist in the db.`)
  } 
  //ensuring textbooks already in db are not inserted again.
  let allTextbooksInDb = await returnAllTextbooks(req.user_cxt)

  let textbookDifference = _.difference(textbooksInSheet,allTextbooksInDb)
  console.log("difference:",textbookDifference);

  let textbookObjs_final = []
  
  for (var y = 0 ; y < textbookList.length ; y+=1)
  {
    // console.log(textbookList[y])
    if(textbookDifference.map(x=>x==textbookList[y].name))
    {
      textbookObjs_final.push(textbookList[y])
    }
  }
  console.log("check this:",textbookObjs_final);

  // return TextbookModel(req.user_cxt).then((Textbook) => {
  //   return Textbook.insertMany(textbookObjs_final).then((obj) => {
  //     return obj;
  //   })
  // })
  return getModel(context).then((InstituteHierarchy) => {
    const bulk = InstituteHierarchy.collection.initializeUnorderedBulkOp();


bulk.find(findQuery).update( { $set: { category: obj.category } }, {multi: true});


  })

}

export default{
  getHierarchyData
}
