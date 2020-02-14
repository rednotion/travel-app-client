export default {
  MAX_ATTACHMENT_SIZE: 5000000,

  STRIPE_KEY: "pk_test_A6WCjPy3R23AgHC2Ab88NNu1002peJnShW",
  
  s3: {
    REGION: "ap-southeast-1",
    BUCKET: "rednotion-notes-app-uploads"
  },
  apiGateway: {
    REGION: "ap-southeast-1",
    URL: "https://enz1b8466d.execute-api.ap-southeast-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "ap-southeast-1",
    USER_POOL_ID: "ap-southeast-1_v2ltFGA5G",
    APP_CLIENT_ID: "4ie5dop2kp51qunjnsqkj1lu7v",
    IDENTITY_POOL_ID: "ap-southeast-1:e5061b56-efc9-4415-ab7e-f60e0ac109fd"
  }
};