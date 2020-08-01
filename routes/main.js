const Fuse = require("fuse.js");

const renderFoodList = (req, res) => {
  // query database to get all the books
  let sqlquery = "SELECT * FROM food";
  // execute sql query
  db.query(sqlquery, (err, result) => {
    if (err) {
      res.redirect("/");
    }
    res.render("list.html", { foodList: result });
  });
};

const renderSearch = (req, res) => {
  res.render("search.html");
};

module.exports = function (app) {
  /*
    purpose: serve the index.html
    inputs: none
    outputs: renders index.html
  */
  app.get("/", function (req, res) {
    res.render("index.html");
  });

  /*
    purpose: serve the about.html
    inputs: none
    outputs: renders about.html
  */
  app.get("/about", function (req, res) {
    res.render("about.html");
  });

  /*
    purpose: serve the food_form.html
    inputs: none
    outputs: renders food_form.html
  */
  app.get("/add_food", function (req, res) {
    res.render("food_form.html", {
      url: `/food_added`,
      method: "POST",
      initialValues: {},
    });
  });

  /*
    purpose: handles data passed from food_form form to submit it to the database and renders success message
    inputs: all the required fields for a successful row insertions in the "food" table
    outputs: renders success.html
  */
  app.post("/food_added", function (req, res) {
    // saving data in database
    const sqlquery =
      "INSERT INTO food (name, typical_values_per, typical_values_unit, calories, carbs, fat, protein, salt, sugar) VALUES (?,?,?,?,?,?,?,?,?)";
    const {
      name,
      typical_values_per,
      typical_values_unit,
      calories,
      carbs,
      fat,
      protein,
      salt,
      sugar,
    } = req.body;
    // execute sql query
    const newrecord = [
      name,
      typical_values_per,
      typical_values_unit,
      calories,
      carbs,
      fat,
      protein,
      salt,
      sugar,
    ];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) return console.error(err.message);

      const message = `Record Added : ${JSON.stringify(result)}`;
      res.render("success.html", { message });
    });
  });

  /*
    purpose: gets all food from database and serves it as a table in list.html
    inputs: none
    outputs: renders list.html
  */
  app.get("/list", renderFoodList);

  /*
    purpose: serve the search.html
    inputs: none
    outputs: renders search.html
  */
  app.get("/search", renderSearch);

  /*
    purpose: serve the list.html with the matching data from food table
    inputs: search keyword from search.html form.
    outputs: renders list.html with the food array
  */
  app.get("/search-result", function (req, res) {
    // get all the records first
    let sqlquery = "SELECT * FROM food";

    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) return console.error(err.message);

      // setup fuse.js instance for fuzzy search
      const fuse = new Fuse(result, {
        keys: ["name"],
      });

      // search all the records, get the results, and clean them
      const fuzzyResults = fuse.search(req.query.keyword).map((x) => x.item);

      res.render("list.html", { foodList: fuzzyResults });
    });
  });

  /*
    purpose: serve the search.html
    inputs: none
    outputs: renders search.html
  */
  app.get("/update_food", renderSearch);

  /*
    purpose: serve the food_form.html with input fields prefilled with the inputted foodId
    inputs: food id in the url params
    outputs: renders food_form.html
  */
  app.get("/update_food/:id", function (req, res) {
    let sqlquery = "SELECT * FROM food WHERE id=?";

    // execute sql query
    db.query(sqlquery, req.params.id, (err, result) => {
      if (err) return console.error(err.message);

      res.render("food_form.html", {
        url: `/food_updated/${req.params.id}`,
        method: "POST",
        initialValues: result[0],
      });
    });
  });

  /*
    purpose: handles the form submission of update form field and insert the data to the database.
    inputs: food id in the request params, also all the neccessary fields to update food in the database in request body.
    outputs: renders success.html
  */
  app.post("/food_updated/:id", function (req, res) {
    // saving data in database
    const sqlquery = `
      UPDATE food
      SET name = ?, 
          typical_values_per = ?,
          typical_values_unit = ?,
          calories = ?,
          carbs = ?,
          fat = ?,
          protein = ?,
          salt = ?,
          sugar = ?
      WHERE id = ?
    `;

    const {
      name,
      typical_values_per,
      typical_values_unit,
      calories,
      carbs,
      fat,
      protein,
      salt,
      sugar,
    } = req.body;
    // execute sql query
    const newrecord = [
      name,
      typical_values_per,
      typical_values_unit,
      calories,
      carbs,
      fat,
      protein,
      salt,
      sugar,
      req.params.id,
    ];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) return console.error(err.message);

      const message = `Record Updated : ${JSON.stringify(result)}`;
      res.render("success.html", { message });
    });
  });
};
