export class User{
    _id : string | undefined;
    username : string | undefined;
    password : string | undefined ;
    type : number | undefined ;
    kind!: number;
    registeredFlag!: boolean;
    name : string | undefined;
    details!: string;
}