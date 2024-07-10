import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [HeaderComponent,SideBarComponent]
})
export class HomeComponent implements OnInit {
    
    router=inject(Router)
    authService=inject(AuthService);
    isLoggedIn: boolean =false;
    ngOnInit(): void {
        this.isLoggedIn=this.authService.isLoggedIn();
        if(!this.isLoggedIn){
            this.router.navigate(['login']);
        }
    }
}
