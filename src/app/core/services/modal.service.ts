import { Injectable } from "@angular/core";
import { ModalComponent } from "../components/modal/modal.component";

@Injectable({
  providedIn: 'root',
})
export class ModalService {
private modals: ModalComponent[] = []
add(modal: ModalComponent){
  if(!modal.id || this.modals.find(x => x.id === modal.id)){
    // throw new Error('modal must have a unique id attribute');
    console.log('modal must have a unique id attribute')
  }
  this.modals.push(modal);
}

remove(modal: ModalComponent) {
  this.modals = this.modals.filter(x => x === modal);
}

open(id: string) {
  console.log('id',id)
  // open modal specified by id
  const modal = this.modals.find(x => x.id === id);

  if (!modal) {
      throw new Error(`modal '${id}' not found`);
  }

  modal.open();
}

close() {
  // close the modal that is currently open
  const modal = this.modals.find(x => x.isOpen);
  modal?.close();
}
}