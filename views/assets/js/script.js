window.addEventListener('load', async() => {
document.getElementById('preloader').style.display = "none";
Swal.fire({
title:"Welcome To SatzzAPI!",
imageUrl:'./img/img.png',
imageWidth: 200,
imageHeight: 200,
background: '#121317',
color: '#fff',
confirmButtonColor: '#5E2FB3',
customClass: {
popup: 'rounded-lg shadow-lg',
confirmButton: 'px-4 py-2'
}
});
})
var typed = new Typed('#typing', {
strings: ['SatzzAPI'],
typeSpeed: 70,
backSpeed:70,
loop: true
});


navigator.getBattery().then(b=>{
let charging=b.charging
let lvl=Math.round(b.level*100)+'% '+(charging?'(Charging)':'(Not Charging)')
document.getElementById('batteryLevel').innerText=lvl
let icon=document.getElementById('batteryIcon')
icon.className=charging?'p-3 mr-4 text-green-100 bg-green-500 rounded-lg fas fa-bolt':'p-3 mr-4 text-red-100 bg-red-500 rounded-lg fas fa-battery-empty'
})

setInterval(() => {
const now = new Date(),s=now.getSeconds(),m=now.getMinutes(),h=now.getHours();
document.getElementById("second").style = `--value:${s};`
document.getElementById("minute").style = `--value:${m};`
document.getElementById("hour").style = `--value:${h%12||12};`
document.getElementById("ampm").textContent =h>= 12?"PM":"AM";
}, 100);

let allAud = ['Aku Dah Lupa.mp3','Pica Pica (Remix).mp3','DITINGGAL BANG DIKA.mp3','DJ Kaka Main Salah FYP TIK TOK.mp3','DJ Like This Gafarastyle.mp3','Faja Skali ⧸ Dola (Versi Campur).mp3','Gak Mau Lagi (Cover Version).mp3','Garam Dan Madu.mp3','Jangan Gila Dong (Cover Version).mp3','Jangan Salah Pasangan V2.mp3','Pemberi Harapan Palsu.mp3']
let audio = new Audio()
let isPlaying = false
function pickRandom(){
return './audio/' + allAud[Math.floor(Math.random()*allAud.length)]
}
function playNext(){
let file = pickRandom()
audio.src = file
audio.load()
audio.play()
isPlaying = true
if ("mediaSession" in navigator) {
navigator.mediaSession.metadata =
new MediaMetadata({
title:file.split('./audio/')[1].split('.mp3')[0],
artist:"SatzzDev",
artwork:[{src:"https://i1.sndcdn.com/artworks-8QaW8oJBjUPJ-0-t500x500.jpg",type:"image/jpeg",sizes:"500x500"}]
})
}
}
audio.addEventListener("ended", ()=> playNext())
async function playBackSounds() {
if (!isPlaying) {
playNext()
navigator.mediaSession.setActionHandler('play', ()=> audio.play())
navigator.mediaSession.setActionHandler('pause', ()=> audio.pause())
navigator.mediaSession.setActionHandler('stop', ()=> audio.pause())
}
}



