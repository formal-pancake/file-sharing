import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})
export class PopupComponent {

    @Input() closeOnOutsideClick = true;
    @Input() isOpen = false;

    show() {
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.isOpen = false;
        document.body.style.overflow = 'auto';
    }

    closeOnOverlayClick() {
        if (this.closeOnOutsideClick) this.hide();
    }
}
