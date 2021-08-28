import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
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


  @Input() imageObjects: Array<object> = [{
        image: 'assets/img1.png',
        thumbImage: 'assets/img1.png',
        alt: 'alt of image',
        title: 'title of image'
    },
    {
      image: 'assets/img2.png',
      thumbImage: 'assets/img2.png',
      alt: 'alt of image',
      title: 'title of image'
    },
    {
      image: 'assets/img3.png',
      thumbImage: 'assets/img3.png',
      alt: 'alt of image',
      title: 'title of image'
  },
  {
    image: 'assets/img1.png',
    thumbImage: 'assets/img1.png',
    alt: 'alt of image',
    title: 'title of image'
},
{
  image: 'assets/img2.png',
  thumbImage: 'assets/img2.png',
  alt: 'alt of image',
  title: 'title of image'
},
{
  image: 'assets/img3.png',
  thumbImage: 'assets/img3.png',
  alt: 'alt of image',
  title: 'title of image'
},{
  image: 'assets/img1.png',
  thumbImage: 'assets/img1.png',
  alt: 'alt of image',
  title: 'title of image'
},
{
image: 'assets/img2.png',
thumbImage: 'assets/img2.png',
alt: 'alt of image',
title: 'title of image'
},
{
image: 'assets/img3.png',
thumbImage: 'assets/img3.png',
alt: 'alt of image',
title: 'title of image'
}/*, {
      image: '.../iOe/xHHf4nf8AE75h3j1x64ZmZ//Z==', // Support base64 image
      thumbImage: '.../iOe/xHHf4nf8AE75h3j1x64ZmZ//Z==', // Support base64 image
      title: 'Image title', //Optional: You can use this key if want to show image with title
      alt: 'Image alt', //Optional: You can use this key if want to show image with alt
      order: 1 //Optional: if you pass this key then slider images will be arrange according @input: slideOrderType
  }*/
 ];
   myControl: FormControl = new FormControl();

   filteredOptions!: Observable<string[]>;

 
  constructor(private catererService: CatererService) { }

  ngOnInit(): void {

      this.loggedUser = JSON.parse(localStorage.getItem('loggedIn')!);

      this.catererService.getAllCatererUsernames().subscribe((data:any)=>{
        
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


  isBlank(str: string) {
    return (!str || /^\s*$/.test(str));
  }

  isOwner(){
    return this.loggedUser._id == this.myObject.owner;
  }

}
