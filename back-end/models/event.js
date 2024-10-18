import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  eventName: {
    type: String,
    required: true,
  },
  alumniId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  typeofEvent: {
    type: String,
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v >= this.fromDate;
      },
      message: "toDate must be after fromDate",
    },
  },
  mode: {
    type: String,
    enum: ["online", "offline"],
    required: true,
  },
  venue: {
    type: String,
    required: function () {
      return this.mode === "offline";
    },
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending",
  },
  description:{
    type: String,
  },
  registerStudents: {
    type: [Schema.Types.ObjectId],
    ref: "User",
  },
  
},
{
        timestamps:true
});

eventSchema.index({ createdBy: 1, alumniName: 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;
