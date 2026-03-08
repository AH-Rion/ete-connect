import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Google Sheets API helpers
async function getAccessToken(serviceAccountKey: any): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccountKey.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const enc = (obj: any) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const unsignedToken = `${enc(header)}.${enc(payload)}`;

  // Import the private key
  const pemContent = serviceAccountKey.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");
  const binaryKey = Uint8Array.from(atob(pemContent), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const signedToken = `${unsignedToken}.${btoa(
    String.fromCharCode(...new Uint8Array(signature))
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${signedToken}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

async function clearAndWriteSheet(
  accessToken: string,
  sheetId: string,
  sheetName: string,
  values: any[][]
) {
  const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  // Clear existing data
  await fetch(`${baseUrl}/values/${encodeURIComponent(sheetName)}:clear`, {
    method: "POST",
    headers,
  });

  // Write new data
  if (values.length > 0) {
    await fetch(
      `${baseUrl}/values/${encodeURIComponent(sheetName)}!A1?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ values }),
      }
    );
  }
}

async function ensureSheetExists(
  accessToken: string,
  sheetId: string,
  sheetName: string
) {
  const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  // Get existing sheets
  const res = await fetch(baseUrl, { headers });
  const data = await res.json();
  const existingSheets = data.sheets?.map(
    (s: any) => s.properties?.title
  ) || [];

  if (!existingSheets.includes(sheetName)) {
    await fetch(`${baseUrl}:batchUpdate`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: { title: sheetName },
            },
          },
        ],
      }),
    });
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use the external Supabase instance
    const supabaseUrl = "https://wproesbyazmuzfzwqgtg.supabase.co";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Try to use the external service role key if available, otherwise use the stored one
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all approved alumni
    const { data: alumni, error } = await supabase
      .from("alumni")
      .select("*")
      .order("graduation_year", { ascending: true });

    if (error) throw new Error(`Failed to fetch alumni: ${error.message}`);

    if (!alumni || alumni.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No alumni data to sync" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Group alumni by graduation year (batch)
    const batches: Record<string, any[]> = {};
    const noBatch: any[] = [];

    for (const a of alumni) {
      const year = a.graduation_year ? String(a.graduation_year) : null;
      if (year) {
        if (!batches[year]) batches[year] = [];
        batches[year].push(a);
      } else {
        noBatch.push(a);
      }
    }

    // Get Google credentials
    const serviceAccountKeyStr = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    const sheetId = Deno.env.get("GOOGLE_SHEET_ID");

    if (!serviceAccountKeyStr || !sheetId) {
      throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_SHEET_ID");
    }

    const serviceAccountKey = JSON.parse(serviceAccountKeyStr);
    const accessToken = await getAccessToken(serviceAccountKey);

    const headerRow = [
      "Full Name",
      "Email",
      "Phone",
      "Gender",
      "Date of Birth",
      "City",
      "Country",
      "Department",
      "Degree",
      "Graduation Year",
      "Student ID",
      "Hall of Residence",
      "Employment Status",
      "Job Title",
      "Company",
      "Industry",
      "Years of Experience",
      "Previous Companies",
      "Skills",
      "Salary Range",
      "Willing to Mentor",
      "LinkedIn",
      "Website",
      "Bio",
      "Status",
      "Registered At",
    ];

    const toRow = (a: any) => [
      a.full_name || "",
      a.email || "",
      a.phone || "",
      a.gender || "",
      a.date_of_birth || "",
      a.city || "",
      a.country || "",
      a.department || "",
      a.degree || "",
      a.graduation_year || "",
      a.student_id || "",
      a.hall_of_residence || "",
      a.employment_status || "",
      a.job_title || "",
      a.company || "",
      a.industry || "",
      a.years_of_experience || "",
      a.previous_companies || "",
      a.skills || "",
      a.salary_range || "",
      a.willing_to_mentor ? "Yes" : "No",
      a.linkedin_url || "",
      a.website_url || "",
      a.bio || "",
      a.is_approved ? "Approved" : a.is_rejected ? "Rejected" : "Pending",
      a.created_at ? new Date(a.created_at).toLocaleDateString() : "",
    ];

    // Write "All Alumni" sheet
    await ensureSheetExists(accessToken, sheetId, "All Alumni");
    const allRows = [headerRow, ...alumni.map(toRow)];
    await clearAndWriteSheet(accessToken, sheetId, "All Alumni", allRows);

    // Write batch-wise sheets
    const sortedYears = Object.keys(batches).sort();
    for (const year of sortedYears) {
      const sheetName = `Batch ${year}`;
      await ensureSheetExists(accessToken, sheetId, sheetName);
      const rows = [headerRow, ...batches[year].map(toRow)];
      await clearAndWriteSheet(accessToken, sheetId, sheetName, rows);
    }

    // Write "No Batch" sheet if needed
    if (noBatch.length > 0) {
      await ensureSheetExists(accessToken, sheetId, "No Batch");
      const rows = [headerRow, ...noBatch.map(toRow)];
      await clearAndWriteSheet(accessToken, sheetId, "No Batch", rows);
    }

    const summary = {
      success: true,
      total_alumni: alumni.length,
      batches_synced: sortedYears.length,
      batch_years: sortedYears,
      no_batch_count: noBatch.length,
      synced_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Sync error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
