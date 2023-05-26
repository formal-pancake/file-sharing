import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})
export class PopupComponent {

    @Input() closeOnOutsideClick = true;
    @Input() isOpen = false;
    @Input() args: any[] = [];

    show(...args: any[]) {
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        this.args = args;
    }

    hide() {
        this.isOpen = false;
        document.body.style.overflow = 'auto';
    }

    closeOnOverlayClick() {
        if (this.closeOnOutsideClick) this.hide();
    }
}
