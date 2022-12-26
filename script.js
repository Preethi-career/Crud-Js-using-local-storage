const register = document.getElementById("register");
const photo = document.getElementById("photo");
const uploadContent = document.getElementById("uploadContent");
const imagePreview = document.getElementById("imagePreview");
const tableData = document.getElementById("tableData");
const submitContent = document.getElementById("submitContent");
const update = document.getElementById("update");
const currentAddress = document.getElementById("currentAddress");
const permanentAddress = document.getElementById("permanentAddress");
const inputQuery = document.querySelectorAll('.input');
const profileImage = document.getElementById("profileImage");
const tableValue = document.getElementById("tableValue");
const compareAdd = document.getElementById("sameAddress");

const inputs = ["organizationName", "firstName", "lastName", "dob", "mobileNumber", "emailId",
 "country", "stateName", "city", "currentAddress", "permanentAddress", "pincode"];
let data = inputs;
data = [...data.slice(0,3), "gender", ...data.slice(3)];
const specialInput = {'mobileNumber': 10, 'pincode': 6};
// const mobileExp = /^[6,7,8,9]/i;
// const pincodeExp = /^[1-9]/i;
const imageExp = /\.(jpg|jpeg|png|gif|apng|webp)$/i;
const emailExp = /^[a-zA-Z]+[a-zA-Z0-9.-_$]+@[a-zA-Z]+(?:.{1})+\.[a-zA-Z]{2,4}$/;
let profile;
let checked = false;

let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
let yyyy = today.getFullYear();
if (dd < 10) {
  dd = '0' + dd
}
if (mm < 10) {
  mm = '0' + mm
}

today = yyyy + '-' + mm + '-' + dd;
document.getElementById("dob").setAttribute("max", today);

const country = document.getElementById("country");
const fetchPromise = fetch("https://restcountries.com/v3.1/all");

fetchPromise.then(response => {
    return response.json();
}).then(country => {
    listOfCountries(country);
});

function listOfCountries(countries) {
  const names = countries.map(country => {
    let select = document.getElementById("country");
    let option = document.createElement("option");
    option.value = country.name.common;
    option.text = country.name.common;
    select.appendChild(option);
  });
}

for(let input in specialInput){
    document.getElementById(input).addEventListener('keydown', function(e) {
        if (e.which === 38 || e.which === 40) {
            e.preventDefault();
        }
    });
}
let image;
function addImage(path){
    imagePreview.innerHTML = ``;
    let fileElement = document.createElement("img");
    fileElement.id = `profileImage`;
    fileElement.src = path;
    image = path;
    fileElement.style.width = `97px`;
    imagePreview.appendChild(fileElement);
}

function validatePhoto(){
    photo.accept = "image/*";
    photo.addEventListener("change", (event) => {
    let element = photo.value;
    if(imageExp.exec(element)){
        profile = element;
        let err = document.getElementById("errMesg");
        if(err){
            err.remove();
        }
        let files = event.target.files;
        let reader = new FileReader();
        reader.onload = function(e) {
            addImage(e.target.result);
        };
        reader.readAsDataURL(files[0]);
    }
    if(!profile){
        let span = document.createElement("span");
        span.className = `errMesg`;
        span.id = `errMesg`;
        span.textContent = `Please select Image`;
        uploadContent.appendChild(span);
    }
});    
}
validatePhoto();
let specialAction;
function displaySpecialErrors(element){
    specialAction = false;
    if(element === 'emailId'){
        return `Please enter valid email Eg: abc@gmail.com`;
    }
    else if(element === 'mobileNumber'){
        return `Please enter valid 10 digit Mobile Number`;
    }
    return `Please enter valid 6 digit Pincode`;
}

function createErrMesg(element, elementCol = ''){
    if(elementCol) {
        elementCol.style.border = `2px solid red`;
    }
    let errElement = element + "Content";
    let div = document.getElementById(errElement);
    errElement = div.getElementsByClassName("errMesg");   
    if(!errElement.length){
        let span = document.createElement("span");
        span.className = `errMesg`;
        span.textContent = `Please enter ${element}`;
        if(element !== "upload"){
            let error = document.getElementById(element + "Label").textContent;
            error = error.substring(0, error.length-1)
            span.textContent = `Please enter ${error}`;
        }
        if(((element === "emailId")||(element in specialInput))&&(elementCol.value)){
            span.textContent = displaySpecialErrors(element);
        }
        div.appendChild(span);
        if(register.textContent === 'Update'){
            uploadContent.textContent = ``;
        }
    }
}

