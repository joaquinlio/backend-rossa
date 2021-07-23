declare namespace rossa.mail {

    export interface mailData {
        to: string;
        subject: string;
        text?: string;
        html?: string;
      }
  }