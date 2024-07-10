import { SafeUrl } from "@angular/platform-browser";

export interface profileDetails {
    createdAt: string;
    email: string;
    firstName: string;
    isAdmin: boolean;
    lastName: string;
    password: string;
    profileImage: SafeUrl;
    roles: string[];
    domain:string;
    batch:string;
    company:string;
    Phone_no:number;
    age:number;
    experiences:number;
    location:number;
    linkedin:string;
    github:string;
    skill: any[];
    updatedAt: string;
    username: string;
    __v: number;
    _id: string;
}
