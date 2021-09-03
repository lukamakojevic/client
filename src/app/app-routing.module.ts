import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CatererComponent } from './caterer/caterer.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WorkerComponent } from './worker/worker.component';
import { CanActivateGuard } from './guard.service';

const routes: Routes = [
  {path: '' , component: WelcomeComponent},
  {path: 'welcome', component: WelcomeComponent},
  {path: 'admin', component: AdminComponent, canActivate: [CanActivateGuard]},
  {path: 'caterer', component: CatererComponent, canActivate: [CanActivateGuard]},
  {path: 'worker', component: WorkerComponent , canActivate: [CanActivateGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
