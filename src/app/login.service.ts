import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {  

  uri = 'http://localhost:4000'

  constructor(private http: HttpClient) { }

  login(username: string, password: string){

    const data = {
      username: username,
      password: password
    }
    
    return this.http.post(`${this.uri}/users/login`, data);

  }

  loginCheck(username: any, password: any): boolean | Observable<boolean> {
    
    const data = {
      username: username,
      password: password
    }
    
    return this.http.post(`${this.uri}/users/loginCheck`, data) as Observable<boolean>;
  }
  
}