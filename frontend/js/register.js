const registerForm = document.querySelector(".js-register-form");
const registerEmailInp = registerForm.querySelector(".js-email-inp");
const registerPasswordInp = registerForm.querySelector(".js-password-inp");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

registerForm.addEventListener("submit", async evt => {
    evt.preventDefault();
    if(!(registerEmailInp.value.trim()) || !(registerPasswordInp.value.trim())) return alert("Iltimos malumotlarni to'ldiring");
    if(!(emailRegex.test(registerEmailInp.value.trim()))) return alert("Email is not valid !");
    const user = {
        email: registerEmailInp.value.trim(),
        password: registerPasswordInp.value.trim()
    };
    try {
        const req = await fetch("http://localhost:3000/user/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        });
        const res = await req.json();
        console.log(res)
        if(res.status == 200) alert("You have successfulle registered !");
    } catch (error) {
        console.log(error);
    };
});