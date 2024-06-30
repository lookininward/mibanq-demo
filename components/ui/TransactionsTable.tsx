import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils"

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor
  } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default;
  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>
        {category}
      </p>
    </div>
  )
}

function TransactionsTable({ transactions }: TransactionTableProps) {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Channel</TableHead>
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions?.map((transaction: Transaction) => {
          const status = getTransactionStatus(new Date(transaction.date));
          const amount = formatAmount(transaction.amount);
          const isDebit = transaction.type === "debit";
          const isCredit = transaction.type === "credit";
          return (
            <TableRow key={transaction.id}>
              <TableCell className="px-2">
                <h1>{removeSpecialCharacters(transaction.name)}</h1>
              </TableCell>
              <TableCell className="px-2">
                {isDebit ? `-$${amount}` : isCredit ? `${amount}` : amount}
              </TableCell>
              <TableCell className="px-2">
                <CategoryBadge category={status} />
                {status}
              </TableCell>
              <TableCell className="px-2">{formatDateTime(new Date(transaction.date)).dateTime}</TableCell>
              <TableCell className="px-2 max-md:hidden">{transaction.paymentChannel}</TableCell>
              <TableCell className="px-2 max-md:hidden">
                <CategoryBadge category={transaction.category} />
                {transaction.category}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>

  )
}

export default TransactionsTable