class testCase {
    constructor(name, region, status, type) {
      this.name = name;
      this.region = region;
      this.status = status;
      this.type = type;
    }
}  

const testCases = [];
const form = document.getElementById('form');
const regionField = document.getElementById('regions');
document.getElementById("add_case").addEventListener("click", function(event){
    event.preventDefault()
  });
document.getElementById("saved_cases").addEventListener("click", function(event){
event.preventDefault()
});

form.addEventListener('submit', (event => {
    event.preventDefault();
    const selectedTypes = [];    
    let hasError = false;
    let selectedStatus = "";
    const typeFields = document.getElementsByName('type');
    const nameField = document.getElementById('name');    
    const statusField = document.getElementsByName('status');
    
    if (nameField.value === ""){
        document.querySelector('.name-field').classList.remove('hide');
        hasError = true;
    }
    
    if (regionField.value === ""){
        document.querySelector('.region-field').classList.remove('hide');
        hasError = true;
    }    
    
    typeFields.forEach(el => {
        if (el.checked){
            selectedTypes.push(el.value);
        }
    })

    statusField.forEach(el => {
        if (el.checked){
            selectedStatus =  el.value;
        }
    })
    
    if (selectedTypes.length < 1){
        document.querySelector('.type-field').classList.remove('hide');
        hasError = true;
    }
    
    if (hasError){
        return;
    }
    
    const newTestCase = new testCase(nameField.value, regionField.value, selectedStatus, selectedTypes)
    testCases.push(newTestCase);
    switchTab("show");   
}));


async function getRegions() {    
    const response = await fetch('/assets/js/countries.json');
    const regions = await response.json();
    regions.forEach(element => {
        let newOption = new Option(element.name,element.name);
        regionField.add(newOption,undefined);
    });
}

function hideError(){
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => {
        el.classList.add('hide');
    })
}

document.getElementById("add_case").addEventListener("click", function(event){
    event.preventDefault()
    switchTab("add")
  });

document.getElementById("saved_cases").addEventListener("click", function(event){
    event.preventDefault()
    switchTab("show")
});

function switchTab(goal){
  
    if (goal === "add"){
        document.getElementById('add_testcase').classList.remove('hide');
        document.getElementById('add_case').classList.add('btn-active');
        document.getElementById('show_testcase').classList.add('hide');
        document.getElementById('saved_cases').classList.remove('btn-active');
    }
    if (goal === "show"){
        document.getElementById('add_testcase').classList.add('hide');
        document.getElementById('add_case').classList.remove('btn-active');
        document.getElementById('show_testcase').classList.remove('hide');
        document.getElementById('saved_cases').classList.add('btn-active');

        const accordionWrapper = document.getElementById('accordion');
        accordionWrapper.innerHTML = '';
        let caseNumber = 1;
        testCases.forEach(el => {            
            const wrapper = document.createElement('div');
            wrapper.classList.add('accordion-wrapper');
            const innerHTML = `
                <div class='accordion--heading'>
                    <div class="accordion--title">A/B Case ${caseNumber}</div>
                    <div class="accordion--arrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"/></svg></div>
                </div>
                <div class='accordion--content'>
                    <ul>
                        <li>Name: ${el.name}</li>
                        <li>Applicable region: ${el.region}</li>
                        <li>Status: ${el.status}</li>
                        <li>Type: ${el.type}</li>
                    </ul>
                </div>
            `
            caseNumber++;
            wrapper.innerHTML += innerHTML;
            accordionWrapper.appendChild(wrapper);
        })
        const accordionItems = document.querySelectorAll('.accordion-wrapper');
        const accordionHeadings = document.querySelectorAll('.accordion--heading').forEach( el => {
            el.addEventListener('click', toggleItem);
        })

        function toggleItem(){
            this.parentNode.classList.toggle('accordion--open');
        }
    }
}

getRegions();