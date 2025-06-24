const form = document.getElementById('survey-form');
const submit = document.getElementById('submit');
form.onsubmit = async (e) => {
    e.preventDefault();
    const group_type = form.group_type.value;
    const no_of_days = form.no_of_days.value;
    const no_of_people = form.no_of_people.value;
    const budget_in_rupees = form.budget_in_rupees.value;
    const location = form.location.value;

    submit.disabled = true;
    submit.innerText = "Generating Plan...";
    submit.style.cursor = "not-allowed";

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
    } catch (error) {
        alert("Network error. Please try again later.");
        submit.disabled = false;
        submit.innerText = "Submit";
        submit.style.cursor = "";
        return;
    }

    if (res && res.ok) {
        localStorage.setItem("Plan", plan);
        window.location.href = "display.html";
    } else if (plan == "Unauthorized") {
        window.location.href = "login.html";
    } else {
        alert("Error generating plan. Please try again.");
        submit.disabled = false;
        submit.innerText = "Submit";
        submit.style.cursor = "";
    }
};