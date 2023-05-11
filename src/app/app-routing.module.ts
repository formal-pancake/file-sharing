import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ErrorComponent } from './pages/error/error.component';
import { DasbboardComponent } from './pages/dasbboard/dasbboard.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    }, {
        path: 'dashboard',
        component: DasbboardComponent
    },
    {
        path: '**',
        component: ErrorComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
