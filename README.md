<div align="center">

# ⚖️ LegalMind

### A browser-based workspace for exploring legal documents and drafting legal letters.

Upload a legal document, extract its text and clauses, ask questions about the uploaded content, and generate a draft legal letter from a simple dashboard.

<p>
  <img src="https://img.shields.io/badge/Project-LegalMind-1F6FEB?style=for-the-badge" alt="LegalMind">
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML CSS JavaScript">
  <img src="https://img.shields.io/badge/AI-OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI">
  <img src="https://img.shields.io/badge/Automation-n8n-EA4B71?style=for-the-badge" alt="n8n">
</p>

[Overview](#-overview) · [Features](#-features) · [Workflow](#-how-it-works) · [Setup](#-getting-started) · [Security](#-privacy-and-security) · [Contributing](#-contributing)

</div>

---

## 🧭 Overview

LegalMind is a lightweight legal-document assistance project built around a web interface. Its current codebase includes a legal dashboard concept, document upload and clause-parsing logic, an n8n webhook integration, OpenAI API request logic, and legal-letter PDF export.

The goal is to make common document-related tasks easier to access from one place:

- Extract text from PDF and plain-text documents.
- Identify and organize numbered clauses.
- Ask questions using extracted document content as context.
- Generate a formal legal-letter draft.
- Copy generated text or export a letter as a PDF.

> **Project status:** This repository is an early-stage prototype. Some integrations and interface wiring are incomplete and require configuration before the full workflow can be used reliably.

## ✨ Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>📄 Document processing</h3>
      Upload PDF or TXT files and extract their text for clause parsing.
    </td>
    <td width="50%" valign="top">
      <h3>🧩 Clause extraction</h3>
      Detect section-like identifiers and group the following text into clause entries.
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>💬 Document Q&A</h3>
      Send a question with extracted clause text as context to the configured OpenAI model.
    </td>
    <td width="50%" valign="top">
      <h3>✍️ Legal letter drafts</h3>
      Generate a formal legal-letter draft and copy the generated text.
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>📥 PDF export</h3>
      Export the generated letter as a PDF using jsPDF.
    </td>
    <td width="50%" valign="top">
      <h3>📊 Usage counters</h3>
      Keep query, letter, and parsed-clause information in the browser interface; query and letter counters use local storage.
    </td>
  </tr>
</table>

## 🔄 How it works

The current implementation is organized around this flow:

1. **Upload** — Select a PDF or TXT document in the browser.
2. **Extract** — Read TXT content directly or extract text from PDF pages with PDF.js.
3. **Parse** — Identify section-like clause headings and group their text.
4. **Send to workflow** — The upload handler posts the selected file to the configured n8n webhook.
5. **Ask** — Submit a question with a selection of extracted clauses as context to the OpenAI Chat Completions API.
6. **Draft and export** — Generate a legal-letter draft, copy it, or export it as a PDF.

<details>
  <summary><strong>Current implementation notes</strong></summary>

  - The question-answering prompt currently uses up to the first five parsed clauses.
  - The letter-generation prompt is currently a generic request to draft a formal legal letter; it does not yet collect detailed matter-specific inputs.
  - The JavaScript references an OpenAI key placeholder. A valid key and a secure integration are required.
  - The upload code points to an n8n **test** webhook URL. Configure a production webhook before relying on uploads.
  - The repository's current HTML, CSS, and JavaScript should be checked together before treating every dashboard action as operational.

</details>

## 🧰 Tech stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and forms |
| CSS3 | Dashboard styling |
| JavaScript | Client-side interactions and document handling |
| Bootstrap 4 | UI styling dependency included by the HTML |
| jQuery | Included frontend dependency |
| Popper.js | Bootstrap positioning dependency |
| SweetAlert2 | Alert library included by the HTML |
| PDF.js | PDF text extraction referenced by the JavaScript |
| OpenAI API (`gpt-4o-mini`) | Question answering and letter generation |
| n8n | Document-ingestion webhook integration |
| jsPDF | PDF export referenced by the JavaScript |
| Browser local storage | Local counters and parsed-clause persistence |

## 🚀 Getting started

### 1. Clone the repository

```bash
git clone https://github.com/ioarunkumar/legalmind.git
cd legalmind
```

### 2. Open the project

This is a browser-based frontend repository. Open `index.html` in a browser, or serve the project directory with a local static server.

For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

### 3. Configure the integrations

Before using the AI and upload workflows:

- Configure the OpenAI integration through a secure backend or server-side function. **Do not put a real API key in browser JavaScript.**
- Replace the n8n test webhook with the correct production webhook when the workflow is ready.
- Confirm that the PDF.js and jsPDF browser libraries are loaded by the page.
- Test document upload, extraction, question answering, and PDF export separately.

There is currently no package-manager setup or backend installation procedure documented in this repository.

## 🔐 Privacy and security

Legal documents can contain confidential and personally identifiable information. Take care before uploading real documents.

- The current upload handler sends the selected file to an external n8n webhook.
- The AI request code is designed to send prompt content to the OpenAI API.
- Parsed clauses and usage counters are stored in browser local storage.
- A browser-side API key is not secure. Keep credentials on a server and never commit secrets.
- Do not upload confidential, privileged, or sensitive legal documents until the data flow, access controls, retention, and provider settings have been reviewed.

## ⚠️ Important limitations

- LegalMind is a prototype, not a production-ready legal service.
- AI-generated answers and letters may be incomplete, inaccurate, or unsuitable for a particular legal situation.
- Clause parsing uses a simple numbering pattern and may not correctly identify every document structure.
- The current Q&A logic uses only a limited selection of parsed clauses, not a complete legal-document retrieval system.
- The letter generator currently uses a generic prompt rather than a complete form-based drafting workflow.
- The repository does not currently document a production backend, authentication system, or deployment process.
- Always have a qualified legal professional review legal content before relying on it.

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome.

1. Fork the repository.
2. Create a branch for your change.
3. Make focused changes and test the affected workflow.
4. Open a pull request with a clear description of the change.

For larger changes, open an issue first so the proposed direction can be discussed.

## 🆓 Free and open source

LegalMind is publicly available on GitHub for people to explore and contribute to.

**A public repository is not automatically licensed for reuse.** No license file was visible in the repository when this README was prepared. Add a `LICENSE` file with the license you choose before describing the project as freely reusable or redistributable.

## 📄 License

No license has been specified in the repository at the time this README was prepared. Until a license is added, reuse and redistribution permissions are not explicitly granted.

---

<div align="center">

**Built to make legal-document workflows easier to explore.**

[Back to top](#-legalmind) · [View repository](https://github.com/ioarunkumar/legalmind)

</div>
