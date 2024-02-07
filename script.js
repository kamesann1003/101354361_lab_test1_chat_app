function toggleForm() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
  
    signupForm.classList.toggle('hidden');
    loginForm.classList.toggle('hidden');
  }