export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4">
        Effective Date: {new Date().toLocaleDateString()}
      </p>

      <p className="mb-4">
        Welcome to our streaming website. By accessing or using this website,
        you agree to these Terms of Service. If you do not agree, please do not
        use the service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Eligibility</h2>
      <p>You must be at least 18 years old (or legal age in your country).</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Account Use</h2>
      <ul className="list-disc pl-6">
        <li>Accounts are for personal use only</li>
        <li>Do not share login details</li>
        <li>Accounts may be suspended for misuse or fraud</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Payments</h2>
      <ul className="list-disc pl-6">
        <li>Payments are processed securely</li>
        <li>Subscriptions renew unless canceled</li>
        <li>Pay-per-view access is time-limited</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Content Rights</h2>
      <p>
        All movies and shows are licensed. You may not download, record, copy,
        redistribute, or resell any content.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Service Availability</h2>
      <p>
        We may update or interrupt the service for maintenance without notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Termination</h2>
      <p>
        We may suspend or terminate access if you violate these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Limitation of Liability</h2>
      <p>
        We are not responsible for service interruptions or content availability.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to Terms</h2>
      <p>
        Continued use of the site means you accept updated terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact</h2>
      <p>
        Email: <strong>support@yourdomain.com</strong>
      </p>
    </main>
  );
}
