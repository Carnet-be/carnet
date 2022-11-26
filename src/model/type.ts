
//Auth
export type TLogin={
  email:string,
  password:string
}
export type PSignup={
  username:string,
  email:string,
  tel:string
}
export type TSignup = PSignup&{
    confirmPassword:string
    password:string,
  };
  
export type TSignupAuc = TSignup;

export type TSignupBidder = TSignup&{
    nomEntreprise:string
  };

  //
  export type UserType="BID"|"AUC"|"ADMIN"|"STAFF"
  export type Utilisateur =PSignup&{
  
    type:UserType,//BID=bidder AUC=auctionnaire

  }