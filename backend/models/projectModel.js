import mongoose from 'mongoose';
import Event from './nestedModels/eventModel';
import Detail from './nestedModels/detailModel';
import Category from './nestedModels/categoryModel';

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    categories: {
      type: [Category],
    },
    details: {
      type: [Detail],
    },
    events: {
      type: [Event],
    },
    estimate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
