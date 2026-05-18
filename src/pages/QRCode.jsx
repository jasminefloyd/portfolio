const portfolioUrl = 'https://floyd-portfolio.vercel.app/?utm_source=qr-code'
const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=900x900&format=png&qzone=1&data=${encodeURIComponent(portfolioUrl)}`

export default function QRCodePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#f8fafc_42%,_#ffffff_100%)] px-5 py-8 sm:px-8 sm:py-10">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col items-center justify-center rounded-3xl border border-border/70 bg-white/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-10">
        <h1 className="text-center font-display text-4xl text-text-primary sm:text-5xl">Jasmine Floyd</h1>
        <p className="mt-2 text-center font-sans text-sm uppercase tracking-[0.16em] text-text-secondary sm:text-base">
          Senior AI Product Manager
        </p>
        <p className="mt-3 max-w-xl text-center font-sans text-sm text-text-secondary sm:text-base">
          Scan to open my portfolio.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-white p-4 shadow-[0_14px_32px_rgba(15,23,42,0.1)] sm:p-5">
          <img
            src={qrCodeSrc}
            alt="QR code linking to Jasmine Floyd portfolio"
            className="h-64 w-64 rounded-xl sm:h-[21rem] sm:w-[21rem]"
          />
        </div>

        <p className="mt-6 break-all text-center font-sans text-xs text-text-secondary sm:text-sm">
          {portfolioUrl}
        </p>
      </section>
    </main>
  )
}
