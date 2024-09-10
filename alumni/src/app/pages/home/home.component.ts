import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { PostTempComponent } from '../../components/post-temp/post-temp.component';
import { Post } from '../../models/post.model';
import { PostService } from '../../servies/post.service';
import { SocketService } from '../../servies/socket.service';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [HeaderComponent,SideBarComponent,PostTempComponent]
})
export class HomeComponent implements OnInit {
    post:Post[]=[];
    router=inject(Router)
    authService=inject(AuthService);
    postService = inject(PostService);
    isLoggedIn: boolean =false;
    ngOnInit(): void {
        this.isLoggedIn=this.authService.isLoggedIn();
        if(!this.isLoggedIn){
            this.router.navigate(['login']);
        }
        this.postService.getallPost().subscribe({
          next:(value) =>{
            this.post=value.posts;
          },
        })
    }
  }
