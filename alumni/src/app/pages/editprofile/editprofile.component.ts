import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { profileDetails } from '../../models/Alumniprofile.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from '../../servies/profile.service';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ImageCropperComponent],
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit {
  id = '';
  skills: string[] = [];
  skilldata!: string;
  fullName!: string;
  profileDetails!: profileDetails;
  profileService=inject(ProfileService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  sanitizer = inject(DomSanitizer);
  profileDetailform!: FormGroup;
  skillControl!: FormControl;
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);
  imageChangedEvent: any = '';
  img: SafeUrl = '';
  originalProfileImage: SafeUrl = '';

  ngOnInit(): void {
    this.profileDetailform = this.fb.group({
      profileImage: ['',],
      domain: ['', Validators.required],
      batch: ['', Validators.required],
      company: ['', Validators.required],
      Phone_no: ['', Validators.required],
      age: ['', Validators.required],
      experiences: ['', Validators.required],
      location: ['', Validators.required],
      linkedin: ['', Validators.required],
      github: ['', Validators.required],
      skill: ['']
    });
    this.skillControl = this.profileDetailform.get('skill') as FormControl;
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== sessionStorage.getItem('user_id')) {
      this.router.navigate(['profile/' + this.id]);
    }
    this.profileService.viewProfile(this.id).subscribe({
      next: (res) => {
        this.profileDetails = res.message;
        this.skills = this.profileDetails.skill;
        this.fullName = this.profileDetails.firstName + ' ' + this.profileDetails.lastName;
        this.originalProfileImage = this.profileDetails.profileImage;  // Save the original image URL
        this.profileDetailform.patchValue(this.profileDetails);
      }
    });
  }

  onFileSelected(event: any): void {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    const fileEvent = {
      target: {
        files: [file]
      }
    };
    this.openImageCropperDialog(fileEvent);
  }
}

openImageCropperDialog(imageChangedEvent: any): void {
  const dialogRef = this.dialog.open(ImageCropperComponent, {
    width: '400px',
    data: { imageChangedEvent: imageChangedEvent, id: this.id }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && result.blob) {
      this.uploadCroppedImage(result.blob);
    }
  });
}
uploadCroppedImage(file: Blob): void {
  const formData = new FormData();
  formData.append('profileImage', file);

  // Send the file to the server
  this.profileService.uploadImage(this.id, formData).subscribe({
    next: (res) => {
      this.profileDetails.profileImage = res.imageUrl;  // Update the image URL in profileDetails
      this.originalProfileImage = res.imageUrl;  // Update the original image URL
      localStorage.setItem("photo", res.imageUrl);
    },
    error: (err) => {
      console.log(err);
    }
  });
}

  

  sumbiteditform() {
    const formData = this.profileDetailform.value;
    formData.skill = this.skills;
    delete formData.profileImage;

    this.profileService.editProfile(this.id, formData).subscribe({
      next: (res) => {
        alert("Update Successfully");
      },
      error: (err) => {
        console.log(err);
      }
    });
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
