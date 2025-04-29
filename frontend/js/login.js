const elForm = document.querySelector(".js-login-form");
const elUsernameInp = elForm.querySelector(".js-username-inp");
const elEmailInp = elForm.querySelector(".js-email-inp");
const elPasswordInp = elForm.querySelector(".js-password-inp");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

elForm.addEventListener("submit", async evt => {
    evt.preventDefault();
    if(!(emailRegex.test(elEmailInp.value.trim()))) return alert("Email is invalid !");
    const user = {
        username: elUsernameInp.value.trim(),
        email: elEmailInp.value.trim(),
        password: elPasswordInp.value.trim()
    };
    try {
        const req = await fetch("http://localhost:3000/user/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        });
    } catch (error) {
        console.log(error);
    };
});