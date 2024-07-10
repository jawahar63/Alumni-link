import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { HomeComponent } from './pages/home/home.component';
import { ResetComponent } from './pages/reset/reset.component';
import { MessageComponent } from './pages/message/message.component';
import { EventComponent } from './pages/event/event.component';
import { PostComponent } from './pages/post/post.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditprofileComponent } from './pages/editprofile/editprofile.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'forget-password',component:ForgetPasswordComponent},
    {path:'home',component:HomeComponent},
    {path:'reset/:token',component:ResetComponent},
    {path:'message',component:MessageComponent},
    {path:'event',component:EventComponent},
    {path:'post',component:PostComponent},
    {path:'profile/:id',component:ProfileComponent},
    {path:'editprofile/:id',component:EditprofileComponent},
];
