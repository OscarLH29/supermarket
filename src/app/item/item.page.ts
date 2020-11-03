import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ItemsService} from '../services/items.service';
import {Item} from '../models/item.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {

  formItem: FormGroup;
  id: string;
  image: string;

  constructor(private fb: FormBuilder,
              private camera: Camera,
              private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private itemsService: ItemsService) {
    this.formItem = fb.group({
      titulo: ['', Validators.required ],
      cantidad: ['', [Validators.required, Validators.min(1)]]
    });
    this.route.queryParams.subscribe(params => {
        console.log(params);
        if (params.id){
            this.id = params.id;
            this.itemsService.setIsLoading(true);
            this.itemsService.getSingleItem(this.id)
                .subscribe(res => {
                    this.formItem.get('titulo').setValue(res.title);
                    this.formItem.get('cantidad').setValue(res.cuantity);
                    this.image = res.image;
                    this.itemsService.setIsLoading(false);
                });
        }
    });
    // if (this.itemsService.currentItem !== null) {
    //     this.itemsService.getSingleItem(this.itemsService.currentItem._id)
    //         .subscribe(res => {
    //             this.formItem.get('titulo').setValue(res.title);
    //             this.formItem.get('cantidad').setValue(res.cuantity);
    //
    //         });
    // }
  }

  ngOnInit() {
  }

  save() {
      const item = new Item();
      item.title = this.formItem.get('titulo').value;
      item.cuantity = this.formItem.get('cantidad').value;

      if (this.image){
          item.image = this.image;
      }

      this.itemsService.setIsLoading(true);
      if (this.id) {
          item._id = this.id;
          this.itemsService.updateItem(item)
              .subscribe(data => {
                  console.log(data);
                  this.router.navigate(['list']);
                  this.itemsService.setIsLoading(false);
              }, error => {
                  console.log(error);
                  alert('error al agregar');
              });
      } else {
          this.itemsService.saveItem(item)
              .subscribe(data => {
                  console.log(data);
                  this.router.navigate(['list']);
              }, error => {
                  console.log(error);
                  this.itemsService.setIsLoading(false);
                  alert('error al agregar');
              });
      }
  }

  delete() {
        // console.log('click', this.id);
        this.itemsService.setIsLoading(true);
        this.itemsService.deleteItem(this.id)
            .subscribe(data => {
                console.log(data);
                this.router.navigate(['list']);
                this.itemsService.setIsLoading(false);
            }, error => {
                console.log(error);
                this.itemsService.setIsLoading(false);
                alert('error al eliminar');
            });
    }

  addPhoto(){
      const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
      };

      this.camera.getPicture(options).then((imageData) => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64 (DATA_URL):
          let base64Image = 'data:image/jpeg;base64,' + imageData;
          this.image = base64Image;
      }, (err) => {
          // Handle error
          console.log(err);
          alert('Error al tomar foto')
      });
  }
}
