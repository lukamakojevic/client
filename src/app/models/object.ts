export class MyObject{
    _id? : string;
    name : string = "";
    address : string = "";
    type : number | undefined ;    
    owner: string | undefined;
    premissions: any[] = [];
    stars!: number;
    details!: string;
    categoryId!: string;
}