import {observable, makeAutoObservable} from "mobx";

export class Store {

    user = undefined;

    constructor() {
        makeAutoObservable(this);
    }

}

// decorate(User, {
//     user: observable
// })
