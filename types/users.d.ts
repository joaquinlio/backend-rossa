declare namespace rossa.users {

  export interface user {

    id: number | undefined;
    name: string;
    surname: string;
    email: string;
    password?: string | undefined;
    expToken?: string;
    
  }
}