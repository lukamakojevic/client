import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MyObject } from './models/object';
import { MyRequest } from './models/request';

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

  addNewObject(newObject: MyObject) {

    delete newObject._id;

    return this.http.post(`${this.uri}/caterer/addNewObject`, newObject);

  }

  addNewRequest(newRequest: MyRequest) {

    return this.http.post(`${this.uri}/caterer/addNewRequest`, newRequest);

  }

  getAllCatererUsernames() {

    return this.http.post(`${this.uri}/caterer/getAllCatererUsernames`, null);

  }

  updateObjectName(myObject: MyObject) {

    const data = { "_id" : myObject._id,
                   "name" : myObject.name}

    return this.http.post(`${this.uri}/caterer/updateObjectName`, data);

  }

  updateObjectDetails(myObject: MyObject) {

    const data = { "_id" : myObject._id,
                   "details" : myObject.details}

    return this.http.post(`${this.uri}/caterer/updateObjectDetails`, data);

  }

  grantPremission(objectId: any, userId: string) {

    const data = { "objectId" : objectId,
                   "userId" : userId}

    return this.http.post(`${this.uri}/caterer/grantPremission`, data);
  }


  getObjectImages(_id: any) {

    const data = { "objectId" : _id };

    return this.http.post(`${this.uri}/caterer/getObjectImages`, data);

  }

  addNewImage(content : any , objectId : any) {

    const data = { 
      "objectId": objectId,
      "content" : content
     };

    return this.http.post(`${this.uri}/caterer/addNewImage`, data);

  }

  deleteImage(image: any , objectId: any) {

    const data = { "id" : image._id , "objectId" : objectId}

    return this.http.post(`${this.uri}/caterer/deleteImage`, data);

  }  

  deleteObject(objectId: any) {

    const data = { "id" : objectId}

    return this.http.post(`${this.uri}/caterer/deleteObject`, data);
  }

}
