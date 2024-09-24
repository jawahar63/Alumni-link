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
  alumniName: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  batch: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{4}-\d{4}$/.test(v); // Example: "2020-2024"
      },
      message: (props) => `${props.value} is not a valid batch format!`,
    },
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
        return v > this.fromDate;
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
  registerStudents: {
    type: [Schema.Types.ObjectId],
    ref: "User",
  },
  
},
{
        timestamps:true
});

eventSchema.index({ createdBy: 1, alumniName: 1 });

export default mongoose.model("Event", eventSchema);
