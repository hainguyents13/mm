import type { APIRoute } from "astro";
import { Resend } from "resend";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ message: "Missing required fields." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const data = await resend.emails.send({
      from: "Contact Form <noreply@yourdomain.com>",
      to: ["hainguyen.ts13@gmail.com"], // Change to your email
      subject: `New Contact Form Submission from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message}</p>`,
    });
    if (data.error) {
      return new Response(
        JSON.stringify({ message: "Failed to send message." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new Response(
      JSON.stringify({ message: "Message sent successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ message: "Something went wrong!" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
