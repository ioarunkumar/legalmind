// =======================
// STATE
// =======================
let clauses = JSON.parse(localStorage.getItem("clauses")) || [];
let queryCount = Number(localStorage.getItem("queryCount") || 0);
let letterCount = Number(localStorage.getItem("letterCount") || 0);

updateStats();

// ⚠️ API key exposed – demo use only.
const OPENAI_KEY = "PASTE_KEY_HERE";


// =======================
// NAVIGATION
// =======================
document.querySelectorAll(".nav,.action").forEach(btn=>{
  btn.onclick=()=>{
    const id=btn.dataset.view;
    document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }
});


// =======================
// FILE UPLOAD
// =======================
document.getElementById("fileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  document.getElementById("uploadStatus").innerText = "Uploading to AI server...";

  // ============================
  // SEND FILE TO N8N WEBHOOK
  // ============================
  const formData = new FormData();
  formData.append("file", file);

  try {
    await fetch(
      "https://ashish98745.app.n8n.cloud/webhook-test/ingest-legal",
      {
        method: "POST",
        body: formData
      }
    );

    console.log("File sent to n8n webhook successfully");
  } catch (err) {
    console.error("Webhook upload failed:", err);
  }

  // ============================
  // LOCAL CLAUSE PARSING (existing logic)
  // ============================
  let text = "";

  if (file.type === "text/plain") {
    text = await file.text();
  } else if (file.type === "application/pdf") {
    text = await extractPDF(file);
  }

  clauses = parseClauses(text);
  localStorage.setItem("clauses", JSON.stringify(clauses));

  document.getElementById("uploadStatus").innerText =
    `Parsed ${clauses.length} clauses & sent to AI workflow`;

  document.getElementById("activity").innerText =
    "Document uploaded & processed via n8n.";
});

const file=e.target.files[0];
if(!file) return;

let text="";

if(file.type==="text/plain"){
text=await file.text();
}else{
text=await extractPDF(file);
}

clauses=parseClauses(text);
localStorage.setItem("clauses",JSON.stringify(clauses));

document.getElementById("uploadStatus").innerText=
`Parsed ${clauses.length} clauses`;

document.getElementById("activity").innerText="Document uploaded.";
document.getElementById("docCount").innerText=clauses.length;
});

async function extractPDF(file){
const buf=await file.arrayBuffer();
const pdf=await pdfjsLib.getDocument({data:buf}).promise;
let t="";
for(let i=1;i<=pdf.numPages;i++){
const page=await pdf.getPage(i);
const c=await page.getTextContent();
t+=c.items.map(x=>x.str).join(" ");
}
return t;
}

function parseClauses(text){
const regex=/^(\d+(\.\d+)*|\([a-z]\)|[IVXLC]+)/i;
const lines=text.split(/\n/);
let res=[];
let cur=null;

lines.forEach(l=>{
if(regex.test(l)){
if(cur) res.push(cur);
cur={sectionNumber:l.match(regex)[0],content:l};
}else if(cur){
cur.content+=" "+l;
}
});
if(cur) res.push(cur);
return res;
}


// =======================
// QUESTION AI
// =======================
document.getElementById("askBtn").onclick=async ()=>{
const q=document.getElementById("questionInput").value;
queryCount++;
localStorage.setItem("queryCount",queryCount);
updateStats();

const rel=clauses.slice(0,5).map(c=>c.content).join("\n");

const prompt=`Use only these clauses:\n${rel}\nQuestion:${q}`;

try{
const r=await fetch("https://api.openai.com/v1/chat/completions",{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:"Bearer "+OPENAI_KEY
},
body:JSON.stringify({
model:"gpt-4o-mini",
messages:[{role:"user",content:prompt}]
})
});
const j=await r.json();
document.getElementById("answerOutput").innerText=j.choices[0].message.content;
}catch{
document.getElementById("answerOutput").innerText="AI request failed.";
}
};

document.getElementById("copyAnswer").onclick=()=>{
navigator.clipboard.writeText(document.getElementById("answerOutput").innerText);
};


// =======================
// LETTER AI
// =======================
document.getElementById("generateLetter").onclick=async ()=>{
letterCount++;
localStorage.setItem("letterCount",letterCount);
updateStats();

const prompt="Draft a formal legal letter.";

try{
const r=await fetch("https://api.openai.com/v1/chat/completions",{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:"Bearer "+OPENAI_KEY
},
body:JSON.stringify({
model:"gpt-4o-mini",
messages:[{role:"user",content:prompt}]
})
});
const j=await r.json();
document.getElementById("letterOutput").innerText=j.choices[0].message.content;
}catch{
document.getElementById("letterOutput").innerText="AI generation failed.";
}
};

document.getElementById("copyLetter").onclick=()=>{
navigator.clipboard.writeText(document.getElementById("letterOutput").innerText);
};


// =======================
// PDF DOWNLOAD
// =======================
document.getElementById("downloadPDF").onclick=()=>{
const {jsPDF}=window.jspdf;
const doc=new jsPDF();
const txt=document.getElementById("letterOutput").innerText;
const lines=doc.splitTextToSize(txt,180);
doc.text(lines,10,10);
doc.text("AI generated. Review by lawyer.",10,280);
doc.save("legal-letter.pdf");
};


// =======================
function updateStats(){
document.getElementById("queryCount").innerText=queryCount;
document.getElementById("letterCount").innerText=letterCount;
}
