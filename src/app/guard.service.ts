import { Injectable }  from '@angular/core';
import { Observable }  from 'rxjs';
import { ActivatedRouteSnapshot,
         RouterStateSnapshot, 
         CanActivate,
         Router}  from '@angular/router';
import { LoginService } from './login.service';
import { User } from './models/user';

@Injectable()
export class CanActivateGuard implements CanActivate {
    constructor(private router:Router , private loginService: LoginService){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

        let user = localStorage.getItem('loggedIn');

        if (user && user != "") {

            let userObject = JSON.parse(user);            
          
            return this.loginService.loginCheck(userObject.username , userObject.password);
           

        }else{
           
            this.router.navigate(['']);        
            return false;
        }     

    }
}