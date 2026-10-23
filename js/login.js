const form = document.getElementById("auth-form");
const msg = document.getElementById("msg");

async function submit(action) {
  if (!form.reportValidity()) return;
  try {
    await Auth[action](document.getElementById("user").value.trim(), document.getElementById("pass").value);
    location.href = "profile.html";
  } catch (err) { msg.textContent = err.message; }
}
form.addEventListener("submit", (e) => { e.preventDefault(); submit("login"); });
document.getElementById("btn-register").addEventListener("click", () => submit("register"));
