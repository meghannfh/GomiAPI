const paperImage = '1024px-Recycling_kami.svg.png'
const aluminumImage = '1280px-Recycling_alumi.svg.png'
const plasticImage = '1280px-Recycling_pla.svg.png'
const steelImage = '1280px-Recycling_steel.svg.png'

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
      console.log(ui.item.id);
      fetch(`http://localhost:3001/get/${ui.item.id}`)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          $("#test").empty();
          result.name && $("#test").append("Item: " + `<li>${result.name}</li>`);
          result.classification && $("#test").append("Classification: " + `<li>${result.classification}</li>`)
          result.instructions && $("#test").append("Instructions: " + `<li>${result.instructions}</li>`);
          result.material && $("#test").append("Material: " + `<li>${result.material}</li>`);
          result.contact && $("#test").append("Contact: " +  `<li>${result.contact}</li>`);
          if (result.material == "Paper") {
            // $("#test").append(`<li>Burnable image</li>`);
            $('img').attr('src', paperImage)
          } else if (result.material == "Plastic"){
            $('img').attr('src', plasticImage)
          } else if (result.material == "Steel"){
            $('img').attr('src', steelImage)
          } else if (result.material == "Aluminum"){
            $('img').attr('src', aluminumImage)
          }
        });
    },
  });
});
