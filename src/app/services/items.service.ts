import { Injectable } from '@angular/core';
import {Item} from '../models/item.model';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private isLoading: Subject<boolean> = new Subject<boolean>();
  endpoint = 'https://crudcrud.com/api/38f7da3fee42476394aa192f0b19af5f/items';
  items: Item[] = [];
  currentItem: Item;

  constructor(private http: HttpClient) { }

  setIsLoading(loading: boolean){
    this.isLoading.next(loading);
  }

  getIsLoading(){
    return this.isLoading.asObservable();
  }

  saveItem(item: Item) {
    // this.items.push(item);
    const itemForService = {
      title: item.title,
      cuantity: item.cuantity.toString(),
      image: item.image
    };

    return this.http.post(this.endpoint, itemForService);
  }

  getItems() {
    return this.http.get<[Item]>(this.endpoint);
  }

  getSingleItem(id: string) {
    return this.http.get<Item>(`${this.endpoint}/${id}`);
  }

  updateItem(item: Item) {
    const itemForService = {
      title: item.title,
      cuantity: item.cuantity.toString(),
      image: item.image
    };
    return this.http.put(`${this.endpoint}/${item._id}`, itemForService);
  }

  deleteItem(id: string){
    return this.http.delete(`${this.endpoint}/${id}`);
  }
}
