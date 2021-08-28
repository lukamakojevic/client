import { Component , OnInit } from '@angular/core';
import { ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import { User } from '../models/user';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { WorkerService } from '../worker.service';
import { Tip, TipReg, Vrsta } from '../admin/admin.component';
import { MyRequest } from '../models/request';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css']
})

export class WorkerComponent implements OnInit{
  displayedColumns: string[] = ['name', 'kind','details','registeredFlag', 'buttonsSave','buttonsCancel'];

  displayedColumns2: string[] = ['objectId','date', 'stars','dateFrom', 'dateTo','buttonsAccept' , 'buttonsDecline'];

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

  loggedUser: User = new User();
  showing: string = "ugostitelji";

  allCaterers: User[] = [];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();

  allRequests: MyRequest[] = [];
  dataSource2: MatTableDataSource<MyRequest> = new MatTableDataSource();

  editModeUserId: string = "";
  editModeUser: User = new User;
  exitMode: boolean = false;

  addingCaterer: boolean = false;
  newCatererMessage: string = "";
  newCatererInfo: string = "";

  constructor(private router: Router, private workerService: WorkerService) { }

  ngOnInit(): void {

    this.loggedUser = JSON.parse(localStorage.getItem('loggedIn')!);

    this.workerService.getAllCaterers().subscribe((data: any)=>{
      this.allCaterers = data;
      this.dataSource = new MatTableDataSource(this.allCaterers);
      this.dataSource.sort = this.sort;
    })

    this.getAllRequestsWrapper();
  }  

  getAllRequestsWrapper(){
    this.workerService.getAllRequests().subscribe((data: any)=>{
      this.allRequests = data;
      let  allRequestsCopy: any[] = [];
      this.allRequests.forEach(val => allRequestsCopy.push(Object.assign({}, val)));

      allRequestsCopy.forEach(element => {
        element.date = element.date.replace(/T.*/,'').split('-').reverse().join('.');
        element.dateFrom = element.dateFrom.replace(/T.*/,'').split('-').reverse().join('.');
        element.dateTo = element.dateTo.replace(/T.*/,'').split('-').reverse().join('.');
      });
            
      this.dataSource2 = new MatTableDataSource(allRequestsCopy);
      this.dataSource2.sort = this.sort;
    })
  }

  navigate(nav: string){
    this.newCatererInfo ="";
    this.newCatererMessage ="";
    this.showing = nav;
  }

  edit(row : any){ 
    this.newCatererInfo ="";
    this.newCatererMessage ="";
    if(this.exitMode == false) {
      this.editModeUserId = row._id;
      this.editModeUser = row;
    }
    this.exitMode = false; 
  }

  save(){
    this.newCatererInfo ="";
    this.newCatererMessage ="";
    this.editModeUserId = "";    
    this.workerService.updateUser(this.editModeUser).subscribe((data: any)=>{
      this.workerService.getAllCaterers().subscribe((data: any)=>{
        this.allCaterers = data;
        this.dataSource = new MatTableDataSource(this.allCaterers);
        this.dataSource.sort = this.sort;
      })
    })
    this.editModeUser = new User;
    this.exitMode = true;
  }

  cancel(){
    this.newCatererInfo ="";
    this.newCatererMessage ="";

    this.editModeUserId = "";
    this.workerService.getAllCaterers().subscribe((data: any)=>{
      this.allCaterers = data;
      this.dataSource = new MatTableDataSource(this.allCaterers);
      this.dataSource.sort = this.sort;
    })
    this.editModeUser = new User;
    this.exitMode = true;
  }

  toggleAddingCaterer(){
    this.addingCaterer = !this.addingCaterer;
    this.newCatererInfo ="";
    this.newCatererMessage ="";
  }  

  catererAdded(data:any){
    if(data.flag == true){

      this.addingCaterer = false;
      this.newCatererInfo = "Korisnik dodat.";
      this.newCatererMessage ="";
      this.workerService.getAllCaterers().subscribe((data: any)=>{
        this.allCaterers = data;
        this.dataSource = new MatTableDataSource(this.allCaterers);
        this.dataSource.sort = this.sort;
      })

    }else{
      
      this.newCatererMessage = data.message;
      this.newCatererInfo ="";

    }
  }

  accept(element:any){  

    if(confirm("Da li ste sigurni da želite da prihvatite ovaj zahtev? ")){
      this.workerService.acceptRequest(element , this.loggedUser._id).subscribe((data: any)=>{
        this.getAllRequestsWrapper();
      });
    }  

  }

  decline(element:any){
    if(confirm("Da li ste sigurni da želite da odbijete ovaj zahtev? ")){
      this.workerService.declineRequest(element , this.loggedUser._id).subscribe((data: any)=>{
        this.getAllRequestsWrapper();
      });
    } 
  }

  logOut(){
    localStorage.clear();
    this.router.navigate(['']);
  }

}


