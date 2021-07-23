declare namespace rossa.reviews {

  export interface review {

    id?: number | undefined;
    store: string;
    name: string;
    birthdate: string;
    phone: string;
    email: string;
    suggestions?: string;
    answers?: rossa.reviews.answer[];
    average?: rossa.reviews.average | boolean;
  }

  export interface answer {

    reviewId: number;
    title: string;
    qualification: string;

  }

  export interface average {
    
    percent: number;
    qualification: string;

  }
}