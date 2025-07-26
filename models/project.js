//import mongoose
const { Schema, model } = require('mongoose');
const { trim } = require('validator');

//create schema (strucr)
const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim : true
    },
    state: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "default.jpg"
    },
    create_at: {
        type: Date,
        default: Date.now()
    }

})

//create model
//exportar miodel


module.exports = model('Project', ProjectSchema, 'projects');  