export class MyObject{
    _id? : string;
    name : string = "";
    type : number | undefined ;    
    owner: string | undefined;
    premissions: string[] = [];
    stars!: number;
    details!: string;
    categoryId!: string;
}