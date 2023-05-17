import { Component, ViewChild } from '@angular/core';
import { PopupComponent } from 'src/app/components/popup/popup.component';
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

    @ViewChild('loadingPopup', { static: true })
    popupRef: PopupComponent | null = null;

    uploadFiles() {
        this.popupRef?.show();
        this.supabaseService.uploadFiles(...this.filesService.files).then(() => {
            this.popupRef?.hide();
        })
    }
}
