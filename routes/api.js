import { Router } from 'express';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import fs from 'fs';
import yts from 'yt-search';



//━━━━━━━━━━[ SCRAPER ]━━━━━━━━━━━━//
import pinterest from './utils/pinterest.js';
import { mediafire } from './utils/mediafire.js';
import { xnxxsearch, xnxxdl } from './utils/xnxx.js';
import { findKodeDaerah, jadwalSholat } from "./utils/jadwal-sholat.js";
import { spotifySearch, spotifydl } from './utils/spotify.js';
import yts from 'yt-search';
import SoundCloud from './utils/soundcloud.js';



const router = new Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




//━━━━━━━━━━[ FUNCTION ]━━━━━━━━━━━━//
const fetchJson = async (url) => {
try {
const res = await axios({method: "GET",url:url,headers: {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"}});
return res.data;
} catch (err) {
return err;
}
};
const getBuffer = async (url) => { 
try { 
const res = await axios({method: "get",url,headers:{ 'DNT':1,'Upgrade-Insecure-Request':1},responseType:'arraybuffer'}) 
return res.data 
} catch (err) { 
return err 
}
}
const getBufferV2 = async (url) => {
try {
const res = await axios({
method: "get",
url,
headers: {
'DNT': 1,
'Upgrade-Insecure-Request': 1
},
responseType: 'arraybuffer'
});
return Buffer.from(res.data); 
} catch (err) {
console.error("Error in getBuffer:", err.message);
throw new Error(`Failed to fetch buffer from URL: ${url}. ${err.message}`);
}
};




//━━━━━━━━━━[ START OF API GET ]━━━━━━━━━━━━//

router.get("/miya", async (req, res) => {
const img = [
"https://files.catbox.moe/2h6ldj.jpg",
"https://files.catbox.moe/yyd7g8.jpg",
"https://files.catbox.moe/dp93zm.jpg",
"https://files.catbox.moe/y85ffu.jpg",
"https://files.catbox.moe/bgbg25.jpg",
"https://files.catbox.moe/cl2fa8.jpg",
"https://files.catbox.moe/keqg4y.jpg",
"https://files.catbox.moe/qqi45m.jpg",
"https://files.catbox.moe/acrxij.jpg",
"https://files.catbox.moe/de5jxl.jpg",
"https://files.catbox.moe/ooyaax.jpg",
"https://files.catbox.moe/918gue.jpg",
];
const randomImgUrl = img[Math.floor(Math.random() * img.length)];
try {
const response = await axios.get(randomImgUrl, { responseType: "arraybuffer" });
const buffer = Buffer.from(response.data, "binary");
res.set({
"Content-Type": "image/jpeg", 
"Content-Length": buffer.length
});
res.send(buffer);
} catch (error) {
console.error("Error fetching image:", error);
res.status(500).send("Failed to load image.");
}
});


router.get("/renungan", async (req, res) => {
let riss = JSON.parse(fs.readFileSync(path.join(__dirname, 'utils/data/renungan.json')))
let imageUrl = riss[Math.floor(Math.random() * riss.length)];
const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
const buffer = Buffer.from(response.data, "binary");
res.set({
"Content-Type": "image/jpeg",
"Content-Length": buffer.length,
"Cache-Control": "public, max-age=31536000",
});
res.send(buffer);
});


router.get("/couple", async (req, res) => {
let riss = JSON.parse(fs.readFileSync(path.join(__dirname, 'utils/data/couple.json')))
let {male, female} = riss.result[Math.floor(Math.random() * riss.result.length)];
res.json({
status:true,
creator:"@krniwnstria",
result:{
female,
male
}
})
});


router.get("/wallpaper/", async (req, res) => {
const { query, resolusi } = req.query
if (!query || !resolusi) return res.status(400).json({ status: false, creator: "@krniwnstria", message: "[ ! ] mising query parameter query dan resolusi contoh: ?query=anime&resolusi=1612x720" })
const avaliableRes = ['2160x3840','1440x2560','1366x768','1080x1920','1024x600','960x544','800x1280','800x600','720x1280','540x960','480x854','480x800','360x640','320x480','320x240','240x400','240x320','3415x3415','2780x2780','3415x3415','2780x2780','1350x2400','1280x1280','938x1668','800x1420','800x1200','1600x1200','1400x1050','1280x1024','1280x960','1152x864','1024x768','3840x2400','3840x2160','2560x1600','2560x1440','2560x1080','2560x1024','2048x1152','1920x1200','1920x1080','1680x1050','1600x900','1440x900','1280x800','1280x720']
if (!avaliableRes.includes(resolusi)) return res.status(400).json({status:false, creator:"@krniwnstria", message:"Resolusi yang tersedia adalah: "+avaliableRes.join(", ")})
const { wallpaper } = await import("../routes/utils/wallpaper.js")
let r = await wallpaper(query, resolusi)
res.json(r)
})











//━━━━━━━━━━[ ALL ISLAMIC ]━━━━━━━━━━━━//
router.get("/jadwal-sholat", async (req, res) => {
let { kota } = req.query;
if (!kota)
return res.status(400).json({
status: false,
creator: "@krniwnstria",
message: "[ ! ] mising query parameter kota",
});
let kd = await findKodeDaerah(kota);
let riss = await jadwalSholat(kd.kode_daerah);
res.json(riss);
});
router.get("/surah/:surah", async (req, res) => {
let { surah } = req.params;
if (!surah) return res.status(400).json({ status: false, creator: "@krniwnstria", message: "Parameter 'surah' surah diperlukan. Contoh: /surah/17" });
let riss = JSON.parse(fs.readFileSync(path.join(__dirname, 'utils/data/quranaudio.json')))
let data = riss.filter((item) => item.number === parseInt(surah));
res.json({
status: true,
creator: "@krniwnstria",
data,
});
});
router.get("/surah-ayat/:surah/:ayat", async (req, res) => {
let { surah, ayat } = req.params;
if (!surah || !ayat)
return res.status(400).json({
status: false,
creator: "@krniwnstria",
message:
"[ ! ] mising query parameter nomor surah dan ayat, cth: /17/32",
});
let riss = await fetchJson(
`https://raw.githubusercontent.com/Jabalsurya2105/database/master/surah/surah%20${parseInt(surah)}.json`,
);
let data = riss.ayat.filter((item) => item.no === parseInt(ayat));
res.json({
status: true,
creator: "@krniwnstria",
data,
});
});
router.get("/hadist", async (req, res) => {
let { query, nomor } = req.query;
if (!query || !nomor)
return res.status(400).json({
status: false,
creator: "@krniwnstria",
message:
"Insert parameter query hadist dan nomor hadist, exempli gratia: ?query=abu  -daud&nomor=32, lista query: abu-daud, ahmad, bukhari, darimi, ibnu-majah, malik, muslim, nasai, tirmidzi",
});
let riss = await fetchJson(
`https://raw.githubusercontent.com/Jabalsurya2105/database/master/hadis/hadis%20${query}.json`,
);
if (parseInt(nomor) > riss.available)
return res.status(400).json({
status: false,
creator: "@krniwnstria",
message: `nomor hadist tidak tersedia, nomor yang tersedia adalah ${riss.available}`,
});
let data = riss.hadits.filter((item) => item.number === parseInt(nomor));
res.json({
status: true,
creator: "@krniwnstria",
data,
});
});









//━━━━━━━━━━[ ALL SEARCH ]━━━━━━━━━━━━//
router.get("/soundcloud", async(req, res) => {
var { query } = req.query;
if (!query) return res.status(400).json({ status : false, creator : `@krniwnstria`, message: 'missing parameter query.'})
let r = await SoundCloud.search(query)
res.json(r)
})



router.get("/yts", async(req, res) => {
var { query } = req.query;
if (!query) return res.status(400).json({ status : false, creator : `@krniwnstria`, message: 'missing parameter query.'})
let r = await yts(query)
res.json(r)
})



router.get("/ytlist", async(req, res) => {
var { list } = req.query;
if (!list) return res.status(400).json({ status : false, creator : `@krniwnstria`, message: 'missing parameter list.'})
let r = await yts( { listId: list } )
res.json(r)
})


router.get("/ytlist2", async(req, res) => {
var { list } = req.query;
if (!list) return res.status(400).json({ status: false, creator: '@krniwnstria', message: 'missing parameter list.' })
try {
let r = await yts({ listId: list })
res.json(r.videos.map(ues => ({ title: ues.title, description: ues.author.name, id: `!ytmp3 https://www.youtube.com/watch?v=${ues.videoId}` })))
} catch (error) {
res.status(500).json({ status: false, creator: '@krniwnstria', message: 'Error fetching playlist.', error: error.message })
}
})




router.get("/spotify", async(req, res) => {
var { query } = req.query;
if (!query) return res.status(400).json({ status : false, creator : `@krniwnstria`, message: 'missing parameter query.'})
let r = await spotifySearch(query)
res.json(r)
})



router.get("/xnxxsearch", async (req, res) => {
let { query } = req.query;
if (!query)
return res.status(400).json({
status: false,
creator: "@krniwnstria",
message: "[ ! ] mising query parameter query!",
});
let riss = await xnxxsearch(query);
res.json(riss);
});



router.get("/pinterest/:actions", async (req, res) => {
let { actions } = req.params
switch (actions) {
case 'search': {
let { query } = req.query
if (!query) return res.status(400).json({ status: false, creator: "@krniwnstria", message: "[ ! ] missing query parameter query!" })
let r = await pinterest.search(query)
res.json(r)
break
}
case 'download': {
let { url } = req.query
if (!url) return res.status(400).json({ status: false, creator: "@krniwnstria", message: "[ ! ] missing query parameter url!" })
let r = await pinterest.download(url)
res.json(r)
break
}
default: {
res.status(400).json({ status: false, creator: "@krniwnstria", message: "[ ! ] Unknown action provided!" })
break
}
}
})










//━━━━━━━━━━[ ALL DOWNLOADER ]━━━━━━━━━━━━//
router.get("/spotifydl", async(req, res) => {
var { url } = req.query;
if (!url) return res.status(400).json({ status : false, creator : `@krniwnstria`, message: 'missing parameter url.'})
let r = await spotifydl(url)
res.status(200).json(r)
})



router.get("/spotplay", async(req, res) => {
var { query } = req.query;
if (!query) return res.status(400).json({ status : false, creator : `@krniwnstria`, message: 'missing parameter query.'})
let r = await spotifySearch(query)
let oi = await spotifydl(r.results[0].url)
if (oi.url ==='https://api.fabdl.comundefined') return res.status(400).json({ status : false, creator : `@krniwnstria`, message: 'error'})
let oii = await getBuffer(oi.url)
res.set({
"Content-Type": "audio/mp3",
"Content-Length": oii.length,
"Cache-Control": "public, max-age=31536000",
"Accept-Ranges": "bytes", 
});
res.end(oii) 
})




router.get("/soundclouddl", async (req, res) => {
let { url } = req.query;
if (!url)
return res.status(400).json({
status: false,
creator: "@krniwnstria",
message: "[ ! ] mising query parameter url!",
});
let riss = await SoundCloud.download(url);
res.status(200).json(riss)
});




router.get("/mediafire", async (req, res) => {
let { url } = req.query;
if (!url)
return res.status(400).json({
status: false,
creator: "@krniwnstria",
message: "[ ! ] mising query parameter url!",
});
let riss = await mediafire(url);
res.status(200).json(riss);
});



router.get("/xnxxdl", async (req, res) => {
let { url } = req.query;
if (!url)
return res.status(400).json({
status: false,
creator: "@krniwnstria",
message: "[ ! ] mising query parameter url!",
});
let rissone = await xnxxdl(url);
let ro = await getBuffer(rissone.files.high ? rissone.files.high : rissone.files.low)
res.set({
"Content-Type": "video/mp4",
"Content-Length": ro.length,
"Cache-Control": "public, max-age=31536000",
"Accept-Ranges": "bytes", 
});
res.end(ro)
});





export default router
