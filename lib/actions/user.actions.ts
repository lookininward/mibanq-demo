'use server';

export const signIn = async ({
    email,
    password,
}: {
    email: string;
    password: string;

}) => {
    try {
        // Mutation, DB, Fetch
        return {};
    } catch (error) {
        console.log(error);
        return {};
    }
};

export const signUp = async (userData: SignUpParams) => {
    try {
        // Mutation, DB, Fetch
        console.log(userData);
        return {};
    } catch (error) {
        console.log(error);
        return {};
    }
};