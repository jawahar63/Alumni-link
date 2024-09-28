import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  currPage = new BehaviorSubject<string>("home");

  // Method to watch the route and change page
  startRouteMonitoring() {
    // Subscribe to router events (on page load and navigation)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || this.router.url;
        this.changePageBasedOnRoute(url);
      });

    // Optionally handle the initial route
    const currentUrl = this.router.url;
    this.changePageBasedOnRoute(currentUrl);
  }

  changePageBasedOnRoute(url: string) {
    if (url.startsWith('/home') || url.startsWith('/post')) {
      this.currPage.next('home');
    } else if (url.startsWith('/event') || url.startsWith('/events')) {
      this.currPage.next('event');
    } else if (url.startsWith('/message')) {
      this.currPage.next('message');
    } 
    else if (url.startsWith('/register')) {
      this.currPage.next('register');
    }else {
      this.currPage.next('home');
    }
  }

  private sidebarVisibilitySubject = new BehaviorSubject<boolean>(false);
  sidebarVisibility$ = this.sidebarVisibilitySubject.asObservable();

  toggleSidebar() {
    this.sidebarVisibilitySubject.next(!this.sidebarVisibilitySubject.value);
  }

  private searchbarVisibility = new BehaviorSubject<boolean>(false);
  searchbarVisibility$ = this.searchbarVisibility.asObservable();

  toggleSearch() {
    this.searchbarVisibility.next(!this.searchbarVisibility.value);
  }

  changePage(page: string) {
    this.currPage.next(page);
  }
}
