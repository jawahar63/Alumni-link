import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  constructor() { }

  currPage = new BehaviorSubject<string>("home");

  private sidebarVisibilitySubject = new BehaviorSubject<boolean>(false);
  sidebarVisibility$ = this.sidebarVisibilitySubject.asObservable();

  toggleSidebar() {
    this.sidebarVisibilitySubject.next(!this.sidebarVisibilitySubject.value);
  }
  private searchbarVisibility= new BehaviorSubject<boolean>(false);
  searchbarVisibility$ =this.searchbarVisibility.asObservable();
  toggleSearch(){
    this.searchbarVisibility.next(!this.searchbarVisibility.value);
  }
}
