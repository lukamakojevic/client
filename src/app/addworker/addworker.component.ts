import {Component, Input, OnInit} from '@angular/core';
import { User } from '../models/user';
import { TipReg, Vrsta } from '../admin/admin.component';
import { AdminService } from '../admin.service';
import { Output, EventEmitter } from '@angular/core';

 @Component({
  selector: 'app-addworker',
  templateUrl: './addworker.component.html',
  styleUrls: ['./addworker.component.css']
})

export class AddworkerComponent implements OnInit { 

  vrsteKorisnika: Vrsta[] = [
    {value: 1, viewValue: 'Pravno lice'},
    {value: 2, viewValue: 'Preduzetnik'},
    {value: 3, viewValue: 'Fizičko lice'},
    {value: 4, viewValue: 'Ustanova'}
  ];

  tipoviRegistracije: TipReg[] = [
    {value: true, viewValue: 'Da'},
    {value: false, viewValue: 'Ne'}
  ];

  newCaterer : User = new User();
  message : string = "";

  @Output() userAdded = new EventEmitter<any>();

  constructor(private adminService: AdminService) {}

  ngOnInit() {
  }

  newCatererAdded(data: any) {
    if(data == ""){

      this.userAdded.emit({ "flag": true , "message": data});

    }else{

      this.userAdded.emit({ "flag": false , "message": data});

    }
  }

  addNewCaterer(){
    this.message = "";
    this.newCaterer.type = 1;
    this.adminService.addNewUser(this.newCaterer).subscribe((data) => {

      this.newCatererAdded(data);

    });
  }

  isBlank(str: string) {
    return (!str || /^\s*$/.test(str));
  }
  
}

