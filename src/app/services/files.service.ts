import { Injectable } from '@angular/core';
import { SnackbarService } from './snackbar.service';

@Injectable({
    providedIn: 'root'
})
export class FilesService {

    private _files: File[] = []

    get files() {
        return this._files
    }

    get totalSize() {
        return this.getFileSize(...this.files)
    }

    maxSizeMb: number;

    constructor(private snackbarService: SnackbarService) {
        this.maxSizeMb = 50
    }

    setFiles(...files: File[]): File[] {
        this._files = files;
        console.log(this.files);

        return this.files;
    }

    getFileSize(...files: File[]) {
        let size = 0;
        files.forEach(file => {
            size += file.size;
        });

        const kb = () => {
            return {
                size: +(size / 1024).toFixed(2),
                postfix: "KB"
            }
        }

        const mb = () => {
            return {
                size: +(size / 1000000).toFixed(2),
                postfix: "MB"
            }
        }

        return {
            raw: size,
            kb: kb(),
            mb: mb(),
            auto: size < 1000000 ? kb() : mb()
        }
    }

    checkFiles(...files: File[]): string | undefined {
        if (!files.length)
            return "You must provide at least one file"

        if (this.exceedMaxSize(...files))
            return "Files exceed max size"

        return
    }

    exceedMaxSize(...files: File[]) {
        return this.getFileSize(...files).mb.size > this.maxSizeMb
    }
}
