import { Component, inject, Input, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../servies/post.service';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-post-temp',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './post-temp.component.html',
  styleUrl: './post-temp.component.css'
})
export class PostTempComponent implements OnInit {
  @Input() posts: Post[] = []; // An array of posts to be passed to this component

  postService = inject(PostService);
  newComment: string = '';
  modalImage: any = null;

  ngOnInit(): void {
    
  }

  navigate() {
    
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
    console.log(post);
  }

  toggleComments(post: Post) {
    post.showComments = !post.showComments;
  }

  addComment(post: Post) {
    console.log(post._id);
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

  sharePost(post: Post) {
    console.log(post);
    // Logic to share the specific post
  }
  getTimeAgo(date?: Date): string {
    if (!date) {
      return 'Unknown'; // Handle cases where date is undefined
    }
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }

}
