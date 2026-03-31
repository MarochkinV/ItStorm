import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-ui-modal',
  templateUrl: './ui-modal.component.html',
  styleUrls: ['./ui-modal.component.scss']
})
export class UiModalComponent {
  @ViewChild('modalElement') modal!: ElementRef<HTMLDialogElement>;
  @Output() onClosed = new EventEmitter<void>();

  open(): void {
    this.modal.nativeElement.showModal();
  }

  close(): void {
    this.modal.nativeElement.close();
    document.body.style.overflow = 'auto';
    this.onClosed.emit();
  }

  handleBackdrop(event: MouseEvent) {
    if (event.target === this.modal.nativeElement) {
      this.close();
    }
  }
}
