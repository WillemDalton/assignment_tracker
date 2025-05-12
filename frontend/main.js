const ALPHABET = "abcedf0123456789-_"
const ID_LENGTH = 6
const SESSION_LENGTH = 8
const API_URL = "http://localhost:5000/assignments"

let create_button = document.querySelector(".add")
let assignmentsHTML = document.querySelector(".assignments")
let assignments = new Map();

create_button.addEventListener("click", function(e) {
    create_placeholder_assignment();
});

/* ASSIGNMENT ID STUFF */
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


function create_placeholder_assignment()
{
    let assignmentDiv = create_div("assignment");
    let assignmentForm = create_form("assignment_form");
    assignmentDiv.appendChild(assignmentForm);
    
    let card = create_div("card");
    let dueDate = create_input("datetime-local", "due_date");
    let assignmentName = create_input("text", "enter assignment name here...", "assignment_name");
    let courseNumber  = create_input("text", "enter course number here...", "course_number");
    
    assignmentForm.appendChild(card);
    card.appendChild(dueDate);
    card.appendChild(assignmentName);
    card.appendChild(courseNumber);
    
    let dropdown = create_div("dropdown");
    dropdown.classList.add("open");
    
    let assignmentNotes = create_input("text", "enter assignment notes here...", "assignment_notes");
    
    assignmentForm.appendChild(dropdown);
    dropdown.appendChild(assignmentNotes);
    
    let assignmentControls = create_div("assignment_controls");
    
    let createBtn = create_btn("create_btn", "CREATE");
    let cancelBtn = create_btn("cancel_btn", "CANCEL");
    
    cancelBtn.addEventListener("click", function(e){
        assignmentDiv.parentNode.removeChild(assignmentDiv);
    });
    
    assignmentForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // if(assignmentName.value == "" || assignmentNotes.value == "" || dueDate.value == "" || courseNumber.value == "" )
        // {
        //     alert("Please fill in all parts of the assignment card.");
        // }
        // else {
            create_assignment(dueDate.value, assignmentName.value, courseNumber.value, assignmentNotes.value);
            const milliseconds = new Date(dueDate.value).getTime();
            postData(getCookie("session_id"), assignmentName.value, courseNumber.value, assignmentNotes.value, milliseconds)
            assignmentDiv.parentNode.removeChild(assignmentDiv);
        //}
    });
    
    assignmentForm.appendChild(assignmentControls);
    assignmentControls.appendChild(createBtn);
    assignmentControls.appendChild(cancelBtn);
    assignments.set(generate_ID(ID_LENGTH), assignmentDiv);
    assignmentsHTML.insertBefore(assignmentDiv, assignmentsHTML.children[0]);
}

function create_assignment(due_date, assignment_name, course_number, assignment_notes) {
    let assignmentDiv = create_div("assignment");

    let card = create_div("card");
    let dueDate = create_span("due_date", due_date);
    let assignmentName = create_span("assignment_name", assignment_name);
    let courseNumber  = create_span("course_number", course_number);
    
    assignmentDiv.appendChild(card);
    card.appendChild(dueDate);
    card.appendChild(assignmentName);
    card.appendChild(courseNumber);
    
    let dropdown = create_div("dropdown");
    let assignmentNotes = create_span("assignment_notes", assignment_notes);
    
    assignmentDiv.appendChild(dropdown);
    dropdown.appendChild(assignmentNotes);
    assignmentsHTML.appendChild(assignmentDiv);
}

function create_span(span_class, span_content){
    let span = document.createElement("span");
    span.innerHTML = span_content;
    span.classList.add(span_class);
    return span;
}

function create_input(input_type, input_placeholder, input_class)
{
    let input = document.createElement("input");
    input.type = input_type;
    input.classList.add(input_class);
    if(input.type == "text")
    {
        input.placeholder = input_placeholder;
    }
    return input;
}

function create_div(div_class)
{
    let div = document.createElement("div");
    div.classList.add(div_class);
    return div;
}

function create_form(form_class)
{
    let form = document.createElement("form");
    form.classList.add(form_class);
    return form;
}

function create_image(img_source, img_alt, img_class)
{
    let image = document.createElement("img");
    image.classList.add(img_class);
    image.alt = img_alt;
    image.src = img_source;
    return image;
}

function create_btn(btn_class, btn_content)
{
    let btn = document.createElement("button");
    btn.classList.add(btn_class);
    btn.innerHTML = btn_content;
    return btn;
}

function setSessionCookie(value) {
    return document.cookie = "session_id=" + (value || "") + 
                      "; path=/" + 
                      "; SameSite=Lax";
}

function getCookie(name)
{
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

async function getData(session_id)
{
  try {
    const response = await fetch(`${API_URL}?session_id=${encodeURIComponent(session_id)}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    for (let assignment of json)
    {
        console.log(assignment)
        let date = new Date(assignment[4])
        create_assignment(date, assignment[1], assignment[2], assignment[3])
    }

  } catch (error) {
  }
}

async function postData(session_id, assignment_name, course_number, assignment_notes, due_date)
{
    try {
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
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error) {
  }
}

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
