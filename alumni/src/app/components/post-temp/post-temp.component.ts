import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Post,Comment } from '../../models/post.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../servies/post.service';
import { formatDistanceToNow } from 'date-fns';
import { Router } from '@angular/router';
import { ShareButtonsComponent } from '../share-buttons/share-buttons.component';

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

  ngOnInit(): void {
    this.user=sessionStorage.getItem('user_id')||'';
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
    const user={
      userid:sessionStorage.getItem("user_id")||''
    }
    this.postService.AddLike(post._id,user).subscribe({
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
        userid:sessionStorage.getItem("user_id")||'',
        text: this.newComment
      }
      this.postService.Addcomment(post._id,comment).subscribe({
        next:(value)=> {
          alert(value.message);
        },
        error:(err)=> {
          console.log(err);
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
      alert('Comment cannot be empty.');
      return;
    }
    const tempcomment={
      userid:comment.commenter._id,
      newText:comment.editedText
    }
    this.postService.editComment(post._id,comment._id,tempcomment).subscribe({
      next:(value) =>{
        alert("successfully");
        comment.isEditing = false;
        comment.editedText = '';
      },
      error:(err)=> {
        alert("Something when Wrong, try sometimes later");
      },
    })

  }

  deleteComment(post:Post,comment:Comment){
    const user ={
      userid:comment.commenter._id
    }
    this.postService.deleteComment(post._id,comment._id,user).subscribe({
      next:(value)=> {
        alert("Delete successfully");
      },
      error:(err)=> {
        alert(err.message);//"Something when Wrong, try sometimes later"
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
  deletePost(post: any) {
    this.postService.deletePost(post._id).subscribe({
      next:(value)=> {
          alert("Delete successfully");
        },
        error:(err)=> {
          console.log(err);
        },
    })
  }

  viewPost(post:Post):void{
    this.router.navigate(['posts/'+post._id]);
  }

}
