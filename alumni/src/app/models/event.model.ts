export enum EventMode {
  Offline = 'offline',
  Online = 'online'
}
export enum Status{
    Pending ='pending',
    Approved='approved',
    Rejected='rejected',
    Completed='completed'
}
export interface eventuser{
    _id:String;
    username:String;
}
export interface registerStudents{
    _id:String;
    username:String;
    email:String;
    rollno:String
}
export interface Event{
    _id:String;
    createdBy:eventuser;
    eventName:String;
    alumniId:eventuser;
    typeofEvent:String;
    fromDate:Date;
    toDate:Date;
    mode:EventMode;
    venue?:String;
    status:Status;
    ShowStatus?:boolean;
    Showdescription?:boolean;
    description?:String;
    registerStudents?:registerStudents[]
    showRegister?:boolean
    showRegisterStudent?:boolean;
    showRejectdescription?:boolean;
    editEvent?:boolean;
    showDelete?:boolean;
}