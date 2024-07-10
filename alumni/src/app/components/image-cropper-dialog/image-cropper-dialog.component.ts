import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { ImageCropperComponent,ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../servies/profile.service';

export type cropperDialogResult={
  blog:Blob;
  imageUrl:string;
}

@Component({
  selector: 'app-image-cropper-dialog',
  standalone: true,
  imports: [ImageCropperComponent,MatDialogModule,CommonModule],
  templateUrl: './image-cropper-dialog.component.html',
  styleUrl: './image-cropper-dialog.component.css'
})


export class ImageCropperDialogComponent {

  id:string='';
  imageChangedEvent: any;
  croppedImage: SafeUrl | undefined;
  profileService=inject(ProfileService);

  constructor(
    public dialogRef: MatDialogRef<ImageCropperDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef
  ) {
    this.imageChangedEvent = data.imageChangedEvent;
    this.id=data.id;
    
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.base64 || '');
    this.cdRef.detectChanges();
  }
  saveCroppedImage(): void {
    const profileImage=this.croppedImage
    this.profileService.editProfile(this.id,profileImage).subscribe({
      next:(res)=>{
        alert("Update Successfully");
      },
      error:(err)=>{  
        console.log(err);
      }
    })
    this.dialogRef.close(this.croppedImage);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
