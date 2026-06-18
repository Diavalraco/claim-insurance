const SYSTEM_PROMPT = `You are an expert US healthcare insurance claim auditor with 20 years experience in medical billing fraud detection. You analyze insurance claims and EOB (Explanation of Benefits) reports to detect fraud, errors, and suspicious patterns.`;

function buildUserPrompt(claimText) {
  return `Analyze the following US insurance claim or EOB report for legitimacy.

CLAIM TEXT:
${claimText}

Check for these red flags:
1. CPT and ICD code mismatch (procedure does not match diagnosis)
2. Missing required fields: NPI, Date of Service, Authorization number, Provider name
3. Billing anomalies: billed amount vs allowed amount gap > 3x
4. Duplicate dates of service
5. Upcoding signs (procedure billed at higher complexity than justified)
6. Unbundling (procedures that should be billed together billed separately)
7. Services not matching patient demographics (e.g. male patient with maternity codes)
8. Provider not matching specialty for billed procedure

Respond ONLY in this exact JSON format, no markdown, no extra text:
{
  "score": <integer 0-100, where 100 = definitely legitimate, 0 = definitely fraud>,
  "risk": "<Low|Medium|High>",
  "recommendation": "<Approve|Review|Reject>",
  "summary": "<2 sentence plain English summary>",
  "flags": [
    {
      "type": "<category of issue>",
      "severity": "<Low|Medium|High>",
      "detail": "<specific explanation of what was found>"
    }
  ],
  "extracted_fields": {
    "patient_name": "<or null>",
    "provider_name": "<or null>",
    "date_of_service": "<or null>",
    "cpt_codes": ["<list>"],
    "icd_codes": ["<list>"],
    "billed_amount": "<or null>",
    "allowed_amount": "<or null>",
    "insurance_type": "<Medicare|Medicaid|Commercial|Unknown>"
  }
}

Score guide:
90-100 = Clean claim, approve
70-89  = Minor issues, review recommended
50-69  = Multiple issues, flag for manual review
0-49   = High fraud risk, reject`;
}

module.exports = { SYSTEM_PROMPT, buildUserPrompt };
