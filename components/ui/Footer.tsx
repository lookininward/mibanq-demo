import { logoutAccount } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

function Footer({ user, type = "desktop" }: FooterProps) {
    const router = useRouter();
    const handleLogout = async () => {
        const logout = await logoutAccount();
        if (logout) {
            router.push('/sign-in');
        }
    }

    return (
        <footer className='footer hover:bg-[#F2F4F7]'>
            <div className={type === 'mobile' ? 'footer_mobile' : 'footer_name'}>
                <p className='text-xl font-bold text-gray-700'>
                    {user.firstName[0]}
                </p>
            </div>

            <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
                <h1 className='text-14 truncate font-normal font-semibold text-gray-700'>
                    {user.firstName} {user.lastName}
                </h1>
            </div>

            <div 
                className='footer_image'
                onClick={handleLogout}
            >
                <Image
                    src="icons/logout.svg"
                    alt="Logout"
                    width={20}
                    height={20}
                />
            </div>
        </footer>
    )
}

export default Footer