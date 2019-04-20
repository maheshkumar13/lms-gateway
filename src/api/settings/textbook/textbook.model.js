/**
 *@description
 *    This File contains the Mongoose Schema defined for subjectTaxonomy
 * @Author :
 *   Aslam Shaik
 * @date
 *    27/12/2018
 */
import mongoose from 'mongoose';
import { getDB } from '../../../db';

const nameCodeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, index: true }
})

const refsSchema = new mongoose.Schema({
  board: { type: nameCodeSchema, required: true },
  class: { type: nameCodeSchema, required: true },
  subject: { type: nameCodeSchema, required: true },
})

const TextbookSchema = new mongoose.Schema({
  name: { type: String, required: true, description: 'Name of the textbook' },
  imageUrl: { type: String, description: 'Image url of the textbook' },
  code: { type: String, required: true, index: true, description: 'Internal code for the textbook' },
  refs: { type: refsSchema, description: 'References'},
  active: { type: Boolean, default: true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export async function getModel(userCxt) {
  const { instituteId } = userCxt;
  const db = await getDB(instituteId);
  return db.model('Textbook', TextbookSchema);
}

export default {
  getModel,
};