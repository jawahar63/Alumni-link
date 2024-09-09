import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { PostTempComponent } from '../../components/post-temp/post-temp.component';
import { Post } from '../../models/post.model';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [HeaderComponent,SideBarComponent,PostTempComponent]
})
export class HomeComponent implements OnInit {
    
    router=inject(Router)
    authService=inject(AuthService);
    isLoggedIn: boolean =false;
    ngOnInit(): void {
        this.isLoggedIn=this.authService.isLoggedIn();
        if(!this.isLoggedIn){
            this.router.navigate(['login']);
        }
    }

    samplePosts: Post[] = [
  {
    id: '1',
    author: {
      profileImage: 'https://example.com/images/profile1.jpg',
      name: 'Alice Johnson',
      batch: '2024',
      domain: 'Engineering',
      company: 'Tech Solutions'
    },
    caption: 'Exploring new horizons with some amazing views!',
    tags: ['travel', 'adventure', 'nature'],
    location: 'San Francisco, CA',
    media: [
      { type: 'image', url: 'https://example.com/images/photo1.jpg' },
      { type: 'image', url: 'https://example.com/images/photo2.jpg' }
    ],
    comments: [
      {
        author: {
          profileImage: 'https://example.com/images/profile2.jpg',
          name: 'Bob Smith'
        },
        text: 'Looks fantastic!',
        createdAt: new Date('2024-09-01T12:34:56Z')
      },
      {
        author: {
          profileImage: 'https://example.com/images/profile3.jpg',
          name: 'Carol White'
        },
        text: 'I want to go there too!',
        createdAt: new Date('2024-09-02T15:22:11Z')
      }
    ],
    likes: ['user2', 'user3', 'user4'],
    createdAt: new Date('2024-08-30T09:00:00Z'),
    updatedAt: new Date('2024-09-01T10:00:00Z'),
    showComments: true
  },
  {
    id: '2',
    author: {
      profileImage: 'https://example.com/images/profile4.jpg',
      name: 'David Brown',
      batch: '2023',
      domain: 'Design',
      company: 'Creative Co.'
    },
    caption: 'Just finished a new design project. Check it out!',
    tags: ['design', 'portfolio', 'art'],
    location: 'New York, NY',
    media: [
      { type: 'image', url: 'https://example.com/images/design1.jpg' }
    ],
    comments: [
      {
        author: {
          profileImage: 'https://example.com/images/profile5.jpg',
          name: 'Eva Green'
        },
        text: 'Amazing work!',
        createdAt: new Date('2024-09-03T08:45:00Z')
      }
    ],
    likes: ['user1', 'user5'],
    createdAt: new Date('2024-09-01T14:30:00Z'),
    updatedAt: new Date('2024-09-02T11:15:00Z'),
    showComments: false
  }
];

}
