const fs = require("fs");
const Intl = require("intl");
const data = require("./data.json");
const { age, date } = require("./utils");

exports.index = (request, response) => {
  return response.render("instructors/index", { instructors: data.instructors });
}

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

    return response.redirect(`/instructors/${id}`);
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

  const instructor = {
    ...foundInstructor,
    age: age(foundInstructor.birth),
    services: foundInstructor.services.split(","),
    created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at)
  }

  return response.render("instructors/show", { instructor });
}

// Edit
exports.edit = (request, response) => {
  const { id } = request.params;

  const foundInstructor = data.instructors.find((instructor) => {
    return instructor.id == id;
  });

  if(!foundInstructor) return response.send("Instrutor não encontrado!");

  const instructor = {
    ...foundInstructor,
    birth: date(foundInstructor.birth)
  };

  return response.render("instructors/edit", { instructor });
}

// Put
exports.put = (request, response) => {
  const { id } = request.body;
  let index = 0;

  const foundInstructor = data.instructors.find((instructor, foundIndex) => {
    if(id == instructor.id) {
      index = foundIndex;
      return true;
    }
  });

  if(!foundInstructor) return response.send("Instrutor não encontrado!");

  const instructor = {
    ...foundInstructor,
    ...request.body,
    birth: Date.parse(request.body.birth),
    id: Number(request.body.id)
  }

  data.instructors[index] = instructor

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (error) => {
    if(error) return response.send("Erro na escrita!");

    return response.redirect(`/instructors/${id}`);
  });
}

// Delete
exports.delete = (request, response) => {
  const { id } = request.body;

  const filteredInstructors = data.instructors.filter((instructor) => {
    return instructor.id != id;
  });

  data.instructors = filteredInstructors;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (error) => {
    if(error) return response.send("Erro ao escrever o arquivo!");
  });

  return response.redirect("/instructors");
}