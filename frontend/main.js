const ALPHABET = "abcedf0123456789-_"
const ID_LENGTH = 6
const SESSION_LENGTH = 8
const API_URL = "http://localhost:5000/assignments"

let create_button = document.querySelector(".add")
let assignments_HTML = document.querySelector(".assignments")
let assignments = new Map();

create_button.addEventListener("click", function(e) {
    create_placeholder_assignment();
});

/* ASSIGNMENT/USER ID STUFF */
function generate_ID(length)
{
    let id = ""
    for(let i = 0; i < length; i++)
    {
        id += ALPHABET[random_int(0, ALPHABET.length - 1)];
    }
    return id;
}

function random_int(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/*
 * Create a placeholder assignment for the user to edit.
 */
function create_placeholder_assignment()
{
    let assignment_div = create_div("assignment");
    let assignment_form = create_form("assignment_form");
    assignment_div.appendChild(assignment_form);
    
    let card = create_div("card");
    let due_date = create_input("datetime-local", "due_date");

    // default to today, 11:59PM for due dates (nice feature to have.)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    due_date.value = `${year}-${month}-${day} 23:59`;

    let assignment_name = create_input("text", "enter assignment name here...", "assignment_name");
    let course_number  = create_input("text", "enter course number here...", "course_number");
    
    assignment_form.appendChild(card);
    card.appendChild(due_date);
    card.appendChild(assignment_name);
    card.appendChild(course_number);
    
    let dropdown = create_div("dropdown");
    dropdown.classList.add("open");
    
    let assignment_notes = create_input("text", "enter assignment notes here...", "assignment_notes");
    
    assignment_form.appendChild(dropdown);
    dropdown.appendChild(assignment_notes);
    
    let assignment_controls = create_div("assignment_controls");
    
    let create_btn_html = create_btn("create_btn", "CREATE");
    let cancel_btn = create_btn("cancel_btn", "CANCEL");
    
    cancel_btn.addEventListener("click", function(e){
        assignment_div.parentNode.removeChild(assignment_div);
    });
    
    // Submitting logic. we only want to submit if we have valid inputs. if we do, make a new assignment and post data.
    assignment_form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if(due_date.value === "")
        {
            due_date.classList.add("error")
        }
        else if(assignment_name.value === "")
        {
            assignment_name.classList.add("error")
        }
        else if(course_number.value === "")
        {
            course_number.classList.add("error")
        }
        else
        {
            due_date.classList.remove("error")
            assignment_name.classList.remove("error")
            course_number.classList.remove("error")
            
            let date = new Date(due_date.value);
            create_assignment(`${date.toLocaleTimeString()} ${date.toLocaleDateString()}`, assignment_name.value, course_number.value, assignment_notes.value);
            
            const milliseconds = new Date(due_date.value).getTime();
            postData(getCookie("session_id"), assignment_name.value, course_number.value, assignment_notes.value, milliseconds)
            assignment_div.parentNode.removeChild(assignment_div);
        }
    });
    
    assignment_form.appendChild(assignment_controls);
    assignment_controls.appendChild(create_btn_html);
    assignment_controls.appendChild(cancel_btn);
    assignments_HTML.insertBefore(assignment_div, assignments_HTML.children[0]);
}

/*
 * Create an assignment from placeholder form values.
 */
function create_assignment(_due_date, _assignment_name, _course_number, _assignment_notes, id) {
    let assignment_div = create_div("assignment");

    let card = create_div("card");
    let due_date = create_span("due_date", _due_date);
    let assignment_name = create_span("assignment_name", _assignment_name);
    let course_number  = create_span("course_number", _course_number);

    let delete_img = create_image("src/trash.svg", "delete assignment", "delete-svg")
    let delete_btn = create_btn("delete", null)
    delete_btn.appendChild(delete_img)
    
    let dropdown_img = create_image("src/open.svg", "open dropdown", "dropdown-svg")
    let dropdown_btn = create_btn("dropdown-btn", null)
    dropdown_btn.appendChild(dropdown_img)

    let complete_div = create_div("complete-container")
    let complete = create_input("checkbox", null, "checkbox")
    complete.id = "complete"
    complete_div.appendChild(complete)
    
    complete.addEventListener("change", async function(e){
        if (complete.checked) {
            assignment_div.classList.add("complete");
            await deleteData(id);
            setTimeout(() => {
                assignment_div.remove();
            }, 1000);
        }
    })

    let complete_label = create_label("complete-label", "complete", "Mark As Complete:");
    

    let controls = create_div("controls")
    controls.appendChild(complete_label)
    controls.appendChild(complete_div)
    controls.appendChild(dropdown_btn)
    controls.appendChild(delete_btn)
    
    
    delete_btn.addEventListener("click", async function(e){
        clearInterval(intevalID);
        await deleteData(id)
        assignment_div.parentNode.removeChild(assignment_div);
    });


    // progress bar logic
    let progress_bar = create_div("progress-bar")
    let progress = create_div("progress")
    progress_bar.appendChild(progress)
    
    let startTime = Date.now()

    let intevalID = setInterval(() => {
        let date = new Date(_due_date);
        let now = Date.now();
        let percent;

        if((date.getTime() - startTime) <= 0)
        {
            percent = 100
        }
        else
        {
            let time = (now - startTime)/(date.getTime() - startTime) * 100;
            percent = Math.min(100, Math.max(0, time));
        }

        progress.style.width = percent + "%";

        if(percent >= 100)
        {
            progress.classList.add("overdue");
            clearInterval(intevalID);
        }
    }, 1000)

    assignment_div.appendChild(card);
    card.appendChild(due_date);
    card.appendChild(assignment_name);
    card.appendChild(course_number);
    card.appendChild(controls);
    
    let dropdown = create_div("dropdown");

    let assignment_notes = create_span("assignment_notes", _assignment_notes);

    dropdown_btn.addEventListener("click", function(e) {
        dropdown_btn.classList.toggle("open")
        dropdown.classList.toggle("open")    
    })

    assignment_div.appendChild(dropdown);
    assignment_div.appendChild(progress_bar);
    dropdown.appendChild(assignment_notes);
    assignment_div.dataset.dueDate = new Date(_due_date).getTime();
    assignments.set(generate_ID(ID_LENGTH), assignment_div);
    insertToDiv(assignment_div)
}

