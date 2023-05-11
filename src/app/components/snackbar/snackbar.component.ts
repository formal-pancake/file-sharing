import { Component } from '@angular/core';
import { Position, SnackbarService } from 'src/app/services/snackbar.service';

@Component({
    selector: 'app-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent {
    private _visible = false;
    private _success = true;
    private _durationMs = 3600;
    private _position: Position = Position.top;
    private _title = "Snack bar works";
    private timeout: NodeJS.Timeout | undefined;

    get visible() {
        return this._visible
    }

    get title() {
        return this._title
    }

    get success() {
        return this._success
    }

    get position() {
        return this._position
    }

    get duration() {
        return this._durationMs
    }

    private set visible(v: boolean) {
        this._visible = v
    }

    constructor(private snackbarService: SnackbarService) {
        snackbarService.onDisplay.subscribe(({ title, durationMs, position, success }) => {
            this.close(); // close the snackbar if one was already playing

            this._title = title;
            this._durationMs = durationMs;
            this._position = position;
            this._success = success;

            this.show();
        })
    }

    show() {
        this.visible = true

        // save the timeout to be able to clear it in case of a new snackbar having to display
        this.timeout = setTimeout(() => {
            this.close();
        }, this._durationMs)
    }

    close() {
        this.visible = false
        clearTimeout(this.timeout);
    }
}
