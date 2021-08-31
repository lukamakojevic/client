import {Component, OnInit} from '@angular/core';
import { TipReg, Vrsta } from '../admin/admin.component';
import { Output, EventEmitter } from '@angular/core';
import { CatererService } from '../caterer.service';
import { MyObject } from '../models/object';
import { MyRequest } from '../models/request';
import { User } from '../models/user';

@Component({
  selector: 'app-addcaterer',
  templateUrl: './addcaterer.component.html',
  styleUrls: ['./addcaterer.component.css']
})

export class AddcatererComponent implements OnInit { 

  vrsteObjekata: Vrsta[] = [
    {value: 1, viewValue: 'Kafana'},
    {value: 2, viewValue: 'Restoran'},
    {value: 3, viewValue: 'Bar'},
    {value: 4, viewValue: 'Kafić'}
  ];

  tipoviRegistracije: TipReg[] = [
    {value: true, viewValue: 'Da'},
    {value: false, viewValue: 'Ne'}
  ];

  loggedUser: User = new User();
  
  newObject : MyObject = new MyObject();
  newRequest : MyRequest = new MyRequest();
  wantCat : boolean = false;

  @Output() objectAdded = new EventEmitter<any>();

  constructor(private catererService: CatererService) {}

  ngOnInit() {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedIn')!);
  }

  newObjectAdded(data: any) {
    if(data == ""){

      this.objectAdded.emit({ "flag": true , "message": data});

    }else{

      this.objectAdded.emit({ "flag": false , "message": data});

    }
  }

  addNewObject(){
    this.newObject.premissions = [];
    this.newObject.premissions.push(this.loggedUser._id);
    this.newObject.owner = this.loggedUser._id;
    this.newObject.stars = 0;
    this.newObject.categoryId = "";

    this.catererService.addNewObject(this.newObject).subscribe((data: any) => {      

      if(this.wantCat){

        this.newRequest.objectId = data.object._id;
        this.newRequest.object = data.object;
        this.newRequest.status = "none";
        this.newRequest.approvedById = "";
        this.newRequest.date = (new Date()).toISOString();

        this.catererService.addNewRequest(this.newRequest).subscribe((data: any) => {
          this.newObjectAdded(data.message);
          this.newRequest = new MyRequest();
          this.newObject = new MyObject();
        })

      }else{
        this.newObjectAdded(data.message);
        this.newRequest = new MyRequest();
        this.newObject = new MyObject();
      }
      
    });
    
  }

  isBlank(str: string) {
    return (!str || /^\s*$/.test(str));
  }

}
