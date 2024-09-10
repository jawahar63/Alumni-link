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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,CommonModule,MatTabsModule,PostTempComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  posts:Post[]=[];
  profileDetails!:profileDetails;
  fullName!:string;
  id!:string;
  userId!:string;
  details!:object;
  Editable:boolean=false;
  selectedIndex: number = 0;
  profileservice=inject(ProfileService);
  postService = inject(PostService);
  router=inject(Router);
  route=inject(ActivatedRoute)
  
  ngOnInit(): void {
    this.id=this.route.snapshot.paramMap.get('id')||'';
    if(this.id===''||this.id!==sessionStorage.getItem('user_id')){
      this.router.navigate(['home']);
    }
    this.profileservice.viewProfile(this.id).subscribe({
      next:(res)=>{
        this.profileDetails=res.message;
        this.fullName=this.profileDetails.firstName+" "+this.profileDetails.lastName;
        this.userId=this.profileDetails._id;
        if(sessionStorage.getItem('user_id')===this.userId){
          this.Editable=true;
        }
      }
    })
    
    this.postService.getPostByAuthor(this.id).subscribe({
      next:(value)=> {
        this.posts =value.posts;
      },
    })
  }
  Editprofile() {
    if(this.id!== sessionStorage.getItem('user_id'))
      return
    this.router.navigate(['editprofile/'+this.id]);
  }
  goToMessage() {
    console.log("Hi");
  }

  selectChange(): void {
    console.log("Selected INDEX: " + this.selectedIndex);
  }

  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  swipe(action = this.SWIPE_ACTION.RIGHT) {
    console.log("swipe");
    console.log("action", action);

    // Swipe left, next tab
    if (action === this.SWIPE_ACTION.LEFT) {
      this.selectedIndex = (this.selectedIndex + 1) % 2;
      console.log("Swipe left - INDEX: " + this.selectedIndex);
    }

    // Swipe right, previous tab
    if (action === this.SWIPE_ACTION.RIGHT) {
      this.selectedIndex = (this.selectedIndex - 1 + 2) % 2;
      console.log("Swipe right - INDEX: " + this.selectedIndex);
    }
  }
}
