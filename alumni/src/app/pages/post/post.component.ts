import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../servies/post.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  authService = inject(AuthService);
  postService = inject(PostService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);

  postForm!: FormGroup;
  isLoggedIn: boolean = false;
  profileImage!: string;
  name!: string;
  batch!: string;
  company!: string;
  domain!: string;
  authorId: string = sessionStorage.getItem('user_id') || '';
  postimages: any[] = [];
  showimg: boolean = false;
  modalImage: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.router.navigate(['login']);
    }
    this.profileImage = sessionStorage.getItem('photo') || '';
    this.name = sessionStorage.getItem('username') || '';
    this.batch = sessionStorage.getItem('batch') || '';
    this.domain = sessionStorage.getItem('domain') || '';
    this.company = sessionStorage.getItem('company') || '';

    this.postForm = this.fb.group({
      caption: ['', [Validators.required, Validators.maxLength(1000)]],
      tags: ['', Validators.required],
      location: ['', Validators.required]
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

  async Submit(event: Event) {
    event.preventDefault();

    if (this.postForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('author', this.authorId);
    formData.append('caption', this.postForm.value.caption);
    formData.append('location', this.postForm.value.location);

    // Process tags and append to formData
    const tagsArray: string[] = this.postForm.value.tags.split(',').map((tag: string) => tag.trim());
    tagsArray.forEach((tag: string) => formData.append('tags[]', tag));

    // Append images to formData
    this.postimages.forEach((image) => {
      formData.append('media', image.file);  // Append each image to the 'media' field in formData
    });

    this.postService.createPost(formData).subscribe({
      next: (res) => {
        alert("Posted Successfully");
        this.navigate();
      },
      error: (err) => {
        console.log(err);
        alert(err);
      }
    });
  }

  navigate() {
    this.router.navigate(['home']);
  }
}
