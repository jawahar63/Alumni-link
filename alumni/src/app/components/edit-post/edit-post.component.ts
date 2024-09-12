import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../servies/auth.service';
import { PostService } from '../../servies/post.service';

@Component({
  selector: 'app-editpost',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  authService = inject(AuthService);
  postService = inject(PostService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);
  route = inject(ActivatedRoute);

  postForm!: FormGroup;
  profileImage!: string;
  name!: string;
  batch!: string;
  company!: string;
  domain!: string;
  postimages: any[] = [];
  showimg: boolean = true;
  modalImage: any;
  postId!: string;
  authorId!:string;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Get post data from route params
    this.postId = this.route.snapshot.paramMap.get('id')!;
    this.fetchPostData(this.postId);

    // Set up form
    this.postForm = this.fb.group({
      caption: ['', [Validators.required, Validators.maxLength(1000)]],
      tags: ['', Validators.required],
      location: ['', Validators.required]
    });

    this.loadUserProfile();
  }

  loadUserProfile() {
    this.profileImage = sessionStorage.getItem('photo') || '';
    this.name = sessionStorage.getItem('username') || '';
    this.batch = sessionStorage.getItem('batch') || '';
    this.domain = sessionStorage.getItem('domain') || '';
    this.company = sessionStorage.getItem('company') || '';
  }

  fetchPostData(postId: string) {
  this.postService.getPostById(postId).subscribe(post => {
    this.authorId=post.data.author._id
    this.postForm.patchValue({
      caption: post.data.caption,
      tags: Array.isArray(post.data.tags) ? post.data.tags.join(', ') : '', // Check if tags is an array
      location: post.data.location
    });

    // Check if media is an array before using map
    this.postimages = Array.isArray(post.data.media) ? post.data.media : [];
  });
}


  imgprev(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.showimg = true;
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const postfile = {
          file: file,
          url: this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(file)
          )
        };
        this.postimages.push(postfile);
      }
    }
  }

  openModal(image: any) {
    this.modalImage = image;
  }

  closeModal() {
    this.modalImage = null;
  }

  removeimg(image: any) {
    const index = this.postimages.indexOf(image);
    if (index > -1) {
      this.postimages.splice(index, 1);
    }
  }

  async updatePost(event: Event) {
    event.preventDefault();

    if (this.postForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('author',this.authorId);
    formData.append('caption', this.postForm.value.caption);
    formData.append('location', this.postForm.value.location);

    // Process tags and append to formData
    const tagsArray: string[] = this.postForm.value.tags.split(',').map((tag: string) => tag.trim());
    tagsArray.forEach((tag) => {
      formData.append('tags[]', tag);
    });

    // Append media to formData
    for (const postimg of this.postimages) {
      if (postimg.file) {
        formData.append('media', postimg.file);
      }
    }

    try {
      const response = await this.postService.updatePost(this.postId, formData).toPromise();
      alert("Update successfully")
      this.router.navigate(['/posts', this.postId]);
    } catch (error) {
      console.error('Error updating post', error);
    }
  }

  navigate() {
    this.router.navigate(['/home']);
  }
}
