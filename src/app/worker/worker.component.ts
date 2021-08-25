import { Component , OnInit } from '@angular/core';
import { ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import { User } from '../models/user';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { WorkerService } from '../worker.service';
import { Tip, TipReg, Vrsta } from '../admin/admin.component';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css']
})

export class WorkerComponent implements OnInit{
  displayedColumns: string[] = ['name',  'kind'
                               , 'details','registeredFlag', 'buttonsSave','buttonsCancel'];

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
  allCaterers: User[] | undefined;
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
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

  logOut(){
    localStorage.clear();
    this.router.navigate(['']);
  }

}


