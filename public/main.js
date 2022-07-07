const paperImage = '1024px-Recycling_kami.svg.png'

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
          $("#test").append(`<li>${result.name}</li>`);
          $("#test").append(`<li>${result.classification}</li>`)
          $("#test").append(`<li>${result.instructions}</li>`);
          $("#test").append(`<li>${result.material}</li>`);
          $("#test").append(`<li>${result.contact}</li>`);
          if (result.classification == "Burnable") {
            // $("#test").append(`<li>Burnable image</li>`);
            $('img').attr('src', paperImage)
          } else if (result.classification == "Non-burnable"){

          }
        });
    },
  });
});
