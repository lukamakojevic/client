import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatererService {
  

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getAllObjects(id: any) {

    const data = { "_id" : id };
    
    return this.http.post(`${this.uri}/caterer/getAllObjects`, data);

  }

  addNewUser(newObject: Object) {

    return this.http.post(`${this.uri}/caterer/getAllObjects`, null);

  }
  
}
