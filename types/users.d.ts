declare namespace rossa.users {

  export interface user {

    id: number | undefined;
    username: string;
    email: string;
    password?: string | undefined;
    store?: string;
    
  }
}