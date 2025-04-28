const registerForm = document.querySelector(".js-register-form");
const registerEmailInp = registerForm.querySelector(".js-email-inp");
const registerPasswordInp = registerForm.querySelector(".js-password-inp");

registerForm.addEventListener("submit", async evt => {
    evt.preventDefault();
    if(!(registerEmailInp.value.trim()) || !(registerPasswordInp.value.trim())) return alert("Iltimos malumotlarni to'ldiring");
    const user = {
        email: registerEmailInp.value.trim(),
        password: registerPasswordInp.value.trim()
    };
    const req = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    });
    const res = await req.json();
    console.log(res);
});