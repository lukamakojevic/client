import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService { 
  
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }
  
  updateUser(user: any) {    
    return this.http.post(`${this.uri}/admin/updateUser`, user);
  }

  getAllUsers() {
    return this.http.post(`${this.uri}/admin/getAllUsers`, null);
  } 

  addNewUser(user: any) {
    return this.http.post(`${this.uri}/admin/addNewUser`, user);
  }

  removeUser(user: User) {
    return this.http.post(`${this.uri}/admin/removeUser`, user);
  }

}