function removeErrMesg(input){
    input.style.border = `2px solid green`;
    let errElement = input.id + "Content";
    let errContent = document.getElementById(errElement).lastChild;
    if(errContent.className === "errMesg"){
        errContent.remove();
    }
}

function isEmailMobileFormate(input){
    if((input.id in specialInput) && (input.value.length === specialInput[input.id])){
        removeErrMesg(input);
    }
    else if((input.id === 'emailId') && (emailExp.exec(input.value))){
        removeErrMesg(input);
    }
    else{
        removeErrMesg(input);
        createErrMesg(input.id, input);
    }
}

function clearInput(){
    permanentAddress.value = '';
    image = '';
    document.getElementById("profileImage").src = '';
    inputQuery.forEach(element => {
        element.value = '';
        element.style.border = `1px solid gray`;
    })
    document.getElementById("sameAddress").checked = false;
    document.querySelectorAll(".errMesg").forEach((element) => {
        element.remove();
    })
}

function refillImageSrc(path){
    const fileInput = document.querySelector('input[type="file"]');
    const myFile = new File([''], path, {
        type: 'text/plain',
        lastModified: new Date(),
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(myFile);
    fileInput.files = dataTransfer.files;
    photo.src = path;
}

let newList;
let hideById = 0;
function refillInputs(id){
    id = Number(id);
    let list = dataList.filter(element=> element.id === id);
    let obj = list[0];
    newList = obj;
    imagePreview.innerHTML = ``;
    let fileElement = document.createElement("img");
    fileElement.id = `profileImage`;
    fileElement.src = obj.path;
    fileElement.style.width = `97px`;
    imagePreview.appendChild(fileElement);
    refillImageSrc(obj.path);

    inputs.forEach((element) => document.getElementById(element).value = obj[element]);
    document.getElementById(obj.gender).checked = true;
    document.getElementById("sameAddress").checked = false;
    permanentAddress.readOnly = false;
    checked = false;
    if(obj.compareAddress){
        document.getElementById("sameAddress").checked = true;
        permanentAddress.readOnly = true;
        checked = true;
    }
    register.textContent = `Update`;
    hideById = id; 
    displayDataInTable();
}

function deleteInputs(id){
    let index = dataList.findIndex(e=>e.id === Number(id));
    dataList.splice(index, 1);
    localStorage.setItem("data", JSON.stringify(dataList));
}

function displayEditButton(id){
    let editButton = document.createElement("td");
    editButton.innerHTML = `<div class="buttonStruct" id="${id}"><button class="editButton" data-id="${id}" id="editButton"><i class="fa fa-edit"></i></button><br>
    <button class="deleteButton" id="deleteButton" data-id="${id}"><i class="fa fa-trash"></i></button></div>`;
    return editButton;
}

function iseditDelete(){
    let editButton = document.querySelectorAll(".editButton");
    editButton.forEach((element) => {
        element.addEventListener("click", ()=> {
            let id = element.getAttribute('data-id');
            inputQuery.forEach((element) => element.style.border = `1px solid gray`);
            document.querySelectorAll(".errMesg").forEach((e) => e.remove());
            refillInputs(id);
        });
    })
    let deleteButton = document.querySelectorAll(".deleteButton");
    deleteButton.forEach((element)=> {
        element.addEventListener("click", ()=> {
            let id = element.getAttribute('data-id');
            deleteInputs(id);
            displayDataInTable();
        });
    })
}

function displayData(){
    tableData.style.display = `block`;
    if(dataList.length === 0){
        tableData.style.display = `none`;
    }
    tableValue.innerHTML='';
    dataList.forEach((element) => {
        let id = element.id;
        let row = document.createElement("tr");
        Object.entries(element).forEach(([key, value]) => {
            if(key === 'path'){
                let result = document.createElement("td");
                let image = document.createElement("img");
                image.src = value;
                image.style.width = `90px`;
                image.style.height = `90px`;
                result.appendChild(image);
                row.appendChild(result);
            }
            else if((key !== 'id')&&(key !== 'compareAddress')){
                let result = document.createElement("td");
                result.innerHTML = value;   
                row.appendChild(result);
            }
        });
        let editButton = displayEditButton(id);
        row.appendChild(editButton);
        tableValue.appendChild(row);
    });
    if(hideById){
        let update = document.getElementById(hideById);
        update.style.display = `none`;
    }
    iseditDelete();
}

let dataList;
function displayDataInTable(){
    dataList = JSON.parse(localStorage.getItem('data'));
    if(dataList){
        displayData();
    }
}
displayDataInTable();

function dynamicSort(property) {
    return function(a, b) {
        return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    }
 }

function updateInputs(){
    deleteInputs(newList.id)
    let newData = {};
    newData["id"] = newList.id;
    newData["path"] = path;
    data.forEach((element) => {
        if(element === 'gender'){
            value = document.querySelector('input[name="gender"]:checked').value;
        }
        else{
            value = document.getElementById(element).value;
        }
        newData[element] = value;
    });
    newData["compareAddress"] = compareAdd.checked;
    dataList.push(newData)
    dataList.sort(dynamicSort('id'));
    localStorage.setItem("data", JSON.stringify(dataList));
    hideById = 0;
    displayDataInTable();
    clearInput();
    checked = false;
    register.innerHTML = `Register`;
}

let resultenData;
let id;
let currentData = {};
function createData(){
    if(!dataList){
        resultenData = [];
        id = 1;
    }
    else{
        resultenData = dataList;
        let max = 0;
        dataList.forEach(e => {
            if(max < e.id){
                max = e.id;
            }
        });
        id = max + 1;           
    }
    currentData["id"] = id;
    currentData["path"] = path;
    data.forEach((element) => {
        if(element === 'gender'){
            value = document.querySelector('input[name="gender"]:checked').value;
        }
        else{
            value = document.getElementById(element).value;
        }
        currentData[element] = value;
    });
    currentData["compareAddress"] = compareAdd.checked;
    resultenData.push(currentData);
    localStorage.setItem("data", JSON.stringify(resultenData));
    id++;
    register.textContent = `Register`;
    displayDataInTable();
    clearInput();
}

function runTimeErr(){
    inputQuery.forEach((input) => {
        input.addEventListener('change', (event) => { 
            if(input.id === 'photo'){
                uploadContent.innerHTML = ``;
            }
            else if((input.id in specialInput) || (input.id === 'emailId')){
                isEmailMobileFormate(input);
            }
            else if(event.target.value){
                removeErrMesg(input);
            }
            else{
                removeErrMesg(input);
                createErrMesg(input.id, input);
            }
        })
    });
}
let path;
function isInputFilled(){
    if((!image)&&(register.textContent === 'Register')){
        createErrMesg("upload");    
    }
    for(let element of inputs){
        let display = document.getElementById(element);
        let entries = display.value;
        if((!entries)&&(element != 'permanentAddress')){
            createErrMesg(element, display);
        }
        if((display.id in specialInput) && (entries.length < specialInput[display.id])){
            createErrMesg(element, display);
        }
        if((display.id === 'emailId') && (!emailExp.exec(entries))){
            createErrMesg(element, display);
        }
    }
    runTimeErr();
    let noErr = document.querySelectorAll(".errMesg").length;
    if(noErr === 0){
        checkRequired();
    }
}

function checkRequired(){
    let getSrc = document.getElementById("profileImage");
    let errMesg = document.querySelectorAll(".errMesg").length;
    if((!errMesg)&&(register.textContent === 'Register')){
        path = getSrc.src;
        createData();
    }
    else if((!errMesg)&&(register.textContent === 'Update')){
        path = getSrc.src;
        updateInputs();
    }
    else {
        isInputFilled();
    }       
}

register.addEventListener("click", isInputFilled);

function compareAddress(event){
    if(event.target.checked){
        checked = true;
        permanentAddress.value = currentAddress.value;
        permanentAddress.readOnly = true;
    }
    else {
        checked = false;
        permanentAddress.value = ``;
        permanentAddress.readOnly = false;
    }
}

currentAddress.addEventListener("keyup", () => {
    if(checked){
        permanentAddress.value = currentAddress.value;
    }
})