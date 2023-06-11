import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid} from 'uuid';
import { last } from 'rxjs/operators';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  isDragover = false
  file: File | null = null
  nextStep = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Your clip is beeing uploaded'
  inSubmission = false
  percentage = 0
  showPercentage = false
  constructor(private storage: AngularFireStorage) {}
  title = new FormControl('',{
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })
  uploadForm =new FormGroup({
    title: this.title
  })

  storeFile($event: Event) {
    this.isDragover = false
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null
    console.log(this.file)
    if(!this.file || this.file.type !== 'video/mp4') {
      return
    }
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/,'')
    )
    this.nextStep = true
  }
  uploadFile() {
    this.showAlert = true
    this.alertColor ='blue'
    this.alertMsg = 'Please wait! Your clip is being uploaded.'
    this.inSubmission = true
    this.showPercentage = true
    const clipFileName = uuid()
    const clipPath =`clips/${this.file?.name}.mp4`
    const task = this.storage.upload(clipPath, this.file)
    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number /100
    })
    task.snapshotChanges().pipe(
      last()
    ).subscribe({
      next: (snapshot) => {
        this.alertColor ='green'
        this.alertMsg = 'Success! Your clip is now ready to share with the world !'
        this.showPercentage = false
      },
      error: (error) => {
        this.alertColor = 'red'
        this.alertMsg = 'Upload failed! Please try again later.'
        this.inSubmission = true
        this.showPercentage = false
        console.error(error)
      }
    })
  }  
}
