import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {RemoteService} from '../../services/remote/remote.service'
import {UploadModel} from "../../services/models/upload.model";
import {Router} from "@angular/router";

@Component({
  selector: 'bull-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  upload: FormGroup;
  model: UploadModel;
  uploadFail: boolean;
  titleFail: boolean;
  imageFail: boolean;
  categoryFail: boolean;
  descriptionFail: boolean;
  validCategory: boolean = false;
  ifNotValid: boolean;
  category;
  categoriesArr: any;

  constructor(private router: Router, private fb: FormBuilder, private remoteService: RemoteService) {
    this.model = new UploadModel('', '', '', '', localStorage.getItem('username'), 0)
  }

  ngOnInit() {
    let arr = [];

    this.upload = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(22)]],
      image: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    this.remoteService.getCategories().subscribe((data) => {
        for (let obj in data) {
          arr.push(data[obj]['category']);
        }
      },
      err => {
        console.log(err.message);
      });

    this.categoriesArr = arr;

  }

  onChange(category) {
    this.category = category;

  }


  submit() {
    this.model.title = this.upload.value['title'];
    this.model.image = this.upload.value['image'];
    this.model.category = this.category;
    this.model.description = this.upload.value['description'];


    //NOTIFICATIONS
    if (this.model.title === '') {
      this.titleFail = true;
      return
    }
    else if (this.model.image === '') {
      this.titleFail = false;
      this.imageFail = true;
      return
    }
    else if (this.category === '' || this.category === null || this.category === undefined) {
      this.imageFail = false;
      this.categoryFail = true;
      return
    }
    else if (this.model.description === '') {
      this.categoryFail = false;
      this.descriptionFail = true;
      return
    }


    // IF USER TRIES MANUALLY TO ADD CATEGORY FROM HTML
    this.categoriesArr.map(data => {
      if (data == this.model.category) {
        this.validCategory = true;
      }
    });

    if (!this.validCategory) {
      this.ifNotValid = true;
      return
    }
    /////////////////////////////

    this.remoteService.upload(this.model).subscribe(data => {
        this.successfulUpload();
      },
      err => {
        console.log(err.message);
        this.uploadFail = true;
      })
  }

  successfulUpload(): void {
    this.categoriesArr.push(this.category);
    this.uploadFail = false;
    this.router.navigate(['/']);
  }


}
