import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss']
})
export class TabComponent {
    @Input() name: string = "New tab";
    isHidden: boolean = true;

    @ViewChild('template', { static: true })
    templateRef: TemplateRef<any> | null = null;

    show() {
        this.isHidden = false;
    }

    hide() {
        this.isHidden = true;
    }
}
