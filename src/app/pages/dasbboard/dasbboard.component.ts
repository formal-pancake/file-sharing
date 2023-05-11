import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
    selector: 'app-dasbboard',
    templateUrl: './dasbboard.component.html',
    styleUrls: ['./dasbboard.component.scss']
})
export class DasbboardComponent {

    constructor(private supabaseService: SupabaseService) {
        supabaseService.fetchFiles();
    }
}
