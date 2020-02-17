export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  
  s3: {
    REGION: "us-east-1",
    BUCKET: "rednotion-notes-app-uploads"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://9yvj2145x1.execute-api.us-east-1.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_TRllrApcP",
    APP_CLIENT_ID: "4b49hdtiuo10k9fab3fj2g8m9s",
    IDENTITY_POOL_ID: "us-east-1:88735a3d-b61a-4817-9ea6-286f190e80ea"
  }
};