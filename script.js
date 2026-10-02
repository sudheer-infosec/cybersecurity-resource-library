let data=[];
let selectedCategory="ALL";
let selectedSub="ALL";

const PDF_BASE="";

function pdf(path){
return PDF_BASE+path.replaceAll("\\","/")
.split("/")
.map(encodeURIComponent)
.join("/");
}

async function load(){
const res=await fetch("resources.json");
const json=await res.json(); data=json.resources||[];

document.getElementById("total").textContent=data.length;

const cats={};

data.forEach(r=>{
cats[r.Category]??={};
cats[r.Category][r.Subcategory]??=0;
cats[r.Category][r.Subcategory]++;
});

document.getElementById("cats").textContent=Object.keys(cats).length;

let subCount=0;

for(const c of Object.keys(cats)){
subCount+=Object.keys(cats[c]).length;

const d=document.createElement("details");
const s=document.createElement("summary");

s.textContent=c+" ("+Object.values(cats[c]).reduce((a,b)=>a+b,0)+")";
d.appendChild(s);

for(const sub of Object.keys(cats[c])){
const b=document.createElement("div");
b.className="sub";
b.textContent=sub+" ("+cats[c][sub]+")";

b.onclick=()=>{
selectedCategory=c;
selectedSub=sub;
render();
};

d.appendChild(b);
}

document.getElementById("tree").appendChild(d);
}

document.getElementById("subs").textContent=subCount;

render();
}

function showAll(){
selectedCategory="ALL";
selectedSub="ALL";
render();
}

function render(){
const q=document.getElementById("search").value.toLowerCase();

const list=data.filter(r=>{
const cat=selectedCategory==="ALL"||r.Category===selectedCategory;
const sub=selectedSub==="ALL"||r.Subcategory===selectedSub;
const search=!q||(
(r.Title||"")+" "+
(r.FileName||"")+" "+
(r.Category||"")+" "+
(r.Subcategory||"")
).toLowerCase().includes(q);

return cat&&sub&&search;
});

document.getElementById("count").textContent=list.length+" RESOURCES";

document.getElementById("resources").innerHTML=list.map(r=>`
<div class="card">
<div class="title">${escapeHTML(r.Title||r.FileName)}</div>
<div class="meta">
${escapeHTML(r.Category)} /
${escapeHTML(r.Subcategory)}
&nbsp; � &nbsp;
${Number(r.SizeMB||0).toFixed(2)} MB
</div>
<a href="${pdf(r.RelativePath)}" target="_blank">OPEN PDF ?</a>
<a href="${pdf(r.RelativePath)}" download>DOWNLOAD ?</a>
</div>
`).join("");
}

function escapeHTML(x){
return String(x).replace(/[&<>"']/g,m=>({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"
}[m]));
}

document.getElementById("search").addEventListener("input",render);

load();
