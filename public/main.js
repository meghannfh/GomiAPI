const classificationTypes = document.querySelectorAll('.classTypes')
const headers = document.querySelectorAll('.headers')
const images = document.querySelectorAll('.images')
let markImage = document.getElementById('markImg');
let bagImage = document.getElementById('bagImg');


let itemName;
let classification;
let instructions;
let material;
let contact;

$(document).ready(function () {
  $("#name").autocomplete({
    source: async function (req, res) {
      let data = await fetch(`http://localhost:3001/search/?query=${req.term}`)
        .then((results) => results.json())
        .then((results) =>
          results.map((result) => {
            return {
              label: result.name,
              name: result.name,
              id: result._id,
            };
          })
        );
      res(data);
    },
    minLength: 2,
    select: function (event, ui) {

      reAddClassHidden()//reset class hidden on classification types, headers and images after each search
      $("#itemName").text('')//empty item name text for each new search
      $("#instructions").text('')//empty instructions text 
      $("#material").text('')//empty material text
      $(".subtitle").addClass('hidden')

      console.log(ui.item.id);
      fetch(`http://localhost:3001/get/${ui.item.id}`)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);

          $("#info").removeClass('hidden')//reveal information box after selection is picked
          $("#name").val('')//empty the input again

          
          itemName = result.name//set item name
          classification = result.classification//set classification
          material = result.material//set material
          instructions = result.instructions//set instructions
          contact = result.contact//set contact

          itemName && $("#itemName").text(itemName);
          instructions && $('#instructionsHeader').toggleClass('hidden') && $("#instructions").text(instructions)
          material && $('#materialHeader').toggleClass('hidden') && $("#material").text(material)
          contact && $("#contactNumber").text(contact);

          checkClassification()
          checkForContact()
          addBagImg()
          addMark()

        });
    },
  });
});


//Check each search for contact property and display contact info box if it exists
//If !contact then hide contact info box when each new item is selected
function checkForContact(){
  if(contact){
    $('#contactInfo').removeClass('hidden')
  //   document.getElementById('xmark').addEventListener('click', ()=>{
  //     document.getElementById('contactInfo').classList.remove('show-contact')
  //   })
  // }else{
  //   document.getElementById('contactInfo').classList.remove('show-contact')
  }
}

//hide all classification type info at the beginning of each new search
function reAddClassHidden(){
  classificationTypes.forEach(type=>{
    type.classList.add('hidden')
  })

  headers.forEach(header=> {
    header.classList.add('hidden')
  })

  images.forEach(image => {
    image.classList.add('hidden')
  })

  $('#contactInfo').addClass('hidden')
}

//check for classification as burnable or non-burnable or for 
//material set to plastic and show appropriate plastic bag
function addBagImg(){
  if(classification === 'Burnable'){
    $('#bagContainer').toggleClass('hidden')
    bagImage.src = 'assets/burnablebag.jpg'
    bagImage.setAttribute("alt","burnable bag")//this syntax
  }else if(classification === 'Non-burnable'){
    $('#bagContainer').toggleClass('hidden')
    bagImage.src = 'assets/nonburnablebag.jpg'
    bagImage.alt = 'nonburnable bag'
  }else if(material.includes('Plastic')){
    $('#bagContainer').toggleClass('hidden')
    bagImage.src = 'assets/plasticsbag.jpg'
  }else if(material.includes('Paper')){
    $('#bagContainer').toggleClass('hidden')
    bagImage.src = 'assets/paperRope.png'
    bagImage.alt = 'paper rope'
  }
}

function checkClassification(){
  if (classification === "Burnable") {
    $('#burnable').toggleClass('hidden')

  } else if(classification === 'Non-burnable'){
    $('#nonburnable').toggleClass('hidden')

  } else if(classification == 'Recyclable'){
    $('#recyclable').toggleClass('hidden')

  } else if(classification == 'Not collectable'){
    $('#nonCollectable').toggleClass('hidden')

  } else if(classification === 'Oversized'){
    $('#overSize').toggleClass('hidden')
  
  }
}

//'Plastic'
//'Paper'
//'Metal'
//'Aluminium'

//add recyclable mark
function addMark(){
  if(classification === 'Recyclable'){
    if(material === 'Plastic'){
      $('#markContainer').toggleClass('hidden')
      markImage.src = 'assets/plastic.svg.png'
      markImage.alt = 'plastic recycle mark'
    }else if(material === 'Paper'){
      $('#markContainer').toggleClass('hidden')
      markImage.src = 'assets/kami.svg.png'
      markImage.alt = 'paper recycle mark'
    }else if(material === 'Aluminum'){
      $('#markContainer').toggleCLass('hidden')
      markImage.src = 'assets/alumi.svg.png'
      markImage.alt = 'can or aluminum recycle mark'
    }else if(material === 'Metal'){
      $('#markContainer').toggleClass('hidden')
      markImage.src = 'assets/steel.svg.png'
      $('#bagContainer').toggleClass('hidden')
      bagImage.src = 'assets/clearvinylbag.jpg'
    }else if(material === 'Glass'){
      $('#markContainer').toggleClass('hidden')
      markImage.src = 'assets/glass.png'
    }
  }else if(classification === !'Recyclable'){
    $('#markContainer').toggleClass('hidden')
    // markImage.src = image to show item is not recyclable
  }
}

