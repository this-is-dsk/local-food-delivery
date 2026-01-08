const API_URL = "https://local-food-delivery-pxqv.onrender.com";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", login);

async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});

    const data = await res.json();

   if (!res.ok) {
  if (data.msg === "Invalid credentials") {
    showSignupPrompt();
  } else {
    alert(data.msg || "Login failed");
  }
  return;
}


    // Save auth state
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Redirect
    window.location.href = "index.html";

  } catch (err) {
    alert("Server error. Try again.");
  }
}

function showSignupPrompt() {
  const confirmSignup = confirm(
    "Account not found.\n\nPlease create an account to continue."
  );

  if (confirmSignup) {
    localStorage.setItem("redirectAfterLogin", location.href);
    window.location.href = "signup.html";
  }
}

function goToSignup() {
  window.location.href = "signup.html";
}
