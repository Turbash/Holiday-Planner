window.onload = () => {
    const form = document.getElementById('survey-form');
    const submit = document.getElementById('submit');
    const group_type_input = document.getElementById('group_type');
    const no_of_people_input = document.getElementById('no_of_people');
    const login = document.getElementById('login');
    const toast = document.getElementById('toast-message');
    const token = localStorage.getItem('token');
    if(token){
        login.innerText = "LOGOUT";
        login.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            showToast("Successfully logged out");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);
        }
    }
    group_type_input.addEventListener('change', () => {
        if (group_type_input.value === "solo") {
            no_of_people_input.value = 1;
        } else if (group_type_input.value === "couple") {
            no_of_people_input.value = 2;
        }
    });

    form.onsubmit = async (e) => {
        e.preventDefault();
        submit.disabled = true;
        submit.innerText = "Generating Plan...";
        submit.style.cursor = "not-allowed";
        const group_type = form.group_type.value;
        const no_of_days = form.no_of_days.value;
        const no_of_people = form.no_of_people.value;
        const budget_in_rupees = form.budget_in_rupees.value;
        const location = form.location.value;
        const token = localStorage.getItem('token');
        let res, plan;
        try {
            res = await fetch('https://holiday-planner-db.onrender.com/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({ group_type, budget_in_rupees, no_of_people, location, no_of_days })
            });
            plan = await res.text();

            if (res.status === 401 || plan === "Unauthorized") {
                window.location.href = "login.html";
                return;
            }

            if (res.ok) {
                localStorage.setItem("Plan", plan);
                window.location.href = "display.html";
            } else {
                alert(plan || "Error generating plan. Please try again.");
                submit.disabled = false;
                submit.innerText = "Submit";
                submit.style.cursor = "";
            }
        } catch (error) {
            alert("Network error. Please try again later.");
            submit.disabled = false;
            submit.innerText = "Submit";
            submit.style.cursor = "";
        }
    };

    function showToast(message) {
        if (!toast) return;
        toast.innerText = message;
        toast.style.display = "block";
        setTimeout(() => {
            toast.style.display = "none";
        }, 1000);
    }
}