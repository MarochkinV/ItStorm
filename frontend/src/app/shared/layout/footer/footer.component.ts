import {Component, OnInit, ViewChild} from '@angular/core';
import {filter} from "rxjs/operators";
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";
import {RequestService} from "../../services/request.service";
import {UiModalComponent} from "../../components/ui-modal/ui-modal.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @ViewChild('orderModal') orderModalComponent!: UiModalComponent;
  @ViewChild('successModal') successModalComponent!: UiModalComponent;
  requestForm = this.fb.group({
    service: [{value: '', disabled: true}, Validators.required],
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9+]*$')]]
  });


  activeFragment: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private router: Router,
              private fb: FormBuilder,
              private requestService: RequestService) {
  }

  openModal(event: MouseEvent, serviceTitle: string): void {
    event.preventDefault();
    this.requestForm.patchValue({service: serviceTitle});
    this.orderModalComponent.open();
  }

  sendRequest(): void {
    if (this.requestForm.valid) {
      const rawData = this.requestForm.getRawValue();
      const dataToSend = {
        name: rawData.name as string,
        phone: rawData.phone as string,
        service: rawData.service as string,
        type: 'order'
      };
      this.requestService.postRequest(dataToSend).subscribe({
        next: (response): void => {
          if (!response.error) {
            this.orderModalComponent.close();
            this.successModalComponent.open();
            setTimeout((): void => this.successModalComponent.close(), 7000);
          }
        }
      });
    }
  }

  ngOnInit(): void {
    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((): void => {
        this.updateActiveFragment();
      })
    );
    this.updateActiveFragment();
  }

  updateActiveFragment(): void {
    const fragment: string | null = this.router.parseUrl(this.router.url).fragment;
    this.activeFragment = fragment || '';
  }

  isActive(fragment: string): boolean {
    return this.activeFragment === fragment;
  }
}
