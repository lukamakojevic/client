import { Component , ElementRef, OnInit } from '@angular/core';
import { ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import { AdminService } from '../admin.service';
import { User } from '../models/user';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';

export interface Tip {
  value: number;
  viewValue: string;
}

export interface Vrsta {
  value: number;
  viewValue: string;
}

export interface TipReg {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit{
  displayedColumns: string[] = ['name', 'username', 'password' , 'type', 'kind' , 'address'
                               , 'registeredFlag' , 'buttonsEdit'];

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

  @ViewChild('filter') filter!: ElementRef<HTMLInputElement>;  

  filterActive: boolean = false;

  loggedUser: User | undefined;
  allUsers: User[] | undefined;
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  editModeUserId: string = "";
  editModeUser: User = new User();
  exitMode: boolean = false;

  newUserMessage: string = "";
  newUser: User = new User();
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

  addNewUser(){

    this.newUserMessage = "";

    if(this.newUser.name == null || this.newUser.name == undefined || this.newUser.name == ""){
      this.newUserMessage = "Unesite naziv korisnika."
      return;
    }

    if(this.newUser.username == null || this.newUser.username == undefined || this.newUser.username == ""){
      this.newUserMessage = "Unesite korisničko ime."
      return;
    }

    if(this.newUser.password == null || this.newUser.password == undefined || this.newUser.password == ""){
      this.newUserMessage = "Unesite šifru."
      return;
    }    

    if(this.newUser.type != 0 && this.newUser.type == null || this.newUser.type == undefined){
      this.newUserMessage = "Unesite tip korisnika."
      return;
    }

    if(this.newUser.kind == null || this.newUser.kind == undefined){
      this.newUserMessage = "Unesite vrstu korisnika."
      return;
    }

    if(this.newUser.address == null || this.newUser.address == undefined || this.newUser.address == ""){
      this.newUserMessage = "Unesite adresu korisnika."
      return;
    }

    if(this.newUser.registeredFlag == null || this.newUser.registeredFlag == undefined){
      this.newUser.registeredFlag = false;
    }

    this.adminService.addNewUser(this.newUser).subscribe((data: any)=>{
      this.newUserMessage = data;
      this.newUser = new User();

      this.adminService.getAllUsers().subscribe((data: any)=>{

        this.allUsers = data;
        this.dataSource = new MatTableDataSource(this.allUsers);
        this.dataSource.sort = this.sort;
      })

    })
  }

  cancelNewUser(){
    this.newUser = new User();
    this.newUserMessage = "";
  }

  deleteUser(){
    if(confirm("Da li ste sigurni da želite da izbrišete korisnika "+ this.editModeUser.username + " ?")) {
      if(this.editModeUser.type == 0){
        alert("Nije moguće ukloniti korisnika tipa administrator.");
      }else{
        this.adminService.removeUser(this.editModeUser).subscribe((data: any)=>{
          this.allUsers = data;
          this.dataSource = new MatTableDataSource(this.allUsers);
          this.dataSource.sort = this.sort;
        })
      }
      
    }
  }

  logOut(){
    localStorage.clear();
    this.router.navigate(['']);
  }

  checkData(){
    if(this.editModeUser.name == null || this.editModeUser.name == undefined || this.editModeUser.name == ""){
      return false;
    }

    if(this.editModeUser.username == null || this.editModeUser.username == undefined || this.editModeUser.username == ""){
      return false;
    }

    if(this.editModeUser.password == null || this.editModeUser.password == undefined || this.editModeUser.password == ""){
      return false;
    }    

    if(this.editModeUser.type != 0 && this.editModeUser.type == null || this.editModeUser.type == undefined){
      return false;
    }

    if(this.editModeUser.kind == null || this.editModeUser.kind == undefined){
      return false;
    }

    if(this.editModeUser.address == null || this.editModeUser.address == undefined || this.editModeUser.address == ""){
      return false;
    }
    return true;

  }

  applyFilter(filter : any){
    this.filterActive = true;
    this.dataSource.filter = filter.target.value.trim().toLocaleLowerCase();
  }  

  clearFilter(){

    this.filterActive = false;

    if(this.filter){
      this.filter.nativeElement.value='';
    }        

    this.dataSource.filter = "";
  }


}

