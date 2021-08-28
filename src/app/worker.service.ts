import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }
  
  updateUser(user: any) {    
    return this.http.post(`${this.uri}/admin/updateUser`, user);
  }

  getAllCaterers() {
    return this.http.post(`${this.uri}/worker/getAllCaterers`, null);
  } 

  getAllRequests() {
    return this.http.post(`${this.uri}/worker/getAllRequests`, null);
  }

  acceptRequest(element: any , workerId : any) {
    const data = {
      "content" : element , 
      "approvedById" : workerId
    }
    return this.http.post(`${this.uri}/worker/acceptRequest`, data);
  }

  declineRequest(element: any , workerId : any) {
    const data = {
      "id" : element._id , 
      "approvedById" : workerId
    }
    return this.http.post(`${this.uri}/worker/declineRequest`, data);
  }
  
}
