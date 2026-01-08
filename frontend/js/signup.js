const API_URL = "http://localhost:5000/api/auth";

const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", signup);

async function signup() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !email || !password) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Signup failed");
      return;
    }

    // 🔥 AUTO LOGIN AFTER SIGNUP
    await autoLogin(email, password);

  } catch (err) {
    alert("Server error. Try again.");
  }
}

async function autoLogin(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    const redirect = localStorage.getItem("redirectAfterLogin");
    localStorage.removeItem("redirectAfterLogin");

    window.location.href = redirect || "index.html";
  }
}

function goToLogin() {
  window.location.href = "login.html";
}
