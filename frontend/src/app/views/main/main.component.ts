import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleService} from "../../shared/services/article.service";
import {ArticleType} from "../../../types/article.type";
import {FormBuilder, Validators} from "@angular/forms";
import {RequestService} from "../../shared/services/request.service";
import {UiModalComponent} from "../../shared/components/ui-modal/ui-modal.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class MainComponent implements OnInit {
  @ViewChild('orderModal') orderModalComponent!: UiModalComponent;
  @ViewChild('successModal') successModalComponent!: UiModalComponent;

  services: string[] = ['Создание сайтов', 'Продвижение', 'Реклама', 'Копирайтинг'];

  requestForm = this.fb.group({
    service: ['', [Validators.required]],
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9+]*$')]]
  });

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false,
  };
  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
    },
    nav: false,
  };
  articles: ArticleType[] = [];

  constructor(private articleServices: ArticleService,
              private fb: FormBuilder,
              private requestService: RequestService) {
  }

  openModal(event: MouseEvent, serviceTitle: string) {
    event.preventDefault();
    this.requestForm.patchValue({service: serviceTitle});
    this.orderModalComponent.open();
  }

  sendRequest() {
    if (this.requestForm.valid) {
      const rawData = this.requestForm.getRawValue();
      const dataToSend = {
        name: rawData.name as string,
        phone: rawData.phone as string,
        service: rawData.service as string,
        type: 'order'
      };

      this.requestService.postRequest(dataToSend).subscribe({
        next: (response) => {
          if (!response.error) {
            this.orderModalComponent.close();
            this.successModalComponent.open();
            setTimeout(() => this.successModalComponent.close(), 7000);
          }
        },
        error: (err) => {
          console.error('Ошибка бэкенда:', err);
        }
      });
    }
  }


  ngOnInit(): void {
    this.articleServices.getPopArticles()
      .subscribe((data: ArticleType[]) => {
        this.articles = data;
      })
  }

}
