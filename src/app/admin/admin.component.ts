import { Component , OnInit } from '@angular/core';
import { ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import { AdminService } from '../admin.service';
import { User } from '../models/user';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';

interface Tip {
  value: number;
  viewValue: string;
}

interface Vrsta {
  value: number;
  viewValue: string;
}

interface TipReg {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit{
  displayedColumns: string[] = ['name', 'username', 'password' , 'type', 'kind'
                               , 'registeredFlag','buttonsSave','buttonsCancel'];

  tipoviKorisnika: Tip[] = [
    {value: 0, viewValue: 'Admin'},
    {value: 1, viewValue: 'Ugostitelj'},
    {value: 2, viewValue: 'Radnik'}
  ];

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

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  loggedUser: User | undefined;
  allUsers: User[] | undefined;
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  editModeUserId: string = "";
  editModeUser: User = new User;
  exitMode: boolean = false;

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit(): void {

    this.loggedUser = JSON.parse(localStorage.getItem('loggedIn')!);

    this.adminService.getAllUsers().subscribe((data: any)=>{
      this.allUsers = data;
      this.dataSource = new MatTableDataSource(this.allUsers);
      this.dataSource.sort = this.sort;
    })
  }  

  edit(row : any){ 
    if(this.exitMode == false) {
      this.editModeUserId = row._id;
      this.editModeUser = row;
    }
    this.exitMode = false; 
  }

  save(){
    this.editModeUserId = "";    
    this.adminService.updateUser(this.editModeUser).subscribe((data: any)=>{
      this.allUsers = data;
      this.dataSource = new MatTableDataSource(this.allUsers);
      this.dataSource.sort = this.sort;
    })
    this.editModeUser = new User;
    this.exitMode = true;
  }

  cancel(){
    this.editModeUserId = "";
    this.adminService.getAllUsers().subscribe((data: any)=>{
      this.allUsers = data;
      this.dataSource = new MatTableDataSource(this.allUsers);
      this.dataSource.sort = this.sort;
    })
    this.editModeUser = new User;
    this.exitMode = true;
  }

  logOut(){
    localStorage.clear();
    this.router.navigate(['']);
  }

}

