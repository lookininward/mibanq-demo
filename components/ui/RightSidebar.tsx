'use client';

import BankCard from "./BankCard";
import Category from "./Category";
import PlaidLink from "./PlaidLink";
import { countTransactionCategories } from "@/lib/utils";

export default function RightSidebar({
    user,
    transactions,
    banks
}: RightSidebarProps) {
    const categories: CategoryCount[] = countTransactionCategories(transactions);
    return (
        <aside className="right-sidebar">
            <section className="banks">
                <div className="flex w-full justify-between items-center">
                    <h2 className="header-2">
                        My Accounts
                    </h2>
                    <PlaidLink user={user} />
                </div>

                {banks?.length > 0 && (
                    <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
                        <div className="relative z-10">
                            <BankCard
                                key={banks[0].$id}
                                account={banks[0]}
                                userName={`${user.firstName} ${user.lastName}`}
                                showBalance={false}
                            />
                        </div>

                        {banks[1] && (
                            <div className="absolute right-0 top-8 z-0 w-[90%]">
                                <BankCard
                                    key={banks[1].$id}
                                    account={banks[0]}
                                    userName={`${user.firstName} ${user.lastName}`}
                                    showBalance={false}
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-10 flex flex-1 flex-col gap-6">
                    <h2 className="header-2">
                        Top Categories
                    </h2>

                    <div className="space-y-5">
                        {categories.map((c, idx) => {
                            return (
                                <Category
                                    key={c.name}
                                    category={c}
                                />
                            )
                        })}
                    </div>

                </div>
            </section>
        </aside>
    )
}
