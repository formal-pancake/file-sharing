import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UploadComponent } from './components/upload/upload.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { ErrorComponent } from './pages/error/error.component';
import { PopupComponent } from './components/popup/popup.component';
import { LoginComponent } from './components/login/login.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabComponent } from './components/tab/tab.component';

import { DragDropFileUploadDirective } from './directives/drag-drop-file-upload.directive';
import { SnackbarComponent } from './components/snackbar/snackbar.component';


@NgModule({
    declarations: [
        AppComponent,
        DragDropFileUploadDirective,
        UploadComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        ErrorComponent,
        PopupComponent,
        LoginComponent,
        TabsComponent,
        TabComponent,
        SnackbarComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
