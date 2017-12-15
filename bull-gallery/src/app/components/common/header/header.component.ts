import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';

import {Router, RouterModule, RouterLink} from '@angular/router';
import {RemoteService} from "../../../services/remote/remote.service";
import {CommonModule} from "@angular/common/src/common";

@Component({
  selector: 'bull-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public username: string;
  public avatar: string;
  public categoriesArr: any;
  public role: string;

  constructor(public remoteService: RemoteService, private router: Router) {
    this.username = localStorage.getItem('username');

  }


  ngOnInit() {
    this.dropdown();
    let arr = [];

    this.remoteService.userDetails().subscribe(data => {
        this.avatar = data[0]['avatar'];
        this.role = data[0]['role'];
      },
      err => {
        console.log(err.message);
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

  clickCategory(categ){
    this.router.navigate([`/category/${categ}`]);
    window.location.reload();
  }

  private dropdown() {
    // console.log('in dropdown');

    $('.dropdown').click(function (e) {
      e.preventDefault();
      $(this).next('.dropdown-content').slideToggle('fast');
    });

    $('.mobile-dropdown').click(function (e) {
      e.preventDefault();
      $(this).next('.mobile-dropdown-content').slideToggle('fast');
    });


    $('#nav-icon4').click(function () {
      $(this).toggleClass('open');
      $('.mobile-menu').slideToggle();
    });
  }

  dropdown2() {
    $('.dropdown2').click(function (e) {
      console.log('in 2');
      e.preventDefault();
      if ($('.dropdown2').hasClass('up')) {
        $(this).next('.dropdown-content2').removeClass('up').addClass('down').slideDown('fast');
      }
    });

    $('.dropdown2').click(function (e) {
      console.log('in 2');
      e.preventDefault();
      if ($('.dropdown2').hasClass('down')) {
        $(this).next('.dropdown-content2').removeClass('down').addClass('up').slideUp('fast');
      }
    });

  }


  loggedIn() {
    return !!localStorage.getItem('authtoken');
  }

  isAdmin(){
    if(this.role === 'admin'){
        return true
    }
    return false
  }

  logout() {
    this.remoteService.logout().subscribe(data => {
      localStorage.clear();
      this.router.navigate(['/login']);
      // window.location.reload();
    });

  }
}
