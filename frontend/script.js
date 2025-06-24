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
    const res = await fetch('https://holiday-planner-db.onrender.com/generate', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ group_type, budget_in_rupees, no_of_people, location, no_of_days })
    });
    const plan = await res.text();
    if (res.ok) {
        localStorage.setItem("Plan", plan);
        window.location.href = "display.html";
    }
    if(plan=="Unauthorized"){
        window.location.href="login.html";
    }

};