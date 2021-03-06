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

  updateObjectAddress(myObject: MyObject) {

    const data = { "_id" : myObject._id,
                   "address" : myObject.address}

    return this.http.post(`${this.uri}/caterer/updateObjectAddress`, data);

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

  addNewGuest(guest: any) {

    return this.http.post(`${this.uri}/caterer/addNewGuest`, guest);

  } 

  getAllGuests(id: any) {

    const data = { "id" : id };

    return this.http.post(`${this.uri}/caterer/getAllGuests`, data);

  }  

  updateGuest(guest: any) {

    return this.http.post(`${this.uri}/caterer/updateGuest`, guest);

  }  

  removeGuest(guest: any) {

    return this.http.post(`${this.uri}/caterer/removeGuest`, guest);

  } 

  getAllTaxes(id: any) {

    const data = { "objectId" : id };

    return this.http.post(`${this.uri}/caterer/getAllTaxes`, data);

  }

  payTax(result: any, taxId: any) {

    const data = { "bill" : result  , "taxId" : taxId};

    return this.http.post(`${this.uri}/caterer/payTax`, data);
  }  

}
