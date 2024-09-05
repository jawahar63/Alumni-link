import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer, HammerModule, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

export type CropperDialogResult = {
  blob: Blob;
  imageUrl: string;
};

@Component({
  selector: 'app-image-cropper-dialog',
  standalone: true,
  imports: [ImageCropperComponent, MatDialogModule, CommonModule,HammerModule],
  templateUrl: './image-cropper-dialog.component.html',
  styleUrls: ['./image-cropper-dialog.component.css']
})
export class ImageCropperDialogComponent {
  id: string = '';
  imageChangedEvent: any;
  croppedImage: SafeUrl | undefined;
  croppedBlob: Blob | undefined;

  constructor(
    public dialogRef: MatDialogRef<ImageCropperDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef
  ) {
    this.imageChangedEvent = data.imageChangedEvent;
    this.id = data.id;
  }

  imageCropped(event: ImageCroppedEvent): void {
    console.log('Image cropped event:', event);
    if (event.base64) {
      this.convertToJpeg(event.base64);
    }
  }

  private convertToJpeg(base64: string): void {
    console.log('Converting to JPEG...');
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      console.log('Image loaded for conversion.');
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            console.log('Blob created:', blob);
            this.croppedBlob = blob;
            this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(canvas.toDataURL('image/jpeg'));
            this.cdRef.detectChanges();
          } else {
            console.error('Failed to create blob.');
          }
        }, 'image/jpeg');
      } else {
        console.error('Failed to get canvas context.');
      }
    };
    img.onerror = (error) => {
      console.error('Image failed to load:', error);
    };
  }

  saveCroppedImage(): void {
    console.log('Saving cropped image...');
    if (this.croppedBlob) {
      console.log('Cropped blob:', this.croppedBlob);
      this.dialogRef.close({ blob: this.croppedBlob, imageUrl: this.croppedImage as string });
    } else {
      console.error("Cropped blob is null or undefined");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
