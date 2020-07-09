const fs = require("fs");
const data = require("../data.json");
const { age, date } = require("../utils");

exports.index = (request, response) => {
  return response.render("members/index", { members: data.members });
}

// Create
exports.create = (request, response) => {
  return response.render("members/create");
}
exports.post = (request, response) => {
  const keys = Object.keys(request.body);

  for(key of keys) {
    if(request.body[key] == "")
      return response.send("Por favor preencha todos os campos.");
  }

  birth = Date.parse(request.body.birth);

  let id = 1;
  const lastMember = data.members[data.members.length - 1];

  if(lastMember)
    id = lastMember.id + 1;

  data.members.push({
    ...request.body,
    id,
    birth
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (error) => {
    if(error) return response.send("White file error!");

    return response.redirect(`/members/${id}`);
  });

  // return response.send(request.body);
}

// Show
exports.show = (request, response) => {
  const { id } = request.params;

  const foundMember = data.members.find((member) => {
    return member.id == id;
  });

  if(!foundMember) return response.send("Instrutor não encontrado!");

  let bloodType = "";

  switch (foundMember.blood) {
    case "A1":
      bloodType = "A+"
      break;

    case "A0":
      bloodType = "A-"
      break;

    case "B1":
      bloodType = "B+"
      break;

    case "B0":
      bloodType = "B-"
      break;

    case "AB1":
      bloodType = "AB+"
      break;

    case "AB0":
      bloodType = "AB-"
      break;

    case "O1":
      bloodType = "O+"
      break;
  
    case "O0":
      bloodType = "O-"

    default:
      break;
  }

  const member = {
    ...foundMember,
    age: age(foundMember.birth),
    birth: date(foundMember.birth).br,
    blood: bloodType
  }

  return response.render("members/show", { member });
}

// Edit
exports.edit = (request, response) => {
  const { id } = request.params;

  const foundMember = data.members.find((member) => {
    return member.id == id;
  });

  if(!foundMember) return response.send("Instrutor não encontrado!");

  const member = {
    ...foundMember,
    birth: date(foundMember.birth).iso
  };

  return response.render("members/edit", { member });
}
exports.put = (request, response) => {
  const { id } = request.body;
  let index = 0;

  const foundMember = data.members.find((member, foundIndex) => {
    if(id == member.id) {
      index = foundIndex;
      return true;
    }
  });

  if(!foundMember) return response.send("Instrutor não encontrado!");

  const member = {
    ...foundMember,
    ...request.body,
    birth: Date.parse(request.body.birth),
    id: Number(request.body.id)
  }

  data.members[index] = member

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (error) => {
    if(error) return response.send("Erro na escrita!");

    return response.redirect(`/members/${id}`);
  });
}

// Delete
exports.delete = (request, response) => {
  const { id } = request.body;

  const filteredMembers = data.members.filter((member) => {
    return member.id != id;
  });

  data.members = filteredMembers;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (error) => {
    if(error) return response.send("Erro ao escrever o arquivo!");
  });

  return response.redirect("/members");
}