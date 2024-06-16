import MobileNav from "@/components/ui/MobileNav";
import Sidebar from "@/components/ui/Sidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = {
    $id: '1',
    firstName: 'Michael',
    lastName: 'Xavier',
    email: 'xyz@gmail.com',
    avatar: '/images/avatar.jpg',
    userId: 'lookininward',
    dwollaCustomerUrl: 'lookininward',
    dwollaCustomerId: 'lookininward',
    address1: '123 Main St.',
    city: 'Toronto',
    state: 'Ontario',
    postalCode: 'M5V 3A4',
    dateOfBirth: '1990-01-01',
    ssn: '1234',
  }

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image
            src='/icons/logo.svg'
            width={30}
            height={30}
            alt={'Menu Icon'}
          />
          <MobileNav user={loggedIn} />
        </div>
        {children}
      </div>
    </main>
  );
}
