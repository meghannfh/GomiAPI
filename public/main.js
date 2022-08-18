const classificationTypes = document.querySelectorAll('.classTypes')
const headers = document.querySelectorAll('.headers')
const images = document.querySelectorAll('.images')
let markImage = document.getElementById('markImg').src;
let bagImage = document.getElementById('bagImg').src;

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

      reAddClassHidden()
      bagImage = ''

      $("#instructions").text('')
      $("#material").text('')
      console.log(ui.item.id);
      fetch(`http://localhost:3001/get/${ui.item.id}`)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          $("#info").removeClass('hidden')
          $("#name").val('')

          itemName = result.name
          classification = result.classification
          material = result.material
          instructions = result.instructions
          contact = result.contact

          $("#itemName").text(itemName);

          if(instructions){
            $('#instructionsHeader').toggleClass('hidden')
            $("#instructions").text(instructions)
          }

          if(material){
            $('#materialHeader').toggleClass('hidden')
            $("#material").text(material)
          }

          // instructions && $("#instructions").text(instructions);
          // material && $("#material").text(material) && document.querySelector('.itemMaterial').toggleClass('hidden');

          checkForContact()

          contact && $("#contactNumber").text(contact);

          if (classification == "Burnable") {
            $('#burnable').toggleClass('hidden')
            $('#bagContainer').toggleClass('hidden')
            bagImage = 'public/burnablebag.jpg'

          } else if(classification == 'Non-burnable'){
            $('#nonburnable').toggleClass('hidden')

          } else if(classification == 'Recyclable'){
            $('#recyclable').toggleClass('hidden')

          } else if(classification == 'Not collectable'){
            $('#nonCollectable').toggleClass('hidden')

          } else if(classification == 'Oversized'){
            $('#overSize').toggleClass('hidden')
          
          }
        });
    },
  });
});


//Check each search for contact property and display contact info box if it exists
//If !contact then hide contact info box when each new item is selected
function checkForContact(){
  if(contact){
    document.getElementById('contactInfo').classList.add('show-contact')
    document.getElementById('xmark').addEventListener('click', ()=>{
      document.getElementById('contactInfo').classList.remove('show-contact')
    })
  }else{
    document.getElementById('contactInfo').classList.remove('show-contact')
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
}