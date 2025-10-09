import { createStore, Store, AnyAction } from "redux";

let reducer = (state: any) => state;

type ExtStore = Store & { age: number; home: string };

let store: ExtStore = createStore(reducer);
store.age;