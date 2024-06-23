import { useState, useCallback, useEffect } from "react"
import { Button } from "./button"
import { useRouter } from "next/navigation"
import { usePlaidLink } from "react-plaid-link"
import { createLinkToken, exchangePublicToken } from "@/lib/actions/user.actions"

function PlaidLink({
    user,
    variant,
}: PlaidLinkProps) {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken(user);
            setToken(data?.linkToken);
        }
        getLinkToken();
    }, [user])

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        const data = await exchangePublicToken({
            publicToken: public_token,
            user
        });

        router.push('/');
    }, [user])

    const config: PlaidLinkOptions = {
        token,
        onSuccess,
    }

    const { open, ready } = usePlaidLink(config);

    return (
        <>
            {variant === 'primary' ? (
                <Button
                    className="plaidlink-primary"
                    onClick={() => open()}
                    disabled={!ready}
                >
                    Connect Bank
                </Button>
            ) : variant === 'ghost' ? (
                <Button
                    className="plaidlink-ghost"
                    onClick={() => {
                        console.log('Linking bank account...')
                    }}
                >
                    Connect Bank
                </Button>
            ) : (
                <Button
                    className="plaidlink-default"
                    onClick={() => {
                        console.log('Linking bank account...')
                    }}
                >
                    Connect Bank
                </Button>
            )}
        </>
    )
}

export default PlaidLink