'use client';

import CountUp from 'react-countup';

function AnimatedCounter({ amount }: { amount: number }) {
    return (
        <CountUp
            end={amount}
            decimals={2}
            prefix='$'
            decimal=','
            duration={2.75}
        />
    )
}

export default AnimatedCounter