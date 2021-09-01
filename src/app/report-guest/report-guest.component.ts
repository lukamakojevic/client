import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Vrsta } from '../admin/admin.component';
import { CatererService } from '../caterer.service';
import { Guest } from '../models/guest';
import { MyObject } from '../models/object';

@Component({
  selector: 'app-report-guest',
  templateUrl: './report-guest.component.html',
  styleUrls: ['./report-guest.component.css']
})
export class ReportGuestComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'idNumber' , 'kind' , 'age' , 'dateCheckIn' , 'nights' , 'details',
                                'buttonsSave' , 'buttonsCheckOut', 'buttonsDelete'];
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  displayedColumns2: string[] = [ 'name', 'idNumber' , 'kind' , 'age' , 'dateCheckOut','dateCheckIn' , 'nights' , 'details'];

  @Input() myObject : MyObject = new MyObject();

  vrsteGosta: Vrsta[] = [
    {value: 0, viewValue: 'Strano lice'},
    {value: 1, viewValue: 'Domaće lice'}
  ];

  checkedInGuests: Guest[] = [];
  checkedOutGuests: Guest[] = [];
  dataSource: MatTableDataSource<Guest> = new MatTableDataSource();
  dataSource2: MatTableDataSource<Guest> = new MatTableDataSource();

  showing: string = "checkIn"

  editModeGuestId:string = "";
  editModeGuest: any = [];

  newGuestMessage: string = "";
  newGuestInfo: string = "";
  newGuest: Guest = new Guest();

  @Output() exitShowingGuestsEmitter = new EventEmitter<any>();
  

  constructor(private catererService: CatererService) { }

  ngOnInit() {
    this.getAllGuestsWrapper();
  }

  getAllGuestsWrapper(){
    this.catererService.getAllGuests(this.myObject._id).subscribe((data:any)=>{

      this.checkedInGuests = [];
      this.checkedOutGuests = [];

      data.forEach((element:any) => {        
        element.dateCheckIn = element.dateCheckIn.replace(/T.*/,'').split('-').reverse().join('.');
        if(element.checkedOut){

          element.dateCheckOut = element.dateCheckOut.replace(/T.*/,'').split('-').reverse().join('.');
          this.checkedOutGuests.push(element);

        }else{
          this.checkedInGuests.push(element);
        }        
      });

      this.dataSource = new MatTableDataSource(this.checkedInGuests);
      this.dataSource.sort = this.sort;

      this.dataSource2 = new MatTableDataSource(this.checkedOutGuests);
      this.dataSource2.sort = this.sort;

    });
  }

  backToObject(){
    this.exitShowingGuestsEmitter.emit();
  }
  

  cancelNewGuest(){

   this.newGuest = new Guest();

  }

  addNewGuest(){

    this.newGuest.objectId = this.myObject._id;
    this.newGuest.dateCheckIn = (new Date()).toISOString();
    this.newGuest.checkedOut = false;

    this.catererService.addNewGuest(this.newGuest).subscribe((data => {
      this.getAllGuestsWrapper();
      this.newGuestInfo = "Gost prijavljen."
      this.newGuest = new Guest();
    }));

  }

  save(){

  }

  cancel(){

    this.editModeGuestId = "";
    this.getAllGuestsWrapper();
    this.editModeGuest = new Guest();

  }

  deleteGuest(guest : any){

  }

  checkOutGuest(element: any){

  }

  checkData(){
    return !this.isBlank(this.newGuest.name) &&
           !this.isBlank(this.newGuest.idNumber) &&
           !this.isBlank(this.newGuest.age) &&
           !this.isBlank(this.newGuest.nights) &&
           !this.isBlank(this.newGuest.details) &&
           !this.isBlank(this.newGuest.kind);
  }

  navigate(nav: string){
    this.newGuestInfo ="";
    this.newGuestMessage ="";
    this.showing = nav;
  }

  edit(row : any){ 
    
    this.editModeGuestId = row._id;
    this.editModeGuest = row;
    
  }

  
  isBlank(str: any) {
    return (!str || /^\s*$/.test(str));
  }
  

}
