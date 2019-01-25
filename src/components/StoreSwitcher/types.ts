export interface Store {
  url: string;
  name: string;
}

export interface Section {
  name: string;
  stores: Store[];
}
