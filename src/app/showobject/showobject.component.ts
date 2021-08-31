import { ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgImageSliderComponent } from 'ng-image-slider';
import { Observable } from 'rxjs';
import { CatererService } from '../caterer.service';
import { MyObject } from '../models/object';
import { MyRequest } from '../models/request';
import {map, startWith} from 'rxjs/operators';
import { User } from '../models/user';

@Component({
  selector: 'app-showobject',
  templateUrl: './showobject.component.html',
  styleUrls: ['./showobject.component.css']
})
export class ShowobjectComponent implements OnInit {
  
  loggedUser: User = new User();

  showing: string = "";

  @ViewChild('slider')  slider!: NgImageSliderComponent;

  @Output() exitShowingEmitter = new EventEmitter<any>();
  
  @Input() myObject: MyObject = new MyObject();

  newRequest: MyRequest = new MyRequest();
  grantPremissionUsername: string = "";
  usernames: string[] = [];

  caterers: any[] = [];

  nameInfo: string = "";
  nameError: string = "";
  detailsInfo: string = "";
  detailsError: string = "";
  requestInfo: string = "";
  requestError: string = "";  
  premissionInfo: string = "";
  premissionError: string = "";


  imageObjects: Array<object> = [];
  imageContent: Array<object> = [];

  myControl: FormControl = new FormControl();

  filteredOptions!: Observable<string[]>;

  newImage: any = [];
  imageTitle: string = "";

  deleting: boolean =  false;
 
  constructor(private catererService: CatererService) { }

  ngOnInit(): void {
    
    this.getObjectImagesWrapper();

    this.loggedUser = JSON.parse(localStorage.getItem('loggedIn')!);

    this.catererService.getAllCatererUsernames().subscribe((data:any)=>{

      const index = data.map((e : any) => {return e.username}).indexOf( this.loggedUser.username, 0);
      if (index > -1) {
        data.splice(index, 1);
      }
      
      this.caterers = data;

      data.forEach((element: { username: any; }) => {
        this.usernames.push(element.username)
      });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
         
    })
  }

  private _filter(value: string): string[] {

    const filterValue = value.toLowerCase();
    return this.usernames.filter(option => option.toLowerCase().includes(filterValue));

  }

  getObjectImagesWrapper(){
    this.catererService.getObjectImages(this.myObject._id).subscribe((data:any)=>{

      this.imageObjects = data;
      this.imageContent = [];
      data.forEach((element: { content: object; }) => {
        this.imageContent.push(element.content)
      });
      
    });
  }

  resetMessages(){
    this.nameInfo = "";
    this.nameError = "";
    this.detailsInfo = "";
    this.detailsError = "";
    this.requestInfo = "";
    this.requestError = "";   
    this.premissionInfo = "";
    this.premissionError = "";
  }

  exitShowingObject(){    
    this.exitShowingEmitter.emit(true);
  }

  showingObjectChanged(){    
    this.exitShowingEmitter.emit(false);
  }
  
  
  updateObjectName(){
    this.resetMessages();
    this.catererService.updateObjectName(this.myObject).subscribe( (data :any)=>{
      
      if(data.message == "") this.nameInfo = "Naziv sačuvan."
      else this.nameError = data.message;
      this.showingObjectChanged();
    });
  }

  updateObjectDetails(){
    this.resetMessages();
    this.catererService.updateObjectName(this.myObject).subscribe( (data :any)=>{

      if(data.message == "") this.detailsInfo = "Opis sačuvan."
      else this.detailsError = data.message;

      this.showingObjectChanged();
    });
  }

  addNewRequest(){
    this.resetMessages();

    this.newRequest.objectId = this.myObject._id;
    this.newRequest.object = this.myObject;
    this.newRequest.status = "none";
    this.newRequest.approvedById = "";
    this.newRequest.date = (new Date()).toISOString();

    this.catererService.addNewRequest(this.newRequest).subscribe((data: any) => {
      if(data.message == "") this.requestInfo = "Zahtev uspešno poslat."
      else this.requestError = data.message;
      this.newRequest = new MyRequest();
    });
  }

  grantPremission(){

    this.resetMessages();

    if(this.usernames.includes(this.grantPremissionUsername)){

      let userId = this.caterers.find( e => { return e.username == this.grantPremissionUsername})._id;
      
      this.catererService.grantPremission(this.myObject._id , userId).subscribe((data: any) => {

        if(data == "") this.premissionInfo = "Ovlašćenje uspešno dodato."
        else this.premissionError = data;

        this.grantPremissionUsername = "";
      })
      
    }else{
      this.premissionError = "Korisnik ne postoji."
    }
    
  }

  fileAttached(event: any){
    console.log(event)
    this.newImage = event.target.files[0];
  }

  saveImage(){

    let  file= <File>this.newImage;

    const reader = new FileReader();

    let imageSrc: any = null;

    let tempThis = this;

    reader.addEventListener("load", function () {
      imageSrc = reader.result;

      const content = {
        "image": imageSrc,
        "thumbImage" : imageSrc, 
        "title" : tempThis.imageTitle
      }
  
      tempThis.catererService.addNewImage(content , tempThis.myObject._id).subscribe((data)=>{
        tempThis.newImage = [];
        tempThis.imageTitle = ""
        tempThis.getObjectImagesWrapper();
      });
      
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
    
  }

  cancelImage(){
    this.newImage = [];
    this.imageTitle = "";
  }

  deleteImage(event: any){

    if(this.deleting){
      if(confirm("Da li ste sigurni da želite da izbrišete ovu fotografiju ?")) {
        this.catererService.deleteImage(this.imageObjects[event] , this.myObject._id).subscribe((data:any)=>{
          this.imageObjects = data;
          this.imageContent = [];
          data.forEach((element: { content: object; }) => {
            this.imageContent.push(element.content)
          });
        });
      }      
    }
    
  }

  deleteSet(){
    this.deleting = true;
  }

  deleteReset(){
    this.deleting = false;
  }

  showGuests(){
    this.showing = "guests";
  }

  showObject(){
    this.showing = "";
  }


  isBlank(str: string) {
    return (!str || /^\s*$/.test(str));
  }

  isOwner(){
    return this.loggedUser._id == this.myObject.owner;
  }

  deleteObject(){
    if(confirm("Da li ste sigurni da želite da uklonite ovaj objekat ?")) {
      this.catererService.deleteObject(this.myObject._id).subscribe((data) => {
        this.exitShowingEmitter.emit(true);
      });
    }
  }

}
