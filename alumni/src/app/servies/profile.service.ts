import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { profileDetails } from '../models/Alumniprofile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  id!:string;
  http=inject(HttpClient);
  details=new EventEmitter<profileDetails>();

  viewProfile(id:string){
    return this.http.get<any>(`${apiUrls.profileServie}${id}`);
  }
  editProfile(id:string,UpdateDetail:any){
    return this.http.put<any>(`${apiUrls.profileServie}edit/${id}`,UpdateDetail);
  }

  ChangeId(id:string){
    this.id=id;
  }
  passdetail(data:profileDetails){
    this.details.emit(data);
  }
}
