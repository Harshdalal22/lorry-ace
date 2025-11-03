const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendLREmailRequest {
  to: string;
  lrNo: string;
  pdfBase64: string;
  lrDetails: {
    from_place: string;
    to_place: string;
    truck_no: string;
    date: string;
  };
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, lrNo, pdfBase64, lrDetails }: SendLREmailRequest = await req.json();

    console.log("Sending LR email to:", to);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SSK Cargo Services <onboarding@resend.dev>",
        to: [to],
        subject: `LR Document - ${lrNo}`,
        html: `
          <h2>LR Document - ${lrNo}</h2>
          <p>Dear Customer,</p>
          <p>Please find attached the LR document with the following details:</p>
          <ul>
            <li><strong>LR No:</strong> ${lrNo}</li>
            <li><strong>From:</strong> ${lrDetails.from_place}</li>
            <li><strong>To:</strong> ${lrDetails.to_place}</li>
            <li><strong>Truck No:</strong> ${lrDetails.truck_no}</li>
            <li><strong>Date:</strong> ${new Date(lrDetails.date).toLocaleDateString('en-GB')}</li>
          </ul>
          <p>Best regards,<br>SSK Cargo Services Pvt Ltd</p>
          <p style="font-size: 12px; color: #666;">
            Shop No-37, New Anaj Mandi, Sampla, Rohtak -124501<br>
            Contact: 7834819005, 8929920007<br>
            Email: sskcargoservices@gmail.com
          </p>
        `,
        attachments: [
          {
            filename: `LR_${lrNo}.pdf`,
            content: pdfBase64,
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    const responseData = await emailResponse.json();
    console.log("Email sent successfully:", responseData);

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
