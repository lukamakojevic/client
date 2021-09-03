export class Tax{
    _id : string | undefined;
    objectId : string | undefined;
    catererId : string | undefined;
    guest: any;
    price: number = 0;
    paid: boolean = false;
    billInfo: any;
}
