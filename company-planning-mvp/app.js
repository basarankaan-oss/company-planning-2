const STORAGE_KEY = "company_planning_v1";

const $ = id => document.getElementById(id);
const getPlans = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const savePlans = plans => localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));

function setDefaultDate() {
  const d = new Date();
  $("date").value = d.toISOString().slice(0,10);
}
setDefaultDate();

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    $(btn.dataset.view + "View").classList.add("active");
    if (btn.dataset.view === "admin") render();
  });
});

$("location").addEventListener("change", () => {
  $("customLocationWrap").classList.toggle("hidden", $("location").value !== "Diğer");
  if ($("location").value !== "Diğer") $("customLocation").value = "";
});

$("shiftForm").addEventListener("submit", e => {
  e.preventDefault();
  const location = $("location").value === "Diğer" ? $("customLocation").value.trim() : $("location").value;
  if (!location) return;

  const plan = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: $("name").value.trim(),
    date: $("date").value,
    start: $("start").value,
    end: $("end").value,
    location,
    createdAt: new Date().toISOString()
  };
  const plans = getPlans();
  plans.push(plan);
  savePlans(plans);

  $("shiftForm").reset();
  setDefaultDate();
  $("customLocationWrap").classList.add("hidden");
  $("success").classList.remove("hidden");
  setTimeout(() => $("success").classList.add("hidden"), 3000);
});

function durationHours(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let mins = (eh*60+em)-(sh*60+sm);
  if (mins < 0) mins += 24*60;
  return mins/60;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("tr-TR", {day:"2-digit", month:"2-digit", year:"numeric"}).format(new Date(value+"T00:00:00"));
}

function render() {
  let plans = getPlans();
  const search = $("search").value.toLowerCase();
  const date = $("filterDate").value;
  const location = $("filterLocation").value;

  plans = plans.filter(p =>
    p.name.toLowerCase().includes(search) &&
    (!date || p.date === date) &&
    (!location || p.location === location)
  ).sort((a,b) => (a.date+a.start).localeCompare(b.date+b.start));

  const all = getPlans();
  $("totalCount").textContent = all.length;
  $("employeeCount").textContent = new Set(all.map(p => p.name.toLowerCase())).size;
  $("hoursCount").textContent = all.reduce((sum,p)=>sum+durationHours(p.start,p.end),0).toFixed(1);

  $("planningBody").innerHTML = plans.map(p => `
    <tr>
      <td><span class="person">${escapeHtml(p.name)}</span></td>
      <td>${formatDate(p.date)}</td>
      <td><span class="badge">${p.start} – ${p.end}</span></td>
      <td>${escapeHtml(p.location)}</td>
      <td><button class="delete" title="Sil" onclick="removePlan('${p.id}')">✕</button></td>
    </tr>`).join("");

  $("empty").classList.toggle("hidden", plans.length > 0);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

window.removePlan = id => {
  savePlans(getPlans().filter(p => p.id !== id));
  render();
};

["search","filterDate","filterLocation"].forEach(id => $(id).addEventListener("input", render));

$("clearBtn").addEventListener("click", () => {
  if (confirm("Tüm planlar silinsin mi?")) {
    localStorage.removeItem(STORAGE_KEY);
    render();
  }
});

$("exportBtn").addEventListener("click", () => {
  const rows = [["İsim Soyisim","Tarih","Başlangıç","Bitiş","Yer"], ...getPlans().map(p=>[p.name,p.date,p.start,p.end,p.location])];
  const csv = rows.map(r => r.map(x => `"${String(x).replaceAll('"','""')}"`).join(";")).join("\n");
  const blob = new Blob(["\ufeff"+csv], {type:"text/csv;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "planning.csv";
  a.click();
  URL.revokeObjectURL(a.href);
});

render();