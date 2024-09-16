import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Post,Comment } from '../../models/post.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../servies/post.service';
import { formatDistanceToNow } from 'date-fns';
import { Router } from '@angular/router';
import { ShareButtonsComponent } from '../share-buttons/share-buttons.component';
import { AuthService } from '../../servies/auth.service';
import { ToasterService } from '../../servies/toaster.service';


@Component({
  selector: 'app-post-temp',
  standalone: true,
  imports: [FormsModule,CommonModule,ShareButtonsComponent],
  templateUrl: './post-temp.component.html',
  styleUrl: './post-temp.component.css'
})
export class PostTempComponent implements OnInit,OnChanges {
  @Input() posts: Post[] = [];
  @Input() width:string=''; // An array of posts to be passed to this component

  postService = inject(PostService);
  router=inject(Router);
  newComment: string = '';
  modalImage: any = null;
  user:string='';
  authService=inject(AuthService);
  toasterService=inject(ToasterService);

  ngOnInit(): void {
    this.authService.AuthData.subscribe((data)=>{
      this.user=data.get('user_id');
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['posts'] && this.posts.length > 0) {
      this.updateLikedStatus();
      this.updateCommentEditStatus();
    }
  }

  navigate() {
    
  }
  updateCommentEditStatus() {
    if (!this.posts || !this.posts.length) {
      console.log('Posts array is empty or not defined');
      return;
    }

      this.posts.forEach(post => {
        if (post.comments) {
          post.comments.forEach(comment => {
            comment.isCommentEditable = comment.commenter._id === this.user;
            comment.isCommentDeleteable = comment.commenter._id === this.user;
            if(post.author._id===this.user){
              comment.isCommentDeleteable = true; 
            }
          });
        } else {
          console.log('No comments available for post:', post);
        }
      });
  }


  updateLikedStatus() {
    if (!this.posts || !this.posts.length) {
      console.log('Posts array is empty or not defined');
      return;
    }
    this.posts.forEach(post => {
      if (post.likes) {
        post.isLiked = post.likes.some(like => like.liker._id===this.user);
      } else {
        console.log('No likes available for post:', post);
      }
    });
  }

  goToProfile(post:Post){
    const aid =post.author._id;
    this.router.navigate(['profile/'+aid]);
  }

  openModal(media: any) {
    this.modalImage = media;
  }

  closeModal() {
    this.modalImage = null;
  }

  removeMedia(post: Post, media: any) {
    const index = post.media.indexOf(media);
    if (index > -1) {
      post.media.splice(index, 1);
    }
  }

  likePost(post: Post) {
    const userdata={
      userid:this.user
    }
    this.postService.AddLike(post._id,userdata).subscribe({
      next:(value)=> {
          console.log(value.message);
          post.isLiked=!post.isLiked;
        },
        error:(err)=> {
          console.log(err);
        },
    })
  }

  toggleComments(post: Post) {
    post.showComments = !post.showComments;
    post.showLikes=false;
  }
  togglelikes(post: Post) {
    post.showLikes = !post.showLikes;
    post.showComments = false;
  }

  addComment(post: Post) {
    if (this.newComment.trim()) {
      const comment={
        userid:this.user,
        text: this.newComment
      }
      this.postService.Addcomment(post._id,comment).subscribe({
        next:(value)=> {
          this.toasterService.addToast('success','Success!',value.message,5000);
        },
        error:(err)=> {
          this.toasterService.addToast('error','error!','Internal server Error',5000);
        },
      });
      this.newComment = '';
    }
  }
  toggleCommentMenu(post:Post, comment:Comment) {
  if (!comment.showMenu) {
    // Hide menu for other comments
    post.comments.forEach(c => c.showMenu = false);
  }
  comment.showMenu = !comment.showMenu;
}


  editComment(comment:Comment) {
    comment.isEditing = true;
    comment.editedText = comment.text;
  }

  cancelEdit(comment:Comment) {
    comment.isEditing = false;
    comment.editedText = '';
  }

  saveComment(post:Post, comment:Comment) {
    // Perform validation
    if (!comment.editedText.trim()) {
      this.toasterService.addToast("error","Error!",'Comment cannot be empty.',5000)
      return;
    }
    const tempcomment={
      userid:comment.commenter._id,
      newText:comment.editedText
    }
    this.postService.editComment(post._id,comment._id,tempcomment).subscribe({
      next:(value) =>{
        this.toasterService.addToast('success','Success!',value.message,5000);
        comment.isEditing = false;
        comment.editedText = '';
      },
      error:(err)=> {
        this.toasterService.addToast('error','error!','Internal server Error',5000);
      },
    })

  }
  confirmDeleteComment(post:Post,comment:Comment){
    const confirmed = confirm("Are you sure you want to delete this comment?");
    if (confirmed) {
      this.deleteComment(post,comment);
    }
  }

  deleteComment(post:Post,comment:Comment){
    const user ={
      userid:comment.commenter._id
    }
    this.postService.deleteComment(post._id,comment._id,user).subscribe({
      next:(value)=> {
        this.toasterService.addToast('success','Success!',value.message,5000);
      },
      error:(err)=> {
        this.toasterService.addToast('error','error!','Internal server Error',5000);
      },

    })
    
  }
  sharePost(post: Post) {
    post.showShare=!post.showShare;
    
  }
  getTimeAgo(date?: Date): string {
    if (!date) {
      return 'Unknown'; // Handle cases where date is undefined
    }
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }
  toggleMenu(post: any) {
    post.showMenu = !post.showMenu;
  }

  // Update the post
  updatePost(post: any) {
    this.router.navigate(['editposts/'+post._id]);
  }

  confirmDelete(post: any) {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (confirmed) {
      this.deletePost(post);
    }
  }
  deletePost(post: any) {
    this.postService.deletePost(post._id).subscribe({
      next:(value)=> {
          this.toasterService.addToast('success','Success!',"Delete successfully",5000);
          
        },
        error:(err)=> {
          this.toasterService.addToast('error','error!','Internal server Error',5000);
        },
    })
  }

  viewPost(post:Post):void{
    this.router.navigate(['posts/'+post._id]);
  }

}
