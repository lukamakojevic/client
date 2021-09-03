import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Vrsta } from '../admin/admin.component';
import { CatererService } from '../caterer.service';
import { MyObject } from '../models/object';
import { User } from '../models/user';

@Component({
  selector: 'app-caterer',
  templateUrl: './caterer.component.html',
  styleUrls: ['./caterer.component.css']
})
export class CatererComponent implements OnInit {
  displayedColumns: string[] = [ 'name', 'address','type' , 'details' , 'stars' , 'viewButtons'];
  vrsteObjekata: Vrsta[] = [
    {value: 1, viewValue: 'Apartman'},
    {value: 2, viewValue: 'Hotel'},
    {value: 3, viewValue: 'Stan'},
    {value: 4, viewValue: 'Motel'},
    {value: 5, viewValue: 'Kamp'} , 
    {value: 6, viewValue: 'Kuća'} ,
    {value: 7, viewValue: 'Soba'} ,
    {value: 8, viewValue: 'Seosko domaćinstvo'}
  ];

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  @ViewChild('filter') filter!: ElementRef<HTMLInputElement>;  

  filterActive: boolean = false;

  loggedUser: User = new User();
  
  allObjects: MyObject[] = [];
  dataSource: MatTableDataSource<MyObject> = new MatTableDataSource();

  editModeUserId: string = "";
  editModeUser: User = new User;
  exitMode: boolean = false;  

  addingObject: boolean = false;
  newObjectMessage: string = "";
  newObjectInfo: string = "";

  showing: string = "allObjects";
  showingObject : MyObject = new MyObject()

  constructor(private router: Router, private catererService: CatererService) { }

  ngOnInit(): void {

    this.loggedUser = JSON.parse(localStorage.getItem('loggedIn')!);
    this.getAllObjectsWrapper();
    
  }  

  getAllObjectsWrapper(){
    this.catererService.getAllObjects(this.loggedUser._id).subscribe((data: any)=>{
      this.allObjects = data;  
      this.dataSource = new MatTableDataSource(this.allObjects);
      this.dataSource.sort = this.sort;
    })
  }
  

  view(row: any) {
    this.newObjectInfo ="";
    this.newObjectMessage ="";

    this.showingObject = row;
    this.showing = "singleObject";

    this.clearFilter()
  }

  exitView(event:any){
    
    this.getAllObjectsWrapper();

    if(event){
      this.newObjectInfo ="";
      this.newObjectMessage ="";

      this.showingObject = new MyObject();
      this.showing = "allObjects";
    }    
    
  }

  edit(row : any){ 
    this.newObjectInfo ="";
    this.newObjectMessage ="";
    if(this.exitMode == false) {
      this.editModeUserId = row._id;
      this.editModeUser = row;
    }
    this.exitMode = false; 
  }

  save(){
    this.newObjectInfo ="";
    this.newObjectMessage ="";
    this.editModeUserId = "";    
    /*this.catererService.updateUser(this.editModeUser).subscribe((data: any)=>{
      this.catererService.getAllObject().subscribe((data: any)=>{
        this.allObjects = data;
        this.dataSource = new MatTableDataSource(this.allObjects);
        this.dataSource.sort = this.sort;
      })
    })*/
    this.editModeUser = new User;
    this.exitMode = true;
  }

  cancel(){
    this.newObjectInfo ="";
    this.newObjectMessage ="";

    this.editModeUserId = "";
    /*this.catererService.getAllObjects().subscribe((data: any)=>{
      this.allObjects = data;
      this.dataSource = new MatTableDataSource(this.allObjects);
      this.dataSource.sort = this.sort;
    })*/
    this.editModeUser = new User;
    this.exitMode = true;
  }

  toggleAddingObject(){

    this.newObjectInfo ="";
    this.newObjectMessage ="";

    if(this.loggedUser.registeredFlag == true){
      this.addingObject = !this.addingObject;
    }else{
      this.newObjectMessage = "Morate biti registrovani kod nadležnog organa.";
    }    
    
  }  

  objectAdded(data:any){
    if(data.flag == true){

      this.addingObject = false;
      this.newObjectInfo = "Objekat dodat.";
      this.newObjectMessage ="";
      this.catererService.getAllObjects(this.loggedUser._id).subscribe((data: any)=>{
        this.allObjects = data;
        this.dataSource = new MatTableDataSource(this.allObjects);
        this.dataSource.sort = this.sort;
      });

    }else{
      
      this.newObjectMessage = data.message;
      this.newObjectInfo ="";

    }
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

  logOut(){
    localStorage.clear();
    this.router.navigate(['']);
  }

}
