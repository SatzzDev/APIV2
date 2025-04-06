import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import os from "os";
import fs from 'fs';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import apiRoutes from "./routes/api.js";
const app = express();

//━━━━━━━━━━━━━━━[ Helper Functions ]━━━━━━━━━━━━━━━━━//
const getFeatureList = (req) => {
const routes = [];
const extractRoutes = (stack, basePath = '/api') => {
stack.forEach((m) => {
if (m.route) routes.push(`/api${m.route.path}`);
else if (m.handle?.stack) extractRoutes(m.handle.stack, basePath + (m.regexp.source.replace('^\\/', '/').replace('\\/?$', '') || ''));
});
};
extractRoutes(app._router.stack);
return routes.sort();
};

function formatUptime(uptime) {
let seconds = Math.floor(uptime % 60);
let minutes = Math.floor((uptime / 60) % 60);
let hours = Math.floor((uptime / 3600) % 24);
let days = Math.floor(uptime / 86400);

if (days > 0) {
return { days: `${days}d`, hours: hours.toString(), minutes: minutes.toString(), seconds: seconds.toString() };
}
return { hours: hours.toString(), minutes: minutes.toString(), seconds: seconds.toString() };
}

const listGetEndpoints = (app) => {
const routes = [];
app._router.stack.forEach((middleware) => {
if (middleware.route && middleware.route.methods.get) {
routes.push(middleware.route.path);
}
});
return routes;
};

//━━━━━━━━━━━━━━━[ App Configuration ]━━━━━━━━━━━━━━━━━//
app.set("port", process.env.PORT || 80);

//━━━━━━━━━━━━━━━[ Middleware ]━━━━━━━━━━━━━━━━━//
app.enable('trust proxy');
app.set("json spaces", 2);

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'views/assets')));
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//━━━━━━━━━━━━━━━[ Morgan Logging for Specific Routes ]━━━━━━━━━━━━━━━━━//
let requestCount = 100;

// Morgan hanya untuk route '/' dan '/api'
app.use((req, res, next) => {
if (req.originalUrl === "/" || req.originalUrl.startsWith("/api")) {
morgan("dev")(req, res, next);
} else {
next();
}
});
const logs=[]


//━━━━━━━━━━━━━━━[ Routes ]━━━━━━━━━━━━━━━━━//

app.use("/api", apiRoutes);
const menuItems = JSON.parse(fs.readFileSync(path.join(__dirname, 'menu.json'), 'utf8'));


app.get("/", async (req, res) => {
let uptime=os.uptime(),hours=(uptime/3600).toFixed(1)
let cpu=process.cpuUsage().user/10000
let ram={used:Math.round(process.memoryUsage().rss/1024/1024),total:Math.round(os.totalmem()/1024/1024)}
let system={cpu:cpu.toFixed(2),ram,platform:os.platform(),arch:os.arch(),node:process.version}
let battery={level:80,charging:true} // contoh dummy, kalau butuh real client-side pakai JS
let runtime={uptime:`${Math.floor(uptime/60)} mins`,hours}
res.render('index', { logs, status:'Online', total_request: requestCount, endpoint_total: getFeatureList(app).length, system,battery,runtime,logs});
});

// Total request counter
app.use((req, res, next) => {
logs.unshift({method:req.method,path:req.path,time:new Date().toLocaleString()})
if(logs.length>10)logs.pop()
requestCount++;
next();
});

//━━━━━━━━━━━━━━━[ 404 Route ]━━━━━━━━━━━━━━━━━//
app.use((req, res, next) => {
res.status(404).render('404');
});

//━━━━━━━━━━━━━━━[ Server Initialization ]━━━━━━━━━━━━━━━━━//


app.listen(app.get("port"), async() => {
console.log("Server Running On http://localhost:", app.get('port'))
});




