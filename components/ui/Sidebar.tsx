'use client';

import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Footer from './Footer';

export default function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname()
    return (
        <section className='sidebar'>
            <nav className='flex flex-col gap-4'>
                <Link href='/' className='mb-12 cursor-pointer flex  items-center gap-2'>
                    <Image src='/icons/logo.svg' width={34} height={34} alt='Logo' className='size-[24px] max-xl:size-14' />
                    <h1 className='sidebar-logo'>MiBanq</h1>
                </Link>

                {sidebarLinks.map((item) => {
                    const isActive = item.route === pathname || pathname.startsWith(`${item.route}/`);
                    return (
                        <Link
                            className={
                                cn('sidebar-link', {
                                    'bg-bank-gradient': isActive,
                                })
                            }
                            href={item.route}
                            key={item.label}
                        >
                            <div className='relative size-6'>
                                <Image
                                    src={item.imgURL}
                                    alt={item.label}
                                    className={cn({ 'brightness-[3] invert-0': isActive })}
                                    fill
                                />
                            </div>
                            <p className={
                                cn(
                                    'sidebar-label', {
                                    '!text-white': isActive,
                                }
                                )
                            }>
                                {item.label}
                            </p>
                        </Link>
                    )
                })}

                USER
            </nav>

            <Footer user={user} />
        </section>
    )
}
