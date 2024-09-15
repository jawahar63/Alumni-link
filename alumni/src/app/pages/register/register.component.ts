import { CommonModule } from '@angular/common';
import { Component, inject ,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../../validators/confirmpassword.validator';
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../servies/toaster.service';

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
  toasterService=inject(ToasterService);
  isMentor=false;
  router =inject(Router);
  registerForm !:FormGroup;
  firstname: any;

  ngOnInit(): void {
    this.authService.AuthData.subscribe((data)=>{
      this.isMentor="mentor"===data.get('role')
    })
    if(!this.isMentor){
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
        this.toasterService.addToast('success','Success!',res.message,5000);
        this.registerForm.reset();
        this.router.navigate(['login']);
      },
      error:(err)=>{
        this.toasterService.addToast('error','error!',err.error.message,5000);
      }
    })
  }
}
