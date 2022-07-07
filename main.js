$(document).ready(function () {
  $("#item").autocomplete({
    source: async function (req, res) {
      let data = await fetch(`http://localhost:3001/search/?query=${req.term}`)
        .then((results) => results.json())
        .then((results) =>
          results.map((result) => {
            return {
              label: result.name,
              value: result.name,
              id: result._id
            };
          })
        );
      res(data);
      console.log(data)
    },
    minLength: 2,
    select: function (event, ui) {
      console.log(ui.item.id);
      fetch(`http://localhost:3001/get/${ui.item.id}`)
        .then((result) => result.json())
        .then((result) => {
          $("#info").empty();//fix this
          $('#info').append(`<li>${result.name}</li>`)
          $('#info').append(`<li>${result.classification}</li>`)
        })
    }
  })
})