const controls = document.querySelector('.control');
const subjpicked = document.getElementById('pickedsubject');
let state = 0; /*0=idle,1=running,2=paused */
let subject = null;
let lastmnt = 0;

function setTimerState(state) {
    controls.className = `control state-${state}`;
}

document.getElementById('sendsubjbtn').addEventListener('click', () => {
    const selcRadio = document.querySelector('input[name="subj-opt"]:checked');
    if  (selcRadio) {
        subject = selcRadio.value
        console.log(selcRadio.value)
    } else {
        alert('Please select an option first!')
    }

    switch (subject) {
        case 'Math':
            subjpicked.textContent = 'Mathematics'
            break;
        case 'Lang':
            subjpicked.textContent = 'Languages'
            break;
        case 'Inf':
            subjpicked.textContent = 'Informatik'
            break;
        case 'Natscie':
            subjpicked.textContent = 'Natural Sciences'
            break;
        case 'Sostud':
            subjpicked.textContent = 'Social Studies'
            break;
        default:
            subjpicked.textContent = 'Not Selected'
            break;
    }
});

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;

const TimerDisplay = document.getElementById('timer');
const Startbtn = document.getElementById('start-btn');
const Pausebtn = document.getElementById('pause-btn');
const Resumebtn = document.getElementById('resume-btn');
const Stopbtn = document.getElementById('stop-btn');

function formatTime(ms) {
    const totalsec = Math.floor(ms / 1000);
    const hours = Math.floor(totalsec / 3600);
    const minutes = Math.floor((totalsec % 3600) / 60);
    const seconds = totalsec % 60;

    const pad = (num) => String(num).padStart(2, "0");
    return `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
};

function newMinute(crrntmnt) {
    sendsubj(subject)
};

function startTimer() {
    elapsedTime = 0;
    lastmnt = 0;
    startTime = performance.now();

    timerInterval = setInterval(() => {
        elapsedTime = performance.now() - startTime;
        TimerDisplay.textContent = formatTime(elapsedTime);

        const currentmnt = Math.floor(elapsedTime / 60000);

        if (currentmnt > lastmnt) {
            lastmnt = currentmnt;
            newMinute(currentmnt);
        };
    }, 1000);
};

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
};

function resumeTimer() {
    startTime = performance.now() - elapsedTime;

    timerInterval = setInterval(() => {
        elapsedTime = performance.now() - startTime;
        TimerDisplay.textContent = formatTime(elapsedTime);

        const currentmnt = Math.floor(elapsedTime / 60000);

        if (currentmnt > lastmnt) {
            lastmnt = currentmnt;
            newMinute(currentmnt);
        };
    }, 1000);
};

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = 0;
    lastmnt = 0;

    TimerDisplay.textContent = "00 : 00 : 00";
};

document.getElementById('start-btn').addEventListener('click', () => {
    if (subject) {
        setTimerState('running')
        startTimer()
        state = 1
    }
});

document.getElementById('pause-btn').addEventListener('click', () => {
    setTimerState('paused')
    pauseTimer()
    state = 2
});

document.getElementById('resume-btn').addEventListener('click', () => {
    setTimerState('running')
    resumeTimer()
    state = 1
});

document.getElementById('stop-btn').addEventListener('click', () => {
    setTimerState('idle')
    stopTimer()
    state = 0
});

async function sendsubj(subjname) {
    const response = await fetch("/add-subject", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({subject: subjname})
    });

    const result = await response.json();
    console.log("JSON Updated:", result);
}

async function getsubj() {
    const response = await fetch("/get-subjects");
    const result = await response.json();
    console.log("JSON gotten:", result);
}

class subjcard {
    constructor(data) {
        this.data = data;
        
        const hours = Math.floor(data["elap"] / 60);
        const minutes = Math.floor(data["elap"] % 60);

        const formatted = `${hours}${hours === 1 ? "hr" : "hrs"} ${minutes}m`;
        this.timed = formatted;
    }

    render() {
        `<h4 class="subjdayc">${this.data} ${this.timed}</h4>`;
    }
}

async function loadstats() {
    const dailylist = document.getElementById('daily-counted');
    dailylist.innerHTML = '';

    try {
        const subjs = await getsubj();

        subjs.forEach(subj => {
            const card = subjcard(subj)
            dailylist.insertAdjacentHTML('beforeend', card.render());
        });
    } catch (err) {
        console.error("FAiled to load stats", err);
    }
}