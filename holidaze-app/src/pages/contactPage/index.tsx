import { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock submission
    setTimeout(() => {
      setLoading(false);
      setForm({ name: "", email: "", message: "" });
      setShowSuccess(true);
    }, 1000);
  };

  const closeModal = () => setShowSuccess(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>

      <form onSubmit={handleSubmit} className="space-y-4  bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl shadow-md">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            aria-label="name input"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            aria-label="email input"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="Your email"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            name="message"
            aria-label="message input"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-3 py-2 border rounded"
            placeholder="Your message"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-green-500">Message Sent!</h2>
            <p className="text-gray-700 mb-6">Thank you for contacting us. We will get back to you soon.</p>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
