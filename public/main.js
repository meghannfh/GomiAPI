const paperImage = '1024px-Recycling_kami.svg.png'

let timer;

let itemName;
let classification;
let instructions;
let material;
let contact;

document.addEventListener('input', e => {
  const el = e.target;
  
  if( el.matches('[data-color]') ) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      document.documentElement.style.setProperty(`--color-${el.dataset.color}`, el.value);
    }, 100)
  }
})

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
      $('#burnable').addClass('hidden')
      $('#nonburnable').addClass('hidden')
      $("#instructions").text('')
      $("#material").text('')
      console.log(ui.item.id);
      fetch(`http://localhost:3001/get/${ui.item.id}`)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          $("#info").removeClass('hidden')
          $("#name").val('')
          $("#test").empty();
          itemName = result.name
          classification = result.classification
          material = result.material
          instructions = result.instructions
          contact = result.contact

          $("#itemName").text(itemName);
          instructions && $("#instructions").text(instructions);
          material && $("#material").text(material);

          checkForContact()
          contact && $("#contactNumber").text(contact);
          if (classification == "Burnable") {
            $('#burnable').toggleClass('hidden')
            // $('img').attr('src', paperImage)
          } else {
            $('#nonburnable').toggleClass('hidden')
          }
        });
    },
  });
});

function checkForContact(){
  if(contact){
    document.getElementById('contactInfo').classList.add('show-contact')
  }else{
    document.getElementById('contactInfo').classList.remove('show-contact')
  }
}