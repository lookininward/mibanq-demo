import { useState, useCallback, useEffect } from "react"
import { Button } from "./button"
import { useRouter } from "next/navigation"
import { usePlaidLink } from "react-plaid-link"
import { createLinkToken, exchangePublicToken } from "@/lib/actions/user.actions"
import Image from "next/image"

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
                    variant="ghost"
                    className="plaidlink-ghost"
                    onClick={() => open()}
                >
                    <Image
                        src="/icons/connect-bank.svg"
                        alt="Connect Bank"
                        width={24}
                        height={24}
                    />
                    <p className="text-[16px] font-semibold text-black-2 hidden xl:block">
                        Connect Bank
                    </p>
                </Button>
            ) : (
                <Button
                    className="plaidlink-default"
                    onClick={() => open()}
                >
                    <Image
                        src="/icons/connect-bank.svg"
                        alt="Connect Bank"
                        width={24}
                        height={24}
                    />
                    <p className="text-[16px] font-semibold text-black-2">
                        Connect Bank
                    </p>
                </Button>
            )}
        </>
    )
}

export default PlaidLink