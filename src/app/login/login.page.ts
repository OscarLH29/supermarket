import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ItemsService} from '../services/items.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formLogin: FormGroup;

  constructor(private fb: FormBuilder, private httClient: HttpClient, private router: Router, private itemService: ItemsService) {
    this.formLogin = fb.group({
      email: ['eve.holt@reqres.in', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)] ],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
  }

  login() {
    if (this.formLogin.invalid){
      alert('Ingresa los datos correctamente');
      return;
    }

    // const body = {
    //   email: this.formLogin.get('email').value,
    //   password: this.formLogin.get('password').value
    // };

    // const formVal = this.formLogin.value;
    this.itemService.setIsLoading(true);
    this.httClient.post('https://reqres.in/api/login', this.formLogin.value)
        .subscribe(res => {
          console.log('res', res);
          // this.router.navigate(['home']);
          this.router.navigate(['list']);
          this.itemService.setIsLoading(false);
        }, error => {
          console.log('error http', error);
          this.itemService.setIsLoading(false);
          alert(error.error.error);
        });


  }

}
