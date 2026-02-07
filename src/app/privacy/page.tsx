export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Effective Date: {new Date().toLocaleDateString()}
      </p>

      <p className="mb-4">
        We respect your privacy. This policy explains how we collect and use
        your information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6">
        <li>Name and email address</li>
        <li>Payment confirmation from our payment provider</li>
        <li>Basic usage data (for analytics and security)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6">
        <li>To create and manage your account</li>
        <li>To process payments</li>
        <li>To provide customer support</li>
        <li>To improve our service</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Cookies</h2>
      <p>
        We use cookies to keep you logged in and improve the user experience.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Sharing</h2>
      <p>
        We do not sell your personal data. We only share data with payment
        processors and essential service providers.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Security</h2>
      <p>
        We use reasonable security measures to protect your data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
      <p>
        You may request access, correction, or deletion of your data by emailing:
      </p>

      <p className="mt-2">
        <strong>support@yourdomain.com</strong>
      </p>
    </main>
  );
}
