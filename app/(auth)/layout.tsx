import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}

      <div className="auth-asset pl-6">
        <div>
          <Image
            className="border-t-4 border-l-4 border-b-4 rounded-tl-xl rounded-bl-xl border-slate-700"
            src="/app-screen2.png"
            alt="Auth Image"
            width={600}
            height={600}
          />
        </div>
      </div>
    </main>
  );
}
