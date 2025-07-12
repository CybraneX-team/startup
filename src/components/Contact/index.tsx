"use client";

import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(
    null
  );

  /* ---- helpers ---- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!form.name || !form.email || !form.message) {
      setAlert({ type: "error", msg: "All fields are required." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");

      setAlert({
        type: "success",
        msg: "Ticket submitted successfully",
      });
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setAlert({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  /* ---- UI ---- */
  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <h1 className="mb-12 text-center text-4xl font-bold text-black dark:text-white">
          Contact Us
        </h1>

        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="rounded-lg bg-white px-10 py-12 shadow-three dark:bg-slate-900 sm:p-14">
            <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
              Need Help? Open a Ticket
            </h2>
            <p className="mb-10 text-base font-medium text-body-color">
              Our support team will get back to you ASAP via email.
            </p>

            {/* Alerts */}
            {alert && (
              <div
                className={`mb-6 rounded-md px-4 py-3 text-sm ${
                  alert.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {alert.msg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-dark dark:text-white"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-stroke bg-[#f8f8f8] px-5 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-dark dark:text-white"
                  >
                    Your Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-stroke bg-[#f8f8f8] px-5 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-dark dark:text-white"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Enter your Message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full resize-none rounded-md border border-stroke bg-[#f8f8f8] px-5 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting…" : "Submit Ticket"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
