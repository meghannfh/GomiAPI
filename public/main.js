$(document).ready(function () {
  $("#name").autocomplete({
    source: async function (req, res) {
      let data = await fetch(`http://localhost:3001/search/?query=${req.term}`)
        .then((results) => results.json())
        .then((results) =>
          results.map((result) => {
            return {
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
      fetch(`http://localhost:3001/?get=${ui.item.id}`)
        .then((result) => result.json())
        .then((result) => {
          $("#name").empty();
          result.name.forEach((name) => {
            $(test).append("<li>${name}</li>");
          });
        });
    },
  });
});
