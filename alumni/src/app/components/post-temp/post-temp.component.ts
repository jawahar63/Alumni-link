import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-temp',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './post-temp.component.html',
  styleUrl: './post-temp.component.css'
})
export class PostTempComponent implements OnInit {
  @Input() posts: Post[] = []; // An array of posts to be passed to this component

  newComment: string = '';
  modalImage: any = null;

  ngOnInit(): void {
    // Initialize component if needed
  }

  navigate() {
    // Navigate to another page or perform some action
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
    // Logic to handle liking a specific post
  }

  toggleComments(post: Post) {
    post.showComments = !post.showComments;
  }

  addComment(post: Post) {
    if (this.newComment.trim()) {
      // Logic to add a new comment to the specific post
      post.comments.push({
        author: {
          profileImage: '', // Add appropriate image URL
          name: 'Current User' // Replace with current user
        },
        text: this.newComment
      });
      this.newComment = '';
    }
  }

  sharePost(post: Post) {
    // Logic to share the specific post
  }

}
