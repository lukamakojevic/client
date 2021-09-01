export class Guest{
    _id? : string;
    objectId?: string= "";
    name : string = "";
    idNumber: string = "";
    kind : number | undefined ; 
    age : number | undefined ;  
    dateCheckIn: string= "";
    nights : number | undefined ;
    details: string = "";
    checkedOut: boolean = false;
    dateCheckOut: string= "";    
}
