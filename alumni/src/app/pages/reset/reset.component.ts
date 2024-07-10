import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../servies/auth.service';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export class ResetComponent implements OnInit {
  resetForm!:FormGroup;
  fb=inject(FormBuilder);
  activatedRoute =inject(ActivatedRoute);
  authservice=inject(AuthService);
  router =inject(Router);

  token!:string;

  ngOnInit(): void {
    this.resetForm=this.fb.group({
      password:['',Validators.required],
      confirmpassword:['',Validators.required],
    });
    this.activatedRoute.params.subscribe(val=>{
      this.token =val['token'];
    })
  }
  reset(){
    let resetObj={
      token: this.token,
      password:this.resetForm.value.password
    }
    this.authservice.resetServie(resetObj).subscribe({
      next:(res)=> {
        alert(res.message);
        this.resetForm.reset();
      },
      error: (err)=> {
        alert(err.error.message);
      },
    })
  }
}
