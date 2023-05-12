import { EventEmitter, Injectable } from '@angular/core';


export enum Position {
    top = "top",
    // right = "right",
    bottom = "bottom",
    // left = "left"
}


export type snackbarSettings = {
    title: string,
    durationMs: number,
    success: boolean,
    position: Position
}

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    onInit = new EventEmitter<snackbarSettings>();

    init(settings: snackbarSettings) {
        this.onInit.emit(settings);
    }

}
