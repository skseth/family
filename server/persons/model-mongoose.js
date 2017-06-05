'use strict';

const personSchemaDefn = {
    name: { type: String, required: true },
    email: { type: String, required: false },    
    created_at: Date,
    updated_at: Date
}

function personprefn(next) {
  var currentDate = new Date();

  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();  
}

class PersonModel {
  constructor(db) {
    this._mongoose = db.Mongoose
    this.Person = this._initPersonSchema()
  }

  _initPersonSchema() {
    const schema = new this._mongoose.Schema( personSchemaDefn, { bufferCommands: false })
    schema.pre('save', personprefn)
    return this._mongoose.model('Person', schema)
  }

  create(data) {
    return this.Person(data).save()
  }

  list() {
    return this.Person.find({}).exec()
  }

  remove(personid) {
    return this.Person.findByIdAndRemove(personid)
  }

  getById(personid) {
    return this.Person.findById(personid)
  }
}

module.exports.PersonModel = PersonModel

