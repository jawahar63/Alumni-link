import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  http=inject(HttpClient);
  createPost(Post:any){
    return this.http.post<any>(`${apiUrls.PostService}/create-post`,Post);
  }
}
