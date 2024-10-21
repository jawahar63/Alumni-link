import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  http=inject(HttpClient);
  token:string = localStorage.getItem('token')||'';
  header=new HttpHeaders({
    'authorization': `Bearer ${this.token}`
  });
  createPost(Post:any){
    console.log(this.token);
    const req =new HttpRequest('POST',`${apiUrls.PostService}/create-post`,Post,{
      reportProgress:true,
      headers: this.header,
    })
    return this.http.request(req);
  }
  updatePost(postId:string,post:any){
    return this.http.put<any>(`${apiUrls.PostService}/edit/${postId}`,post,{
      headers:this.header
    });
  }
  getPosts(page: number, limit: number) {
    return this.http.get<any>(`${apiUrls.PostService}/posts?page=${page}&limit=${limit}`,{
      headers:this.header
    });
}
  getComment(postId:string){
    return this.http.get<any>(`${apiUrls.PostService}/${postId}/comments`,{
      headers:this.header
    }
    );
  }
  getPostByAuthor(authorId: string, page: number, limit: number) {
    return this.http.get<any>(`${apiUrls.PostService}/posts/author/${authorId}?page=${page}&limit=${limit}`,{
      headers:this.header
    });
  }

  getPostById(postId:string){
    return this.http.get<any>(`${apiUrls.PostService}/posts/${postId}`,{
      headers:this.header
    });
  }

  deletePost(postId:string){
    return this.http.delete(`${apiUrls.PostService}/${postId}/delete`,{
      headers:this.header
    });
  }

  Addcomment(postId:string,comment:any){
    return this.http.post<any>(`${apiUrls.PostService}/${postId}/newcomment`,comment,{
      headers:this.header
    });
  }

  editComment(postId:string,commentId:string,comment:any){
    return this.http.put<any>(`${apiUrls.PostService}/${postId}/editcomment/${commentId}`,comment,{
      headers:this.header
    });
  }
  deleteComment(postId:string,commentId:string,comment:any){
    return this.http.put<any>(`${apiUrls.PostService}/${postId}/deletecomment/${commentId}`,comment,{
      headers:this.header
    });
  }
  AddLike(postId:string,user:any){
    return this.http.post<any>(`${apiUrls.PostService}/${postId}/newlike`,user,{
      headers:this.header
    });
  }
}
