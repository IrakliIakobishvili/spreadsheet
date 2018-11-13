const Spreadsheet = {
    databaseName        : "spreadsheetBase",
    database            : [],

    addStudentBtn       : document.getElementById("addStudentBtn"),
    removeStudentBtn    : document.getElementById("removeStudentBtn"),
    studentListTbody    : document.getElementById("studentListTbody"),
    totalStudent        : document.getElementById("totalStudent"),
    showAverageScore    : document.getElementById("showAverageScore"),
    higestScoreStudent  : document.getElementById("higestScoreStudent"),
    removeStudentBtn    : document.getElementById("removeStudentBtn"),

    serialize: function (obj) {
        return JSON.stringify(obj);
    },
    deserialize: function (obj) {
        return JSON.parse(obj);
    },
    createDatabase: function() {
        if(localStorage.getItem(Spreadsheet.databaseName) === null) {
            localStorage.setItem(Spreadsheet.databaseName,Spreadsheet.serialize(Spreadsheet.database));   
        }
    },
    Person: function (id,fullname) {
        this.id = id;
        this.fullName = fullname;
        this.scores = [];
    },
    Score: function(score,x,y,color) {
        this.score = score;
        this.x = x;
        this.y = y;
        this.date = new Date().toISOString().split('T')[0];
        this.weekDay = new Date().toDateString().split(" ")[0];
        this.color = color;
    },
    addStudents: function() {
        function addNewStudent() {
            let studentName = prompt("Enter Full Name");
            // studentName = studentName.replace(/[0-9]/g, "");
            if(isNaN(studentName)) {
                let database = Spreadsheet.deserialize(localStorage.getItem(Spreadsheet.databaseName));
                let id = 0;
                if(database.length === 0) {
                    id = 1;
                }else {
                    id = database[database.length - 1].id + 1;
                }
                let newStudent = new Spreadsheet.Person(id,studentName);
                database.push(newStudent);
                localStorage.setItem(Spreadsheet.databaseName,Spreadsheet.serialize(database));
            }else {
                alert("Please enter real name");
            } 
            
            Spreadsheet.loadStudents();
        }//addNewStudent
        Spreadsheet.addStudentBtn.addEventListener("click",addNewStudent);
    },
    loadStudents: function() {
        Spreadsheet.studentListTbody.innerHTML = "";
        let database = Spreadsheet.deserialize(localStorage.getItem(Spreadsheet.databaseName));
        let index = 0;
        for(let i = 0; i < database.length; i++) {
            index++;
            let tr = document.createElement("tr");
            tr.setAttribute("data-student-id",database[i].id);
            let currentStudentID = database[i].id;
            let currentStudentFullName = database[i].fullName;
            for(let ii = 1; ii < 7; ii++) {
                let td = document.createElement("td");
                td.setAttribute("data-x",currentStudentID);
                td.setAttribute("data-y",ii);
                let span = document.createElement("span");
                td.appendChild(span);
                if(ii === 1) {
                    let btn = document.createElement("button");
                    btn.classList.add("removeBtn");
                    let i = document.createElement("i");
                    i.classList.add("fas");
                    i.classList.add("fa-trash");
                    btn.appendChild(i);
                    btn.setAttribute("data-student-id",currentStudentID);
                    td.innerHTML = currentStudentFullName;
                    let div = document.createElement("div");
                    div.classList.add("studentsIndex");
                    div.innerHTML = index;
                    td.appendChild(div);
                    td.appendChild(btn);
                }                               
                tr.appendChild(td);
                Spreadsheet.studentListTbody.appendChild(tr);
            }
        }
        Spreadsheet.addScore();
        Spreadsheet.loadScore(); 
        Spreadsheet.removeStudent();
        Spreadsheet.totalStudents();
        Spreadsheet.averageScore();
        Spreadsheet.maxScoreStudent();
    },
    addScore: function() {
        let database = Spreadsheet.deserialize(localStorage.getItem(Spreadsheet.databaseName));
        let spans = Spreadsheet.studentListTbody.getElementsByTagName("span");
        for(let i = 0; i < spans.length; i++) {
            function addingScore() {
                let txt;
                (this.innerHTML.trim() === "") ? txt = "Enter Score" : txt = "Change Score "+this.innerHTML+" with:";
                let enteredScore = prompt(txt);
                if(isNaN(enteredScore)) {
                    alert("Only Numbers Are Allowed!");                    
                }else if(enteredScore !== "" && enteredScore !== null) {
                    (enteredScore > 5) ? enteredScore = 5 : (enteredScore < 0) ? enteredScore = 0 : true;
                    let color;
                    (enteredScore < 4 && enteredScore > -Infinity) ? color = "red" : (enteredScore == 4) ? color = "tomato" : (enteredScore > 4) ? color = "green" : true;
                    enteredScore = Number(enteredScore);
                    let x = Number(this.parentNode.getAttribute("data-x"));
                    let y = Number(this.parentNode.getAttribute("data-y"));
                    let score = new Spreadsheet.Score(enteredScore,x,y,color);
                    for(let ii = 0; ii < database.length; ii++) {
                        if(database[ii].id === x) {
                            let currentStudent = database[ii];

                            if(currentStudent.scores.length === 0) {
                                currentStudent.scores.push(score);
                                localStorage.setItem(Spreadsheet.databaseName,Spreadsheet.serialize(database));
                            }else {
                                let matchedScoreAndTd = 0;
                                for(let iii = 0; iii < currentStudent.scores.length; iii++) {
                                    let studentScore = currentStudent.scores[iii];
                                    if(studentScore.x === x && studentScore.y === y) {                                        
                                        studentScore.score = enteredScore;
                                        studentScore.color = color;
                                        localStorage.setItem(Spreadsheet.databaseName,Spreadsheet.serialize(database));
                                        matchedScoreAndTd++;
                                    }                                   
                                }
                                if(matchedScoreAndTd === 0) {
                                    currentStudent.scores.push(score);
                                    localStorage.setItem(Spreadsheet.databaseName,Spreadsheet.serialize(database));
                               }
                            }                            
                        }
                    }
                }
                Spreadsheet.loadScore();  
                Spreadsheet.averageScore();  
                Spreadsheet.maxScoreStudent(); ///////////////////irakli          
            }//addingScore
            spans[i].addEventListener("click",addingScore);
        }
    },
    loadScore: function() {
        let database = Spreadsheet.deserialize(localStorage.getItem(Spreadsheet.databaseName));
        let tds = Spreadsheet.studentListTbody.getElementsByTagName("td");
        for(let i = 0; i < tds.length; i++) {
            let currentTd = tds[i];
            let x = Number(currentTd.getAttribute("data-x"));
            let y = Number(currentTd.getAttribute("data-y"));

            for(let ii = 0; ii < database.length; ii++) {
                let currentStudent = database[ii];
                for(let iii = 0; iii < currentStudent.scores.length; iii++) {
                    let currentScore = currentStudent.scores[iii];
                    if(currentScore.x === x && currentScore.y === y) {
                        currentTd.getElementsByTagName("span")[0].innerHTML = currentScore.score;
                        currentTd.getElementsByTagName("span")[0].style.backgroundColor = currentScore.color;
                    }
                }
            } 
        }
    },
    removeStudent: function() {
        let removeBtns = Spreadsheet.studentListTbody.getElementsByClassName("removeBtn");
        function removeCurrentStudent() {
            let database = Spreadsheet.deserialize(localStorage.getItem(Spreadsheet.databaseName));
            let studentIDWeRemove = Number(this.getAttribute("data-student-id"));
            for(let i = 0; i < database.length; i++) {
                let currentStudent = database[i];
                if(currentStudent.id === studentIDWeRemove) {
                    let indexOfcurrentStudentInDatabase = database.indexOf(currentStudent);
                    database.splice(indexOfcurrentStudentInDatabase,1);
                    localStorage.setItem(Spreadsheet.databaseName,Spreadsheet.serialize(database));
                    Spreadsheet.loadStudents();
                }
            }
        }//removeCurrentStudent
        for(let i = 0; i < removeBtns.length; i++) {
            removeBtns[i].addEventListener("click",removeCurrentStudent);
        }
    },
    totalStudents: function() {
        let database = Spreadsheet.deserialize(localStorage.getItem(Spreadsheet.databaseName));
        Spreadsheet.totalStudent.innerHTML = database.length;
    },
    averageScore: function() {
        let database = Spreadsheet.deserialize(localStorage.getItem(Spreadsheet.databaseName));
        let totalScores = 0;
        for(let i = 0; i < database.length; i++) {
            let currentStudent = database[i];
            for(let ii = 0; ii < currentStudent.scores.length; ii++) {
                totalScores += currentStudent.scores[ii].score;
            }
        }
        
        (database.length === 0) ? database.length = 1 : true;
        let calculatedAverage = (totalScores / database.length).toFixed(1);
        (calculatedAverage == 0.0) ? calculatedAverage = 0 : true;
        Spreadsheet.showAverageScore.innerHTML = calculatedAverage;
    },
    maxScoreStudent: function() {
        let database = Spreadsheet.deserialize(localStorage.getItem(Spreadsheet.databaseName));
        let studentWithMaxScore = "";
        let maxScore = 0;
        for(let i = 0; i < database.length; i++) {
            let currentStudent = database[i];
            let currentStudentTotalScore = 0;
            for(let ii = 0; ii < currentStudent.scores.length; ii++) {
                currentStudentTotalScore += currentStudent.scores[ii].score;                
            }
            if(currentStudentTotalScore > maxScore) {
                maxScore = currentStudentTotalScore;
                studentWithMaxScore = currentStudent;
            }
        }
        if(studentWithMaxScore.hasOwnProperty("fullName")) {
            Spreadsheet.higestScoreStudent.innerHTML = studentWithMaxScore.fullName +" "+maxScore;
        }else {
            Spreadsheet.higestScoreStudent.innerHTML = "";
        }
    },
    clearDatabase: function() {
        function clearBase() {
            localStorage.removeItem(Spreadsheet.databaseName);
            Spreadsheet.createDatabase();
            Spreadsheet.loadStudents();
        }//clearBase
        Spreadsheet.removeStudentBtn.addEventListener("click",clearBase);
    }
}

Spreadsheet.createDatabase();
Spreadsheet.addStudents();
Spreadsheet.loadStudents();
Spreadsheet.clearDatabase();