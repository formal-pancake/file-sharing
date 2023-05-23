import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
    selector: 'app-dasbboard',
    templateUrl: './dasbboard.component.html',
    styleUrls: ['./dasbboard.component.scss']
})
export class DasbboardComponent {
    files: any[] | null = [];

    constructor(private supabaseService: SupabaseService) {
        supabaseService.fetchFiles().then(files => {
            this.files = files ?? null
        });
    }
}
