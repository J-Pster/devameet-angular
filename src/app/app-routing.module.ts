import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard';
import { RegisterGuard } from './guards/register/register.guard';

const routes: Routes = [
  {
    path: 'register',
    canActivate: [RegisterGuard],
    loadChildren: () =>
      import('./pages/register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'profile',
    canActivate: [JwtAuthGuard],
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'new',
    canActivate: [JwtAuthGuard],
    loadChildren: () =>
      import('./pages/meet/pages/new-meet/new-meet.module').then(
        (m) => m.NewMeetModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'edit/:id',
    canActivate: [JwtAuthGuard],
    loadChildren: () =>
      import('./pages/meet/pages/edit-meet/edit-meet.module').then(
        (m) => m.EditMeetModule
      ),
  },
  {
    path: 'meet/:link',
    canActivate: [JwtAuthGuard],
    loadChildren: () =>
      import('./pages/meet/pages/join-meet/join-meet.module').then(
        (m) => m.JoinMeetModule
      ),
  },
  {
    path: 'join',
    canActivate: [JwtAuthGuard],
    loadChildren: () =>
      import('./pages/meet/pages/link-meet/link-meet.module').then(
        (m) => m.LinkMeetModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
