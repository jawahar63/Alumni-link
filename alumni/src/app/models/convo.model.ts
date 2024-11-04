// createdAt
// : 
// "2024-10-23T13:37:51.398Z"
// lastMessage
// : 
// "hi"
// lastMessageAt
// : 
// "2024-10-25T16:29:29.914Z"
// participant
// : 
// batch
// : 
// "2022-2024"
// company
// : 
// "Zoho"
// domain
// : 
// "Data Science"
// email
// : 
// "sanjay.ad22@bitsathy.ac.in"
// profileImage
// : 
// "http://localhost:4000/uploads/dp/663c94cd491c87c0342dec57.jpg"
// username
// : 
// "sanjay"
// _id
// : 
// "663c94cd491c87c0342dec57"
// [[Prototype]]
// : 
// Object
// unreadMessageCount
// : 
// 1
// _id
// : 
// "6718fc2fef24b68e2d3e9049"

interface Participant {
    _id: string;
    username: string;
    email: string;
    profileImage: string;
    batch?: string;
    company?: string;
    domain?: string;
}

export interface Convo {
    _id: string;
    createdAt: Date;
    lastMessage: string;
    lastMessageAt: Date;
    participant: Participant;
    unreadMessageCount: number;
}

export interface Message{
    _id:String
    content:String;
    conversationId:String;
    isRead:boolean;
    isReceive:boolean;
    sender:Participant;
    sentAt:Date;
    sended:boolean;
}

// content
// : 
// "hi"
// conversationId
// : 
// "6718fc2fef24b68e2d3e9049"
// isRead
// : 
// false
// sender
// : 
// email
// : 
// "ragulram.ad22@bitsathy.ac.in"
// profileImage
// : 
// "http://localhost:4000/uploads/dp/663c94cd491c87c0342dec57.jpg"
// username
// : 
// "ragulram"
// _id
// : 
// "66351ed49384500ade1c2f76"
// [[Prototype]]
// : 
// Object
// sentAt
// : 
// "2024-10-24T14:52:00.205Z"
// __v
// : 
// 0
// _id
// : 
// "671a5f1020b531c548b089c4"