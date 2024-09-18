import { Component, HostListener, OnInit, inject } from '@angular/core';
import { ProfileService } from '../../servies/profile.service';
import { profileDetails } from '../../models/Alumniprofile.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs'
import { ActivatedRoute, Router } from '@angular/router';
import { PostTempComponent } from '../../components/post-temp/post-temp.component';
import { Post } from '../../models/post.model';
import { PostService } from '../../servies/post.service';
import { AuthService } from '../../servies/auth.service';
import { SocketService } from '../../servies/socket.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,CommonModule,MatTabsModule,PostTempComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  posts: Post[] = [];
  profileDetails!: profileDetails;
  fullName!: string;
  id!: string;
  userId!: string;
  checkUserId!: string;
  details!: object;
  isLoggedIn: boolean = false;
  Editable: boolean = false;
  selectedIndex: number = 0;
  loading: boolean = false;
  isAllPostsLoaded: boolean = false; // To track if all posts are loaded
  page: number = 1;
  limit: number = 10;

  authService = inject(AuthService);
  profileservice = inject(ProfileService);
  postService = inject(PostService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  socketService=inject(SocketService);

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.router.navigate(['login']);
    }
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.authService.AuthData.subscribe((data) => {
      this.checkUserId = data.get('user_id');
    });
    this.profileservice.viewProfile(this.id).subscribe({
      next: (res) => {
        this.profileDetails = res.message;
        this.fullName = this.profileDetails.firstName + ' ' + this.profileDetails.lastName;
        this.userId = this.profileDetails._id;
        if (this.checkUserId === this.userId) {
          this.Editable = true;
        }
      },
    });

    // Load the first set of posts
    this.loadPosts();

    // Add scroll event listener
    window.addEventListener('scroll', this.onScroll.bind(this));
    this.socketService.onNewPost().subscribe({
          next:(value)=> {
            this.posts.unshift(value);
          },
          error:(err)=> {
            console.log(err);
          },
    })
    this.socketService.onEditPost().subscribe({
          next:(data)=> {
            const post =this.getPostById(data.postId);
            if(post){
              const index =this.posts.indexOf(post);
              this.posts[index]=data.post;
            }
          },
          error:(err)=> {
            console.log(err);
          },
        })
        this.socketService.onDeletePost().subscribe({
          next:(data)=> {
            const post =this.getPostById(data);
            if(post){
              const index =this.posts.indexOf(post);
              if(index>-1){
                this.posts.splice(index,1);
              }
            }
          },
          error:(err)=> {
            console.log(err);
          },
    })
  }
  getPostById(postId:string):Post|null{
      return this.posts.find(post => post._id === postId) || null;
  }

  loadPosts(): void {
    if (this.loading || this.isAllPostsLoaded) {
      return;
    }
    this.loading = true;
    this.postService.getPostByAuthor(this.id, this.page, this.limit).subscribe({
      next: (response) => {
        if (response.posts.length < this.limit) {
          this.isAllPostsLoaded = true; // No more posts to load
        }
        this.posts = [...this.posts, ...response.posts];
        this.page++;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching posts', err);
        this.loading = false;
      },
    });
  }

  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 500; // When user scrolls close to the bottom

    if (scrollPosition > threshold) {
      this.loadPosts(); // Load more posts when scrolling near the bottom
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll.bind(this)); // Cleanup event listener
  }
  Editprofile() {
    if(this.id!== this.checkUserId)
      return
    this.router.navigate(['editprofile/'+this.id]);
  }
  goToMessage() {
    console.log("Hi");
  }

  selectChange(): void {
  }

  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  swipe(action = this.SWIPE_ACTION.RIGHT) {

    // Swipe left, next tab
    if (action === this.SWIPE_ACTION.LEFT) {
      this.selectedIndex = (this.selectedIndex + 1) % 2;
    }

    // Swipe right, previous tab
    if (action === this.SWIPE_ACTION.RIGHT) {
      this.selectedIndex = (this.selectedIndex - 1 + 2) % 2;
    }
  }
}
