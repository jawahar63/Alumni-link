import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { profileDetails } from '../../models/Alumniprofile.model';
import { ProfileService } from '../../servies/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { MatDialog } from '@angular/material/dialog';
import { ImageCropperDialogComponent, cropperDialogResult } from '../../components/image-cropper-dialog/image-cropper-dialog.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule,ImageCropperComponent],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.css'
})
export class EditprofileComponent implements OnInit {
  id='';
  skills:string[]=[];
  skilldata!:string;
  fullName!:string;
  profileDetails!:profileDetails;
  profileService=inject(ProfileService);
  router=inject(Router);
  route=inject(ActivatedRoute);
  sanitizer=inject(DomSanitizer);
  profileDetailform!: FormGroup;
  skillControl!: FormControl;
  fb=inject(FormBuilder);
  dialog=inject(MatDialog)
  imageChangedEvent: any = '';
  img:SafeUrl='';


  ngOnInit(): void {
    this.profileDetailform = this.fb.group({
      profileImage: ['',],
      domain: ['',Validators.required],
      batch: ['',Validators.required],
      company: ['',Validators.required],
      Phone_no: ['',Validators.required],
      age: ['',Validators.required],
      experiences: ['',Validators.required],
      location: ['',Validators.required],
      linkedin: ['',Validators.required],
      github: ['',Validators.required],
      skill: ['']
    });
    this.skillControl = this.profileDetailform.get('skill') as FormControl;
    this.id=this.route.snapshot.paramMap.get('id')||'';
    if(this.id!==localStorage.getItem('user_id')){
      this.router.navigate(['profile/'+this.id]);
    }
    this.profileService.viewProfile(this.id).subscribe({
      next:(res)=>{
        this.profileDetails=res.message;
        this.skills=this.profileDetails.skill;
        this.fullName=this.profileDetails.firstName+' '+this.profileDetails.lastName;
      }
    })
  }
  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const postfile = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        )
      };
      this.profileDetails.profileImage=postfile.url;
      this.profileDetailform.patchValue({
        profileImage: file         
      });
      // this.imageChangedEvent = event;
      // this.openCropperDialog(postfile.url, event.target);
    }
  }
  // openCropperDialog(imageUrl: SafeUrl, input: HTMLInputElement): void {
  //   const dialogRef = this.dialog.open(ImageCropperDialogComponent, {
  //     width: '300px',
  //     data: { imageChangedEvent: this.imageChangedEvent, imageUrl: imageUrl,id:this.id }
  //   });

  //   dialogRef.afterClosed().subscribe((result: SafeUrl) => {
  //     if (result) {
  //       this.img=result;
  //       this.profileDetailform.patchValue({
  //         profileImage: result
  //       });
  //       this.profileDetails.profileImage = result;
  //       console.log(result);
  //     }
  //     input.value = '';
  //   });
  // }

  sumbiteditform(){
    const formData = this.profileDetailform.value;
    formData.skill = this.skills;
    this.profileService.editProfile(this.id,formData).subscribe({
      next:(res)=>{
        alert("Update Successfully");
      },
      error:(err)=>{  
        console.log(err);
      }
    })
  }

  addskill() {
    if (this.skillControl.value.trim() !== '') {
      this.skills.push(this.skillControl.value);
      this.skillControl.setValue('');
    }
  }
  removeskill(i: number) {
    this.skills.splice(i, 1);
  }
}
