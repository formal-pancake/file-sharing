import { Component } from '@angular/core';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { Position, SnackbarService } from 'src/app/services/snackbar.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
    selector: 'app-dasbboard',
    templateUrl: './dasbboard.component.html',
    styleUrls: ['./dasbboard.component.scss']
})
export class DasbboardComponent {
    files: any[] | null = [];

    constructor(
        private supabaseService: SupabaseService,
        private snackbarService: SnackbarService
    ) {
        supabaseService.fetchFiles().then(files => {
            this.files = files ?? null;
        });
    }

    createUrl(file: any, durationSeconds: number) {
        console.log(file.description);

        this.supabaseService
            .generateUploadUrl(file.id, durationSeconds)
            .then(value => {
                if (!value) return
                if (!value.data?.signedUrl) return

                navigator.clipboard.writeText(value.data?.signedUrl)
                    .then(() => {
                        this.snackbarService.init({
                            title: "Url copied to clipboard",
                            durationMs: 3500,
                            position: Position.top,
                            success: true
                        })
                    })
                    .catch(err => {
                        console.error(err);
                        this.snackbarService.init({
                            title: "Could not copy url to clipboard",
                            durationMs: 3500,
                            position: Position.top,
                            success: false
                        })
                    })
            })
            .catch(err => {
                console.error(err);
                this.snackbarService.init({
                    title: err.message,
                    durationMs: 3500,
                    position: Position.top,
                    success: false
                })
            })
    }

    async downloadFile(file: any) {
        try {
            const { data } = await this.supabaseService.downloadFile(file.id)
            if (data instanceof Blob) {
                const objectURL = URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = objectURL;
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                throw new Error('Downloaded data is not a Blob');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error downloading image: ', error.message)
            }

            throw error;
        }
    }

    popupDelete(file: any, popupRef: PopupComponent) {
        this.deleteFile(file);
        popupRef.hide();
    }

    async deleteFile(file: any) {
        this.supabaseService.deleteFile(file.id)
            .then(() => {
                this.files?.splice(this.files?.indexOf(file), 1);
            })
            .catch(err => {
                console.error(err);

            })
    }

    popupRename(file: any, name: string, popupRef: PopupComponent) {
        this.renameFile(file, name);
        popupRef.hide();
    }

    renameFile(file: any, name: string) {
        this.supabaseService.editFileName(file.id, name)
            .then(() => {
                if (!this.files) return

                const index = this.files.indexOf(file);
                this.files[index].name = name;

            })
            .catch(err => {
                console.error(err);
            })
    }
}
