import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../servies/post.service';
import { Post } from '../../models/post.model';
import { PostTempComponent } from '../post-temp/post-temp.component';
import { AuthService } from '../../servies/auth.service';
import { ToasterService } from '../../servies/toaster.service';

@Component({
  selector: 'app-single-post',
  standalone: true,
  imports: [PostTempComponent],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css'
})
export class SinglePostComponent implements OnInit {
  postId:string='';
  post:Post[]=[];
  user!:string;
  isLoggedIn:boolean=false;
  authService=inject(AuthService);
  route=inject(ActivatedRoute);
  postService =inject(PostService);
  router=inject(Router);
  toasterService=inject(ToasterService);
  isMentor: boolean=false;


  ngOnInit(): void {
    // this.isLoggedIn=this.authService.isLoggedIn();
    //     if(!this.isLoggedIn){
    //         this.router.navigate(['login']);
    // }
    this.authService.AuthData.subscribe((data)=>{
      this.user=data.get('user_id');
      this.isMentor=data.get('role')==='mentor';
    })
    this.postId=this.route.snapshot.paramMap.get('id')||'';
    this.postService.getPostById(this.postId).subscribe({
      next:(value)=> {
        this.post.push(value.data);
        this.post.forEach(post => {
          if (post.likes) {
            post.isLiked = post.likes.some(like => like.liker._id===this.user);
          } else {
            console.log('No likes available for post:', post);
          }
        });

        this.post.forEach(post => {
          if (post.comments) {
            post.comments.forEach(comment => {
              comment.isCommentEditable = comment.commenter._id === this.user;
              comment.isCommentDeleteable = comment.commenter._id === this.user;
              if(post.author._id===this.user){
                comment.isCommentDeleteable = true; 
              }
              if(this.isMentor){
              comment.isCommentDeleteable = true;
            }
            });
          } else {
            console.log('No comments available for post:', post);
          }
        });
        console.log("successfully");
      },
      error:(err)=> {
        this.toasterService.addToast('error','error!',err.message,5000);
        this.router.navigate(['home']);
      },
    })
  }

}
