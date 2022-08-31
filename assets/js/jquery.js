class testCase {
    constructor(name, region, status, type) {
      this.name = name;
      this.region = region;
      this.status = status;
      this.type = type;
    }
}

async function getRegions() {    
    try{
        const response = await fetch('/assets/js/countries.json');
        const regions = await response.json();
        regions.forEach(el => {
        $('#regions').append(`<option value="${el.name}">${el.name}</option>`);        
        });
    }
    catch{
        console.log('JSON feed not loaded...');
    }
    
}

const testCases = [];
const form = $('form');
const regionField = $('regions');

$("#add_case").on("click", function(event){
    event.preventDefault()
    switchTab("add")
});
$("#saved_cases").on("click", function(event){
    event.preventDefault()
    switchTab("show")
});

$(function(){
    form.on('submit', function(e){
        e.preventDefault();
        const selectedTypes = [];    
        let hasError = false;
        let selectedStatus = "";
        
        if ($('#name').val() === ""){
            $('.name-field').removeClass('hide');
            hasError = true;
        }
        
        if ($('#regions').val() === ""){
            $('.region-field').removeClass('hide');
            hasError = true;
        }    
        
        $('[name="type"]').each(function(){
            if($(this).is(":checked")){
                selectedTypes.push($(this).val())
            }
        });
    
        $('[name="status"').each(function(){
            if ($(this).is(":checked")){
                selectedStatus = $(this).val()
            }
        })
      
        if (selectedTypes.length < 1){
            $('.type-field').removeClass('hide');
            hasError = true;
        }
        
        if (hasError){
            return;
        }
        
        const newTestCase = new testCase($('#name').val(), $('#regions').val(), selectedStatus, selectedTypes)
        testCases.push(newTestCase);
    
        console.log(testCases)
        switchTab("show");   
    })

    getRegions();
});

function hideError(){
    const errorElements = $('.error').each(function(){
        $(this).addClass('hide');
    });
}

function switchTab(goal){
  
    if (goal === "add"){
        $('#add_testcase').removeClass('hide');
        $('#add_case').addClass('btn-active');
        $('#show_testcase').addClass('hide');
        $('#saved_cases').removeClass('btn-active');
    }
    if (goal === "show"){
        $('#add_testcase').addClass('hide');
        $('#add_case').removeClass('btn-active');
        $('#show_testcase').removeClass('hide');
        $('#saved_cases').addClass('btn-active');

        const accordionWrapper = $('#accordion');
        accordionWrapper.html('');
        let caseNumber = 1;
        testCases.forEach(el => {            
            const wrapper = document.createElement('div');
            wrapper.classList.add('accordion-wrapper');
            const innerHTML = `
            <div class='accordion-wrapper'>
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
            </div
            `
            caseNumber++;
            accordionWrapper.append(innerHTML);
        })

        $('.accordion--heading').each(function(){
            $(this).on('click', function(){
                $(this).parent().toggleClass('accordion--open');
            })
        })
    }
}