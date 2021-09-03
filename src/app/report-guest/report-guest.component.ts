import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Vrsta } from '../admin/admin.component';
import { CatererService } from '../caterer.service';
import { Guest } from '../models/guest';
import { MyObject } from '../models/object';
import {Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { User } from '../models/user';
import { Tax } from '../models/tax';

export class DialogData {
  cardNumber: number | undefined;
  cardOwner: string | undefined;
  billDate: string | undefined;
  pin: string | undefined;
  name: string | undefined;
}

@Component({
  selector: 'app-report-guest',
  templateUrl: './report-guest.component.html',
  styleUrls: ['./report-guest.component.css']
})
export class ReportGuestComponent implements OnInit {

  displayedColumns: string[] = [ 'name', 'idNumber' , 'kind' , 'age' , 'dateCheckIn' , 'nights' , 'details',
                                'buttonsSave' , 'buttonsCheckOut', 'buttonsDelete'];
  
  displayedColumns2: string[] = [ 'name', 'idNumber' , 'kind' , 'age' , 'dateCheckIn','dateCheckOut',
                                  'nights' , 'details' , 'debt' , 'buttonsPay'];

  @Input() myObject : MyObject = new MyObject();

  @ViewChild('sorter1') sort1!: MatSort;
  @ViewChild('sorter2') sort2!: MatSort;

  @ViewChild('filter1') filter1!: ElementRef<HTMLInputElement>; ;
  @ViewChild('filter2') filter2!: ElementRef<HTMLInputElement>; ;  

  filterActive: boolean = false;

  @ViewChild('fileSelect') fileSelect!: ElementRef<HTMLInputElement>; 

  vrsteGosta: Vrsta[] = [
    {value: 1, viewValue: 'Strano lice'},
    {value: 2, viewValue: 'Domaće lice'}
  ];

  checkedInGuests: Guest[] = [];
  checkedOutGuests: Guest[] = [];
  dataSource: MatTableDataSource<Guest> = new MatTableDataSource();
  dataSource2: MatTableDataSource<Guest> = new MatTableDataSource();

  taxesData: Tax[] = []

  showing: string = "checkIn"

  message: string = "";

  editModeGuestId:string = "";
  editModeGuest: any = [];

  newGuestMessage: string = "";
  newGuestInfo: string = "";
  newGuest: Guest = new Guest();

  totalDebt: number = 0;

  loggedUser: User = new User();

  @Output() exitShowingGuestsEmitter = new EventEmitter<any>();

  constructor(private catererService: CatererService , public dialog: MatDialog) { }

  ngOnInit() {

    this.loggedUser = JSON.parse(localStorage.getItem('loggedIn')!);
    this.getAllGuestsWrapper();
  }

  getAllGuestsWrapper(){
    this.catererService.getAllGuests(this.myObject._id).subscribe((data:any)=>{

      this.totalDebt = 0;
      this.procesAllGuests(data);      

    });
  }

  procesAllGuests(data:any){

    this.totalDebt = 0;
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
      this.dataSource.sort = this.sort1;

      this.checkedOutGuests.forEach((element:any) => {
        element.debt = 0;
      });
      

      this.catererService.getAllTaxes(this.myObject._id).subscribe((data:any)=>{
        this.taxesData = data;
        data.forEach((tax:any) => {
          if(tax.paid == false){
            this.totalDebt += tax.price;
          }           
          for (let index = 0; index < this.checkedOutGuests.length; index++) {
            const guest = this.checkedOutGuests[index];

            if(guest._id == tax.guest._id && tax.paid==false){              
              this.checkedOutGuests[index].debt += tax.price;              
            }        
            
          }
        });

        
        this.dataSource2 = new MatTableDataSource(this.checkedOutGuests);
        this.dataSource2.sort = this.sort2;

      });
      
  }


  backToObject(){
    this.exitShowingGuestsEmitter.emit();
  }

  fileAttached(event :any){
    let  file= <File>event.target.files[0];

    const reader = new FileReader();

    let fileSrc: any = null;

    let tempThis: any = this;

    reader.addEventListener("load", function () {
      fileSrc = reader.result;     
      fileSrc = fileSrc.replace(/\s/g, '');

      let guest: Guest = JSON.parse(fileSrc);

      tempThis.newGuest.name = guest.name;
      tempThis.newGuest.idNumber = guest.idNumber;
      tempThis.newGuest.kind = guest.kind;
      tempThis.newGuest.age = guest.age;
      tempThis.newGuest.nights = guest.nights;
      tempThis.newGuest.details = guest.details;
      
    }, false);

    if (file) {
      reader.readAsText(file);
    }
    
  }  

  cancelNewGuest(){

    this.newGuestInfo = "";
    this.newGuestMessage = "";

    this.newGuest = new Guest();
    this.fileSelect.nativeElement.value = "";

  }

  addNewGuest(){
    this.newGuestInfo = "";
    this.newGuestMessage = "";

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

    this.updateGuest(this.editModeGuest);
    
  }

  updateGuest(guest : any){

    this.newGuestInfo = "";
    this.newGuestMessage = "";

    this.editModeGuestId = "";  

    let dateData: number [] = guest.dateCheckIn.split('.');
    guest.dateCheckIn = (new Date(dateData[2], (dateData[1]-1) , dateData[0])).toISOString();

    this.catererService.updateGuest(guest).subscribe((data: any)=>{

      this.procesAllGuests(data); 
      this.editModeGuest = new Guest();

    });
    
  }

  cancel(){

    this.newGuestInfo = "";
    this.newGuestMessage = "";

    this.editModeGuestId = "";
    this.getAllGuestsWrapper();
    this.editModeGuest = new Guest();

  }

  deleteGuest(guest : any){

    this.newGuestInfo = "";
    this.newGuestMessage = "";

    if(confirm("Da li ste sigurni da želite da izbrišete gosta "+ guest.name + " ?")) {
      this.catererService.removeGuest(guest).subscribe((data: any)=>{

        this.procesAllGuests(data);

      })
      
    }

  }

  checkOutGuest(guest: any){    

    if(confirm("Da li ste sigurni da želite da odjavite gosta "+ guest.name + " ?")) {
      guest.checkedOut = true;
      guest.dateCheckOut = (new Date()).toISOString();

      this.updateGuest(guest);

    } 

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
    if(nav=='checkOut'){

      this.clearFilter1(); 

    }else if(nav=='checkIn'){

      this.clearFilter2(); 

    }
    this.newGuestInfo ="";
    this.newGuestMessage ="";
    this.showing = nav;    
  }

  edit(row : any){ 
    
    this.editModeGuestId = row._id;
    this.editModeGuest = row;
    
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

  
  isBlank(str: any) {
    return (!str || /^\s*$/.test(str));
  }

  dialogData: DialogData = new DialogData();
  
  openDialog(element:any): void {

    this.message = "";

    let taxId :any;

    this.taxesData.forEach(tax => {
      if(tax.guest._id == element._id){
        taxId = tax._id;
      }
    });    
    
    const dialogRef = this.dialog.open(DialogOverview, {
      width: '30%',
      data: {
              name: this.loggedUser.name, 
              number: this.dialogData.cardNumber ,
              owner: this.dialogData.cardOwner,
              date: this.dialogData.billDate,
              password: this.dialogData.pin              
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.catererService.payTax(result , taxId).subscribe((data:any)=>{

          this.message = "Taksa uspešno plaćena.";

          this.totalDebt = 0;

          this.checkedOutGuests.forEach((element:any) => {
            element.debt = 0;
          });

          this.taxesData = data;
          data.forEach((tax:any) => {
            if(tax.paid == false){
              this.totalDebt += tax.price;
            }           
            for (let index = 0; index < this.checkedOutGuests.length; index++) {
              const guest = this.checkedOutGuests[index];
  
              if(guest._id == tax.guest._id && tax.paid==false){              
                this.checkedOutGuests[index].debt += tax.price;              
              }        
              
            }
          });
  
          
          this.dataSource2 = new MatTableDataSource(this.checkedOutGuests);
          this.dataSource2.sort = this.sort2;

        });
      }
    });
  } 

}

@Component({
  selector: 'dialog-overview',
  templateUrl: './dialog-overview.html',
})
export class DialogOverview {

  constructor(
    public dialogRef: MatDialogRef<DialogOverview>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
