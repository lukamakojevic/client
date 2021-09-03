import { Component , ElementRef, OnInit } from '@angular/core';
import { ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import { User } from '../models/user';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { WorkerService } from '../worker.service';
import { Tip, TipReg, Vrsta } from '../admin/admin.component';
import { MyRequest } from '../models/request';
import { Tax } from '../models/tax';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css']
})

export class WorkerComponent implements OnInit{
  displayedColumns: string[] = ['name', 'address','kind','details','registeredFlag', 'debt'
                                ,'buttonsSave','buttonsCancel'];

  displayedColumns2: string[] = ['objectId','date', 'stars','dateFrom', 'dateTo'
                                  ,'buttonsAccept' , 'buttonsDecline'];

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
  

  @ViewChild('sorter1') sort1!: MatSort;
  @ViewChild('sorter2') sort2!: MatSort;

  @ViewChild('filter1') filter1!: ElementRef<HTMLInputElement>; ;
  @ViewChild('filter2') filter2!: ElementRef<HTMLInputElement>; ;  

  filterActive: boolean = false;

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

  unpaidTaxes : Tax[] = [];

  constructor(private router: Router, private workerService: WorkerService) { }

  ngOnInit(): void {

    this.loggedUser = JSON.parse(localStorage.getItem('loggedIn')!);

    this.getAllCaterers();    

    this.getAllRequestsWrapper();
  }  

  getAllCaterers() {

    this.workerService.getAllCaterers().subscribe((data: any)=>{
      this.allCaterers = data;
      this.dataSource = new MatTableDataSource(this.allCaterers);
      this.dataSource.sort = this.sort1;

      this.workerService.getAllUnpaiedTaxes().subscribe((data:any)=>{
        this.unpaidTaxes = data;

        this.allCaterers.forEach(element => {
          element.debt = 0;
        });

        this.unpaidTaxes.forEach(tax => {
          this.allCaterers.forEach(user => {
            if(user.debt == undefined) user.debt = 0;
            if(user._id == tax.catererId){
              user.debt += tax.price;
            }
          });
        });       

      });

    })
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
        element.objectName = element.object.name;
      });
            
      this.dataSource2 = new MatTableDataSource(allRequestsCopy);
      this.dataSource2.sort = this.sort2;
    })
  }

  navigate(nav: string){

    if(nav=='ugostitelji'){

      this.clearFilter1(); 

    }else if(nav=='zahtevi'){

      this.clearFilter2(); 

    }
    

    this.showing = nav;        
    this.newCatererInfo ="";
    this.newCatererMessage ="";  

         
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
      this.getAllCaterers();
    })    

    this.editModeUser = new User;
    this.exitMode = true;
  }

  cancel(){
    this.newCatererInfo ="";
    this.newCatererMessage ="";

    this.editModeUserId = "";

    this.getAllCaterers();

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

      this.getAllCaterers();

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

  applyFilter1(filter : any){
    this.filterActive = true;
    this.dataSource.filter = filter.target.value.trim().toLocaleLowerCase();
  }

  applyFilter2(filter : any){
    this.filterActive = true;
    this.dataSource2.filter = filter.target.value.trim().toLocaleLowerCase();
  } 

  clearFilter1(){

    this.filterActive = false;

    if(this.filter1){
      this.filter1.nativeElement.value='';
    }        

    this.dataSource.filter = "";
  }

  clearFilter2(){
    
    this.filterActive = false;    
    
    if(this.filter2){
      this.filter2.nativeElement.value='';
    }
    
    this.dataSource2.filter = "";
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

}


