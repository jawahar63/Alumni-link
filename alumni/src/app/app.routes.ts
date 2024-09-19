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
import { SinglePostComponent } from './components/single-post/single-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';

export const routes: Routes = [
    {path:'',component:HomeComponent,pathMatch: 'full'},
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'forget-password',component:ForgetPasswordComponent},
    {path:'home',component:HomeComponent},
    {path:'reset/:token',component:ResetComponent},
    {path:'message',component:MessageComponent},
    {path:'event',component:EventComponent},
    {path:'post',component:PostComponent},
    {path:'posts/:id',component:SinglePostComponent},
    {path:'editposts/:id',component:EditPostComponent},
    {path:'profile/:id',component:ProfileComponent},
    {path:'editprofile/:id',component:EditprofileComponent},
    { path: '**', redirectTo: '' }
];
