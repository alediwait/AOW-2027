require("dotenv").config();

const express = require("express");
const next = require("next");

// Un rechazo no manejado (p.ej. DB caída a mitad de un request) no debe
// derribar todo el proceso en desarrollo.
process.on("unhandledRejection", err => {
    console.error("[unhandledRejection]", (err && err.message) || err);
});

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const urls = require("./config/urls.json");
const compression = require("compression");

const passport = require("passport"),
    passportConfig = require("./server/passport"),
    flash = require("express-flash"),
    cookieParser = require("cookie-parser"),
    cookieSession = require("cookie-session"),
    session = require("express-session"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    routes = require("./server/routes");

// Configuración de CORS segura
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map(origin => origin.trim());

// Conexión a MongoDB usando variable de entorno.
// No derribar el proceso si Mongo está caído: los endpoints fallan
// por request pero el servidor sigue arriba para reintentar.
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/aoweb";
mongoose
    .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .catch(err => {
        console.error(`[MongoDB] No se pudo conectar a ${mongoUri}:`, err.message);
    });

mongoose.connection.on("error", err => {
    console.error("[MongoDB] Error de conexión:", err.message);
});

const robotsOptions = {
    root: __dirname + "/public/static/",
    headers: {
        "Content-Type": "text/plain; charset=UTF-8"
    }
};

app.prepare().then(() => {
    const server = express();

    server.use(compression());

    // CORS seguro - solo orígenes permitidos
    server.use(
        require("cors")({
            origin: function(origin, callback) {
                // Permitir requests sin origen (como apps móviles o curl)
                if (!origin) return callback(null, true);
                if (allowedOrigins.indexOf(origin) !== -1) {
                    callback(null, true);
                } else {
                    callback(new Error("No permitido por CORS"));
                }
            },
            credentials: true
        })
    );

    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    server.use(flash());

    server.use(cookieParser());
    server.use(
        cookieSession({
            name: "session",
            keys: [process.env.SESSION_SECRET || "dev-secret-key"],
            domain: !dev ? (process.env.COOKIE_DOMAIN || "argentumonlineweb.com") : "",
            maxAge: 24 * 60 * 60 * 1000 * 7,
            httpOnly: true,
            secure: !dev,
            sameSite: "lax"
        })
    );

    server.use(passport.initialize());
    server.use(passport.session());

    server.get("/robots.txt", (req, res) =>
        res.status(200).sendFile("robots.txt", robotsOptions)
    );

    routes(server);

    Object.keys(urls).map(function(url, index) {
        const href = urls[url];

        server.get(url, (req, res) => {
            return app.render(req, res, href, req.query, req.params);
        });
    });

    server.get("*", (req, res) => {
        return handle(req, res);
    });

    server.listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
        console.log(`> Environment: ${process.env.NODE_ENV || "development"}`);
    });
});
