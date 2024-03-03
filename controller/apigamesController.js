// import crypto from ("crypto");
// import rp from ("request-promise-native");

// class Apigames {

//     constructor(merchant, secret, signature) {
//       process.env.MERCHANT_ID = merchant;
//       process.env.SECRET = secret;
//       process.env.SIGNATURE = signature;
//       endpoint = "https://v1.apigames.id";
//     }
  
//     async cekSaldo() {
//       const signature = crypto.process.env.SIGNATURE
//         .createHash('md5')
//         .update(`${process.env.MERCHANT_ID}${process.env.SECRET}`)
//         .digest('hex');
//         const merchant = process.env.MERCHANT_ID;
//         const secret = process.env.SECRET;
//         const endpoint = "https://v1.apigames.id";
    
  
//       const options = {
//         method: "GET",
//         uri: `${endpoint}/merchant/:${merchant}?signature=${signature}`,
//         json: true,
//       };
  
//       try {
//         const resp = await rp(options);
//         if (resp.data && typeof resp.data.saldo !== 'undefined') {
//           return resp.data.saldo;
//         } else {
//           throw new Error(resp.data.error_msg || 'Unknown error occurred');
//         }
//       } catch (err) {
//         throw new Error(err.message || 'Error checking balance');
//       }
//     }
  
//     async cekAkunGame(gameCode, userId) {
//         const signature = crypto.process.env.SIGNATURE
//         .createHash('md5')
//         .update(`${process.env.MERCHANT_ID}${process.env.SECRET}`)
//         .digest('hex');
//         const merchant = process.env.MERCHANT_ID;
//         const secret = process.env.SECRET;
//         const endpoint = "https://v1.apigames.id";
    
  
//       const options = {
//         method: "GET",
//         uri: `${endpoint}/merchant/:${merchant}?signature=${signature}`,
//         json: true,
//       };
  
//       try {
//         const resp = await rp(options);
//         if (resp.data && typeof resp.data.saldo !== 'undefined') {
//           return resp.data.saldo;
//         } else {
//           throw new Error(resp.data.error_msg || 'Unknown error occurred');
//         }
//       } catch (err) {
//         throw new Error(err.message || 'Error checking balance');
//       }
//     }
//     }
//   }

//   export default Apigames;