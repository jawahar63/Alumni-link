import { CommonModule } from '@angular/common';
import { Component, inject ,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../../validators/confirmpassword.validator';
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  fb =inject(FormBuilder);
  authService =inject(AuthService);
  router =inject(Router);
  registerForm !:FormGroup;
  firstname: any;

  ngOnInit(): void {
    if(localStorage.getItem("role")!=="mentor"){
      this.router.navigate(['home']);
    }
    this.registerForm=this.fb.group({
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      email:['',Validators.compose([Validators.required,Validators.email])],
      username:['',Validators.required],
      password:['',Validators.required],
      confirmpassword:['',Validators.required],
      role:['',Validators.required],
    },{
      Validator: confirmPasswordValidator("password","confirmpassword")
    }
  );
  }

  register(){
    this.authService.registerServie(this.registerForm.value).subscribe({
      next:(res)=>{
        alert("User Created !");
        this.registerForm.reset();
        this.router.navigate(['login']);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
