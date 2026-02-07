export default function RefundPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>

      <p className="mb-4">
        Effective Date: {new Date().toLocaleDateString()}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Subscriptions</h2>
      <p>
        Subscription fees are generally non-refundable once the service has
        been used. However, refunds may be provided in case of billing errors
        or service outages.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Pay-Per-View</h2>
      <p>
        Pay-per-view purchases are refundable only if the content cannot be
        played due to a technical issue on our side.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How to Request a Refund</h2>
      <p>
        To request a refund, please contact us with your order details:
      </p>

      <p className="mt-2">
        <strong>support@yourdomain.com</strong>
      </p>
    </main>
  );
}
