document.addEventListener('DOMContentLoaded', async() => {
Swal.fire({
title:"Welcome To SatzzAPI!",
imageUrl:'./img/img.png',
imageWidth: 200,
imageHeight: 200,
background: '#121317',
color: '#fff',
customClass: {
popup: 'rounded-lg shadow-lg',
confirmButton: 'px-4 py-2'
}
});
})

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



