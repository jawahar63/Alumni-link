import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  http =inject(HttpClient);
  token:string = localStorage.getItem('token')||'';
  header=new HttpHeaders({
    'authorization': `Bearer ${this.token}`
  });
  autoSuggest(query: string): Observable<any> {
    return this.http.get(`${apiUrls.searchservice}/autosuggest?q=${query}`,{
      headers:this.header
    });
  }
}