function insertToDiv(newAssignment)
{
    for(let existing of assignments.values())
    {
        const existingDueDate = Number(existing.dataset.dueDate)
        if(Number(newAssignment.dataset.dueDate) < existingDueDate)
        {
            assignments_HTML.insertBefore(newAssignment, existing)
            return
        }
    }

    assignments_HTML.appendChild(newAssignment)
}

function create_label(label_class, label_for, label_text)
{
    let label = document.createElement("label")
    label.innerText = label_text
    label.setAttribute("for", label_for)
    label.classList.add(label_class)
    return label
}

function create_span(span_class, span_content)
{
    let span = document.createElement("span")
    span.innerHTML = span_content
    span.classList.add(span_class)
    return span
}

function create_input(input_type, input_placeholder, input_class)
{
    let input = document.createElement("input")
    input.type = input_type
    input.classList.add(input_class)
    if(input.type == "text")
    {
        input.placeholder = input_placeholder
    }
    return input
}
    
function create_div(div_class)
{
    let div = document.createElement("div")
    div.classList.add(div_class)
    return div
}

function create_form(form_class)
{
    let form = document.createElement("form")
    form.classList.add(form_class)
    return form
}

function create_image(img_source, img_alt, img_class)
{
    let image = document.createElement("img")
    image.classList.add(img_class)
    image.alt = img_alt
    image.src = img_source
    return image
}

function create_btn(btn_class, btn_content)
{
    let btn = document.createElement("button")
    btn.classList.add(btn_class)
    btn.innerHTML = btn_content
    return btn
}

/*
 * Create new session cookie.
*/
function setSessionCookie(value) {
    return document.cookie = "session_id=" + (value || "") + 
    "; path=/" + 
    "; SameSite=Lax"
}

/*
 * Grab a cookie with a given cookie name (cname)
*/
function getCookie(cname)
{
    const name = cname + "=";
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) 
    {
        let c = ca[i];
        while (c.charAt(0) === ' ') 
        {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(name) === 0) 
        {
            return c.substring(name.length, c.length)
        }
    }
    return null
}

/*
 *  Fetch all assignments for a given user's session_id.
*/
async function getData(session_id)
{
    try 
    {
        const response = await fetch(`${API_URL}?session_id=${session_id}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        
        const json = await response.json()
        for (let assignment of json)
        {
            let date = new Date(assignment[4])
            create_assignment(`${date.toLocaleTimeString()} ${date.toLocaleDateString()}`, assignment[1], assignment[3], assignment[2], assignment[0])
        }
            
    }
    catch(e)
    {
        console.error("Error fetching data: " + e.message)
    }
}
    
/*
 * Post newly created assignment into the database.
*/
async function postData(session_id, assignment_name, course_number, assignment_notes, due_date)
{
    try 
    {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "session_id" : session_id,
                "due_date" : due_date,
                "name" : assignment_name,
                "description" : assignment_notes,
                "class" : course_number
            })
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
    }
    catch(e)
    {
        console.error("Error posting data: " + e.message)
    }
}

async function deleteData(id)
{
    try 
    {
        const response = await fetch(API_URL, {
            method: "DELETE",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "id" :  id
            })
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
    }
    catch(e)
    {
        console.error("Error posting data: " + e.message)
    }

    assignments.delete(id)
}

/*
 * When the window loads, try to load existing data. if none, make a new session cookie.
*/
window.onload = function() {
    let cookieValue = getCookie("session_id")
    if(cookieValue != null)
    {
        getData(cookieValue)
    }
    else
    {
        setSessionCookie(generate_ID(SESSION_LENGTH))
    }
};