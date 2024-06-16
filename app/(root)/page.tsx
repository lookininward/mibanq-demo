import HeaderBox from '@/components/ui/HeaderBox'
import RightSidebar from '@/components/ui/RightSidebar'
import TotalBalanceBox from '@/components/ui/TotalBalanceBox'

const Home = () => {
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
        <section className='home'>
            <div className='home-content'>
                <header className='home-header'>
                    <HeaderBox
                        type='greeting'
                        title='Welcome'
                        user={loggedIn?.firstName || 'Guest'}
                        subtext='Access and manage your account and transactions efficiently.'
                    />
                    <TotalBalanceBox
                        accounts={[]}
                        totalBanks={1}
                        totalCurrentBalance={1250.35}
                    />
                </header>

                RECENT TRANSACTIONS
            </div>

            <RightSidebar
                user={loggedIn}
                transactions={[]}
                banks={[{ currentBalance: 123.45 }, { currentBalance: 500 }]}
            />
        </section>
    )
}

export default Home