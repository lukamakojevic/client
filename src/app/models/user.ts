export class User{
    _id? : string = "";
    username : string | undefined;
    password : string | undefined ;
    type : number | undefined ;
    kind!: number;
    registeredFlag!: boolean;
    name : string = "";
    address : string = "";
    details!: string;
    debt: number | undefined;
}