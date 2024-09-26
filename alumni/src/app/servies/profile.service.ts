import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { profileDetails } from '../models/Alumniprofile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  id!:string;
  http=inject(HttpClient);
  token:string = localStorage.getItem('token')||'';
  header=new HttpHeaders({
    'authorization': `Bearer ${this.token}`
  });
  details=new EventEmitter<profileDetails>();

  viewProfile(id:string){
    return this.http.get<any>(`${apiUrls.profileServie}${id}`,{
      headers:this.header
    });
  }
  editProfile(id:string,UpdateDetail:any){
    return this.http.put<any>(`${apiUrls.profileServie}edit/${id}`,UpdateDetail,{
      headers:this.header
    });
  }

  ChangeId(id:string){
    this.id=id;
  }
  passdetail(data:profileDetails){
    this.details.emit(data);
  }
  uploadImage(id: string, formData: FormData) {
  return this.http.post<{ imageUrl: string }>(`${apiUrls.profileServie}edit/${id}/upload-image`, formData,{
      headers:this.header
    });
}
}
