'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const {
    APPWRITE_DB_ID,
    APPWRITE_USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
    try {
        const { database } = await createAdminClient();
        const user = await database.listDocuments(
            APPWRITE_DB_ID!,
            APPWRITE_USER_COLLECTION_ID!,
            [Query.equal("userId", [userId])]
        );
        return parseStringify(user?.documents[0]);
    } catch (error) {
        console.log(error);
        return {};
    }
}

export const signIn = async ({
    email,
    password,
}: {
    email: string;
    password: string;

}) => {
    try {
        const { account } = await createAdminClient();

        // Create session
        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });;

        const user = await getUserInfo({ userId: session.userId });
        return parseStringify(user);
    } catch (error) {
        console.log(error);
        return {};
    }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
    let newUserAccount;

    try {
        // Create user account
        const { email, firstName, lastName } = userData;
        const name = `${firstName} ${lastName}`;
        const { account, database } = await createAdminClient();
        newUserAccount = await account.create(ID.unique(), email, password, name);

        if (!newUserAccount) throw new Error("User account not created");

        // Create Dwolla customer
        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: "personal",
        });

        if (!dwollaCustomerUrl) throw new Error("Dwolla customer not created");

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

        // Create user in Appwrite database
        const newUser = await database.createDocument(
            APPWRITE_DB_ID!,
            APPWRITE_USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userId: newUserAccount.$id,
                dwollaCustomerId,
                dwollaCustomerUrl,
            }
        );

        // Create session
        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });;

        return parseStringify(newUser);
    } catch (error) {
        console.log(error);
        return {};
    }
};

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        const result = await account.get();
        const user = await getUserInfo({ userId: result.$id });
        return parseStringify(user);
    } catch (error) {
        return null;
    }
}

export const logoutAccount = async () => {
    try {
        const { account } = await createSessionClient();
        cookies().delete("appwrite-session");
        await account.deleteSession("current");
    } catch (error) {
        return null;
    }
};

export const createLinkToken = async (user: User) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id,
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: ["auth"] as Products[],
            language: "en",
            country_codes: ["US"] as CountryCode[],
        }
        debugger;
        const response = await plaidClient.linkTokenCreate(tokenParams);
        return parseStringify({ linkToken: response.data.link_token });
    } catch (error) {
        console.log(error);
        return {};
    }
}

export const createBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    shareableId,
}: createBankAccountProps) => {
    try {
        const { database } = await createAdminClient(); // appwrite client
        const bankAccount = await database.createDocument(
            APPWRITE_DB_ID!,
            APPWRITE_BANK_COLLECTION_ID!,
            ID.unique(),
            {
                userId,
                bankId,
                accountId,
                accessToken,
                fundingSourceUrl,
                shareableId,
            }
        );
        return parseStringify(bankAccount);
    } catch (error) {
        console.log(error);
        return {};
    }
}

export const exchangePublicToken = async ({
    publicToken,
    user
}: exchangePublicTokenProps) => {
    try {
        // Exchange public token for acccess token and item id
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });
        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        // Get account info from Plaid with access token
        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        // Create processor token for Dwolla
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
        };

        const processorTokenResponse = await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;

        // Create funding source url for specific account with dwolla customer id, processor token, bank name
        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        });

        // funding source URL should have been created
        if (!fundingSourceUrl) throw new Error("Funding source URL not created");

        // Create bank account
        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            shareableId: encryptId(accountData.account_id),
        });

        revalidatePath('/');

        return parseStringify({ publicTokenExchange: "complete" });
    } catch (error) {
        console.log(error);
        return {};
    }
}

export const getBanks = async ({ userId }: getBanksProps) => {
    try {
        const { database } = await createAdminClient();
        const banks = await database.listDocuments(
            APPWRITE_DB_ID!,
            APPWRITE_BANK_COLLECTION_ID!,
            [Query.equal("userId", [userId])]
        );
        return parseStringify(banks?.documents);
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const getBank = async ({ documentId }: getBankProps) => {
    try {
        const { database } = await createAdminClient();
        const bank = await database.listDocuments(
            APPWRITE_DB_ID!,
            APPWRITE_BANK_COLLECTION_ID!,
            [Query.equal("$id", [documentId])]
        );
        return parseStringify(bank.documents[0]);
    } catch (error) {
        console.log(error);
        return [];
    }
};