# US Insurance Claim Fraud Detector

AI-powered web app that analyzes US insurance claims and EOB (Explanation of Benefits) reports for fraud indicators, billing anomalies, and legitimacy issues.

## Features

- Paste claim text or upload a PDF (parsed in the browser)
- Legitimacy confidence score (0–100%)
- Risk level: Low / Medium / High
- Flagged issues with severity and explanations
- Recommendation: Approve / Review / Reject
- Extracted claim fields (patient, provider, CPT/ICD codes, amounts)

## Usage

1. Click **Load Sample** to try the built in test claim (contains intentional red flags)
2. Or paste your own claim / EOB text, or **Upload PDF**
3. Click **Analyze Claim**
4. Review the score, risk level, flags, and recommendation

## Sample Test Claim

The sample claim includes duplicate dates of service, missing authorization, CPT/ICD mismatch (ECG for upper respiratory infection), and a large billed vs allowed amount gap — all common fraud indicators.

## Error Handling

- Claim text under 20 characters → validation error
- Invalid OpenAI JSON response → automatic retry once, then generic error
- PDF upload failures → graceful error with manual paste fallback

## License

For educational and review purposes only. Not intended as legal or medical billing advice.
