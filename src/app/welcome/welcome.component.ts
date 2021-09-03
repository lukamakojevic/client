import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  username : string = "";
  password : string = "";

  message : string = "";

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
  }

  login() {
    
    this.message = "";
    
    this.loginService.login(this.username , this.password).subscribe( (user: any) => {
      
      if(user.type != undefined){

        localStorage.setItem('loggedIn', JSON.stringify(user));

        if(user.type == 0 ){

          this.router.navigate(['admin']);
        }
        else if(user.type == 1 ){

          this.router.navigate(['caterer']);

        }else if(user.type == 2 ){

          this.router.navigate(['worker']);
        }
        
      }
      else{

        localStorage.clear();
        this.message = user;

      }
    });
  }

}
