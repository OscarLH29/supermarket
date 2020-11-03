import { Component, OnInit } from '@angular/core';
import {Item} from '../models/item.model';
import {ItemsService} from '../services/items.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  items: Item[] = [];

  constructor(private itemService: ItemsService, private router: Router) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
    // this.items = this.itemService.items;
    this.itemService.setIsLoading(true);
    this.itemService.getItems()
        .subscribe(res => {
          this.items = res;
          this.itemService.setIsLoading(false);
        }, error => {
          console.log(error);
          this.itemService.setIsLoading(false);
        });
  }

  new() {
    this.itemService.currentItem = null;
    this.router.navigate(['item']);
  }

  edit(item: Item){
    this.itemService.currentItem = item;
    // this.router.navigate(['item']);
    this.router.navigateByUrl('/item?id=' + item._id);
  }

}
