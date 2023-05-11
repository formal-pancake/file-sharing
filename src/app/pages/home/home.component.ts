import { Component } from '@angular/core';
import { FilesService } from 'src/app/services/files.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    constructor(
        private filesService: FilesService,
        private supabaseService: SupabaseService
    ) {

    }

    uploadFiles() {
        this.supabaseService.uploadFiles(...this.filesService.files);
    }
}
