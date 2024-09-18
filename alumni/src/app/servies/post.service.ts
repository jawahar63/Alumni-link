import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  http=inject(HttpClient);
  createPost(Post:any){
    return this.http.post<any>(`${apiUrls.PostService}/create-post`,Post);
  }
  updatePost(postId:string,post:any){
    return this.http.put<any>(`${apiUrls.PostService}/edit/${postId}`,post);
  }
  getPosts(page: number, limit: number) {
    return this.http.get<any>(`${apiUrls.PostService}/posts?page=${page}&limit=${limit}`);
}
  getComment(postId:string){
    return this.http.get<any>(`${apiUrls.PostService}/${postId}/comments`);
  }
  getPostByAuthor(authorId: string, page: number, limit: number) {
    return this.http.get<any>(`${apiUrls.PostService}/posts/author/${authorId}?page=${page}&limit=${limit}`);
  }

  getPostById(postId:string){
    return this.http.get<any>(`${apiUrls.PostService}/posts/${postId}`);
  }

  deletePost(postId:string){
    return this.http.delete(`${apiUrls.PostService}/${postId}/delete`);
  }

  Addcomment(postId:string,comment:any){
    return this.http.post<any>(`${apiUrls.PostService}/${postId}/newcomment`,comment);
  }

  editComment(postId:string,commentId:string,comment:any){
    return this.http.put<any>(`${apiUrls.PostService}/${postId}/editcomment/${commentId}`,comment);
  }
  deleteComment(postId:string,commentId:string,comment:any){
    return this.http.put<any>(`${apiUrls.PostService}/${postId}/deletecomment/${commentId}`,comment);
  }
  AddLike(postId:string,user:any){
    return this.http.post<any>(`${apiUrls.PostService}/${postId}/newlike`,user);
  }
}
