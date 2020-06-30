const fs = require("fs");
const data = require("./data.json");

// Create
exports.post = (request, response) => {
  const keys = Object.keys(request.body);

  for(key of keys) {
    if(request.body[key] == "")
      return response.send("Por favor preencha todos os campos.");
  }

  let { avatar_url, name, birth, gender, services } = request.body;

  birth = Date.parse(request.body.birth);
  const id = Number(data.instructors.length + 1);
  const created_at = Date.now();

  data.instructors.push({
    id,
    avatar_url,
    name,
    birth,
    created_at,
    gender,
    services
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (error) => {
    if(error) return response.send("White file error!");

    return response.redirect("/instructors");
  });

  // return response.send(request.body);
}

// Show
exports.show = (request, response) => {
  const { id } = request.params;

  const foundInstructor = data.instructors.find((instructor) => {
    return instructor.id == id;
  });

  if(!foundInstructor) return response.send("Instrutor não encontrado!");

  return response.send(foundInstructor);
}

// Update


// Delete