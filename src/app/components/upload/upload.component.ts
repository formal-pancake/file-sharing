import { Component, EventEmitter, Output } from '@angular/core';
import { FilesService } from 'src/app/services/files.service';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
    dragHover = false;
    files: File[] = [];

    get totalSize() {
        return this.getFileSizeString(...this.files)
    }

    get isFilesTooBig() {
        return this.filesService.exceedMaxSize(...this.files)
    }

    constructor(private filesService: FilesService) {
        this.files = filesService.files;

        filesService.onChange.subscribe(files => {
            this.files = files;
        })
    }

    importFiles(event: any) {
        const fileList = Array.from(event) as File[];
        this.filesService.setFiles(...fileList);
    }

    onChange(event: any) {
        this.filesService.setFiles(...event.target.files);
    }

    getFileSizeString(...files: File[]) {
        return this.filesService.getFilesSize(...files).auto
    }
}
