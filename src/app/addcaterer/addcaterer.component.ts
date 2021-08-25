import {Component, OnInit} from '@angular/core';
import { TipReg, Vrsta } from '../admin/admin.component';
import { Output, EventEmitter } from '@angular/core';
import { CatererService } from '../caterer.service';
import { MyObject } from '../models/object';
import { MyRequest } from '../models/request';

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

  newObject : MyObject = new MyObject();
  newRequest : MyRequest = new MyRequest();
  wantCat : boolean = false;

  @Output() userAdded = new EventEmitter<any>();

  constructor(private catererService: CatererService) {}

  ngOnInit() {
  }

  newObjectAdded(data: any) {
    if(data == ""){

      this.userAdded.emit({ "flag": true , "message": data});

    }else{

      this.userAdded.emit({ "flag": false , "message": data});

    }
  }

  addNewCaterer(){
    this.catererService.addNewUser(this.newObject).subscribe((data) => {

      this.newObjectAdded(data);

    });
  }

}
