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
interface user{
    _id:String;
    username:String;
}
export interface registerStudents{
    _id:String;
    username:String;
    email:String;
}
export interface Event{
    _id:String;
    createdBy:user;
    eventName:String;
    alumniId:user;
    typeofEvent:String;
    fromDate:Date;
    toDate:Date;
    mode:EventMode;
    venue?:String;
    status:Status;
    ShowStatus?:boolean;
    Shopdescription?:boolean;
    description?:String;
    registerStudents?:registerStudents[]

}