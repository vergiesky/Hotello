import useAxios from ".";

// yang dikirim setiap component nanti berupa data json dari backend
// return response.data artinya komponen hanya menerima data JSON backend saja, contoh:
//   data: {
//     token: "AAA",
//     user: { id: 1 }
//   }

// kalau axios object:
// misal backend ngirim:
//data:{
//   "token": "AAA",
//   "user": { "id": 1 }
// }
//Axios akan membungkusnya menjadi:
// response = {
//   data: {                 // JSON backend disimpan di sini
//     token: "AAA",
//     user: { id: 1 }
//   },
//   status: 200,            // HTTP code
//   statusText: "OK",
//   headers: { ... },       // header HTTP
//   config: { ... },        // config axios
//   request: {}             // object request
// }

// maka dari itu, perlu return response.data; biar component hanya menerima JSON backend, bukan seluruh objek Axios
const SignUpCustomer = async (data) => {
  const response = await useAxios.post("/register/customer", data);
  return response.data;
};

const SignUpAdmin = async (data) => {
  const response = await useAxios.post("/register/admin", data);
  return response.data;
};

const SignIn = async (data) => {
  const response = await useAxios.post("/login", data);
  return response.data;
};

export { SignUpCustomer, SignUpAdmin, SignIn };
