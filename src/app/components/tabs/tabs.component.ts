import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
    @Input() tabs: TabComponent[] = []
    private index = 0;

    get currentTab() {
        return this.tabs[this.index]
    }

    ngOnInit(): void {
        this.currentTab.show();
    }

    nextTab() {
        this.setTab(this.index + 1);
    }

    previousTab() {
        this.setTab(this.index - 1);
    }

    setTab(index: number) {
        // Keep index in bounds of the array
        this.index = index < 0 ? this.tabs.length - 1 : index % this.tabs.length;

        this.tabs.forEach((tab, id) => {
            id == this.index ? tab.show() : tab.hide();
        });
    }
}
