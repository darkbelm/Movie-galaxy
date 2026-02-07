export default function DMCAPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">DMCA & Copyright Policy</h1>

      <p className="mb-4">
        Effective Date: {new Date().toLocaleDateString()}
      </p>

      <p className="mb-4">
        We respect the intellectual property rights of others and expect our
        users to do the same.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Reporting Copyright Infringement
      </h2>

      <p className="mb-4">
        If you believe that content available on this website infringes your
        copyright, please send a written notice with the following information:
      </p>

      <ul className="list-disc pl-6">
        <li>Your full name and contact information</li>
        <li>The title of the copyrighted work</li>
        <li>The URL of the allegedly infringing content</li>
        <li>
          A statement that you believe in good faith that the use is not
          authorized by the copyright owner
        </li>
        <li>
          A statement that the information you provide is accurate and that you
          are the copyright owner or authorized to act on their behalf
        </li>
        <li>Your electronic or physical signature</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Submit Notices To</h2>

      <p>
        Email: <strong>support@yourdomain.com</strong>
      </p>

      <p className="mt-4">
        Upon receiving a valid notice, we will review and remove the content if
        required by law.
      </p>
    </main>
  );
}
