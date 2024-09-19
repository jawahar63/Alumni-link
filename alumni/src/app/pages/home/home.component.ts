import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { PostTempComponent } from '../../components/post-temp/post-temp.component';
import { Post } from '../../models/post.model';
import { PostService } from '../../servies/post.service';
import { SocketService } from '../../servies/socket.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [HeaderComponent,SideBarComponent,PostTempComponent,CommonModule]
})
export class HomeComponent implements OnInit {
    posts: Post[] = [];
    page: number = 1;
    limit: number = 10;
    isLoggedIn: boolean = false;
    loading: boolean = false;
    isAllPostsLoaded: boolean = false;

    router = inject(Router);
    authService = inject(AuthService);
    postService = inject(PostService);
    socketService=inject(SocketService);
    ef =inject(ElementRef);

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isLoggedIn();
        if (!this.isLoggedIn) {
            this.router.navigate(['login']);
        }
        this.loadPosts();
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
        this.postService.getPosts(this.page, this.limit).subscribe({
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
            }
        });
    }

    onScroll(): void {
      const div =this.ef.nativeElement.querySelector('app-post-temp');
      const height =div.offsetHeight;
        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.body.offsetHeight;
        if (scrollPosition > height) {
            this.loadPosts(); 
        }
    }

    ngOnDestroy(): void {
        window.removeEventListener('scroll', this.onScroll.bind(this)); // Cleanup event listener
    }
}
