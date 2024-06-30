import AnimatedCounter from './AnimatedCounter'
import DonutChart from './DonutChart'

export default function TotalBalanceBox({
    accounts = [],
    totalBanks,
    totalCurrentBalance
}: TotalBalanceBoxProps) {
    return (
        <section className='total-balance'>
            <div className='total-balance-chart'>
                <DonutChart accounts={accounts} />
            </div>

            <div className='flex flex-col gap-4'>
                <h2 className='header-2'>
                    Bank Accounts: {totalBanks}
                </h2>
                <div className='flex flex-col gap-2'>
                    <p className='total-balance-label'>
                        Total Current Balance
                    </p>
                    <div className='total-balance-amount flex-center gap-2'>
                        <AnimatedCounter amount={totalCurrentBalance} />
                    </div>
                </div>
            </div>
        </section>
    )
}
