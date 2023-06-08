import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  }
  showAlert = false
  alertMsg = 'Please wait! Your account is being created.'
  alertColor = 'blue'
  inSubmision = false
  constructor(
    private auth: AngularFireAuth
  ) { }

  ngOnInit(): void {
  }

  async login() {
    this.showAlert = true
    this.alertMsg = 'Please wait the login process !'
    this.alertColor = 'blue'
    this.inSubmision = true
    try{
       await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
       )
    } catch(e) {
      console.error(e)
      this.alertMsg = 'Failed to login !'
      this.alertColor = 'red'
      this.inSubmision = false
      return
    }
    this.alertMsg = 'Login succesfull !'
    this.alertColor = 'green'
    this.inSubmision = false


  }

}
