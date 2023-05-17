import { Injectable } from '@angular/core';
import { SnackbarService } from './snackbar.service';
import * as JSZip from 'jszip';

@Injectable({
    providedIn: 'root'
})
export class FilesService {

    private _files: File[] = []

    get files() {
        return this._files
    }

    get totalSize() {
        return this.getFilesSize(...this.files)
    }

    maxSizeMb: number;

    constructor(private snackbarService: SnackbarService) {
        this.maxSizeMb = 50
    }

    setFiles(...files: File[]): File[] {
        this._files = files;

        return this.files;
    }

    getFilesSize(...files: File[]) {
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
            return "File(s) exceed(s) max size"

        return
    }

    exceedMaxSize(...files: File[]) {
        return this.getFilesSize(...files).mb.size > this.maxSizeMb
    }

    async zipFiles(...files: File[]) {
        const zip = new JSZip();

        let folder = zip.folder("files");

        files.forEach(file => {
            folder?.file(file.name, file);
        });

        const content = await zip.generateAsync({ type: "blob" });
        return new File([content], Date.now + ".zip", { type: "application/zip" })
    }
}
