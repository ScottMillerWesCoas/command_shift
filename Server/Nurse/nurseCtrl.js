const Nurses = require('./nurseMdl');

function index(req, res) {
  Nurses.find({ }, (err, nurses) => {
    if (!nurses) res.sendStatus(404);
    else res.json(nurses);
  });
}

function show(req, res) {
  Nurses.findOne({ first: req.body.first, last: req.body.last }, (err, nurse) => {
    if (!nurse) res.sendStatus(404);
    else res.json(nurse);
  });
}

// create new nurse doc in Nurses collection -- HIRED! :D
function add(req, res) {
  Nurses.create({ first: req.body.first, last: req.body.last }, () => {
    res.send('posted');
  });
}

// remove nurse doc from Nurses collection -- FIRED :(
function remove(req, res) {
  Nurses.remove({ first: req.body.first, last: req.body.last }, () => {
    res.send('deleted');
  });
}


// updates nurse docs in nurse DB with new shift assignments
function sendAssignment(req, res) {
  const shifts = req.body.assignment;
  const onDuty = req.body.onDuty;
  const response = {
    onDuty: req.body.onDuty,
    assignment: req.body.assignment,
  };

  onDuty.forEach((nurse, i) => {
    const name = nurse.split(' ');
    Nurses.update({ first: name[0], last: name[1] },
      { $set: { beds: [] } }, (err, result) => result);

    Nurses.update({ first: name[0], last: name[1] },
      { $addToSet: { beds: { $each: shifts[i] } } },
      (err, result) => result);
  });
  res.send(response);
}

function clearAssignments(req, res) {
  Nurses.update({ }, { $set: { beds: [] } }, (err, result) => result);
  res.send();
}

function verifyNurse(req, res, next) {
  Nurses.findOne({ first: req.body.first, last: req.body.last }, (err, nurse) => {
    if (err) throw err;
    if (!nurse) res.send("Error! You don't know your own name.");
    next();
  });
}

function postAssignments(req, res) {
  Nurses.find({ first: req.body.first, last: req.body.last }, 'beds', (err, beds) => {
    if (err) throw err;
    res.send(beds[0].beds);
    // res.send(beds);
  });
}

module.exports = {
  index,
  show,
  add,
  remove,
  sendAssignment,
  clearAssignments,
  postAssignments,
  verifyNurse,
};
