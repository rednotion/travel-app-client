export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  
  s3: {
    REGION: "us-east-1",
    BUCKET: "rednotion-notes-app-uploads"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://enz1b8466d.execute-api.ap-southeast-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_zmsYOxHfn",
    APP_CLIENT_ID: "58o48s2m5671bm4lvjen6v7pgc",
    IDENTITY_POOL_ID: "us-east-1:e88adfe8-6df9-49ba-81c5-166ca4a016d2"
  }
};