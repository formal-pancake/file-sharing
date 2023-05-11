import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
    dragHover = false;
    files: File[] = []

    importFiles(event: any) {
        const fileList = Array.from(event) as File[];
        this.files = fileList;
        // this.files = this.service.addFiles(fileList);
    }

    onChange(event: any) {
        // this.files = this.service.addFiles(event.target.files)
        this.files = event.target.files;
    }

    getFileSizeMb(file: File) {
        if (file.size < 1000000) {
            return (file.size / 1024).toFixed(2) + " KB";
        } else {
            return (file.size / 1000000).toFixed(2) + " MB";
        }
    }
}
