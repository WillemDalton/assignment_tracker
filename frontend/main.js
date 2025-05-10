const ALPHABET = "abcedf0123456789-_"
const ID_LENGTH = 6

let create_button = document.querySelector(".add")
let assignmentsHTML = document.querySelector(".assignments")
let assignments = new Map();

create_button.addEventListener("click", function(e) {
    create_placeholder_assignment();
});

function generate_assignmentID()
{
    let id = ""
    for(let i = 0; i < ID_LENGTH; i++)
    {
        id += ALPHABET[random_int(0, ALPHABET.length)];
    }
    return id;
}

function random_int(min, max)
{
    Math.floor(Math.random * (max - min + 1) + min)
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
            assignmentDiv.parentNode.removeChild(assignmentDiv);
        //}
    });
    
    assignmentForm.appendChild(assignmentControls);
    assignmentControls.appendChild(createBtn);
    assignmentControls.appendChild(cancelBtn);
    
    
    assignments.set(generate_assignmentID(), assignmentDiv);
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