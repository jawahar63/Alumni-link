import { Component, OnChanges, OnInit, forwardRef, inject } from '@angular/core';
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { postFile } from '../../models/post-file.model';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  providers: [
  // {
  //   provide: NG_VALUE_ACCESSOR,
  //   useExisting: forwardRef(() => ),
  //   multi: true,
  // }
]
})
export class PostComponent implements OnInit{


  router=inject(Router);
  sanitizer=inject(DomSanitizer);
    authService=inject(AuthService);
    isLoggedIn: boolean =false;
    name!:string;
    batch!:string;
    domain!:string;
    company!:string;
    postimages:postFile[]=[];
    postfile!:postFile;
    postimageLen:number=0;
    showimg:boolean=false;
    modalImage: any;
    ngOnInit(): void {
        this.isLoggedIn=this.authService.isLoggedIn();
        if(!this.isLoggedIn){
            this.router.navigate(['login']);
        }
        if(sessionStorage.getItem('role')!=='alumni'){
          this.router.navigate(['home']);
        }
        this.name="Nithyananthan K";
        this.batch="2022-2024";
        this.domain="cyber security";
        this.company="pesideo";
        this.updateimagelen();
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
      this.updateimagelen();
      }

    removeimg(image: any) {
    const index = this.postimages.indexOf(image);
    if (index > -1) {
      this.postimages.splice(index, 1);
      this.updateimagelen();
    }
  }
  

  openModal(image: any) {
      this.modalImage = image;
  }

  closeModal() {
      this.modalImage = null;
  }
  updateimagelen(){
    this.postimageLen=this.postimages.length;
  }
  Submit(){
    
  }
}
