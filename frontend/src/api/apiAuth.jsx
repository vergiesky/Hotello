import useAxios from ".";

const SignUpCustomer = async (data) => {
    try {
        const response = await useAxios.post("/register/customer", data); // mengirim data ke endpoint /register/customer
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const SignUpAdmin = async (data) => {
    try {
        const response = await useAxios.post("/register/admin", data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const SignIn = async (data) => {
    try {
        const response = await useAxios.post("/login", data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export {SignUpCustomer, SignUpAdmin, SignIn};