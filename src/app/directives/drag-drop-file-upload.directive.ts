import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appDragDropFileUpload]'
})
export class DragDropFileUploadDirective {

    @Output() fileDropped = new EventEmitter<any>();
    @Output() dragHover = new EventEmitter<any>();


    // Dragover event
    @HostListener('dragover', ['$event']) public dragOver(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.dragHover.emit(true);
    }

    // Dragleave Event
    @HostListener('dragleave', ['$event']) public dragLeave(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.dragHover.emit(false);
    }


    // Drop Event
    @HostListener('drop', ['$event']) public drop(event: any) {
        event.preventDefault();
        event.stopPropagation();

        // Get files from event and remove folders and empty files
        const files = Array.from(event.dataTransfer.files).filter((f: any) => f.size != 0) as File[];

        if (files.length > 0)
            this.fileDropped.emit(files);

        this.dragHover.emit(false);
    }
}