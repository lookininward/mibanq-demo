import HeaderBox from "@/components/ui/HeaderBox"
import PaymentTransferForm from "@/components/ui/PaymentTransferForm"
import { getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

async function Transfer() {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn?.$id });

  if (!accounts) return;

  const accountsData = accounts?.data;

  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Provide any specific details or notes related to the payment transfer"
      />
      <section className="size-full pt-5">
        <PaymentTransferForm
          accounts={accountsData}
        />
      </section>
    </section>
  )
}

export default Transfer 