import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servies/auth.service';
import { ToasterService } from '../../servies/toaster.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {

  forgetForm!:FormGroup;
  fb=inject(FormBuilder);
  authService=inject(AuthService);
  toasterService=inject(ToasterService);

  ngOnInit(): void {
    this.forgetForm=this.fb.group({
      email:['',Validators.compose([Validators.required,Validators.email])],
    })
  }
  Sendmail(){
    this.authService.sendEmailServie(this.forgetForm.value.email).subscribe({
      next:(res)=> {
        this.toasterService.addToast('success','Success!',res.message,5000);
        this.forgetForm.reset();
      },
      error:(err)=> {
        this.toasterService.addToast('error','error!',err.error.message,5000);
      },
    })
  }
}
