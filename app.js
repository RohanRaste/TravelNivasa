    if (process.env.NODE_ENV != "production") {
        require("dotenv").config();
    }

    const express = require("express");
    const app = express();
    const mongoose = require("mongoose");
    const flash = require("connect-flash");
    const passport = require("passport");
    const LocalStrategy = require("passport-local");
    const session = require("express-session");
    const MongoStore = require("connect-mongo").default;
    const path = require("path");
    const methodOverride = require("method-override");
    const ejsMate = require("ejs-mate");
    const User = require("./models/user.js");
    const listingRouter = require("./routes/listings.js");
    const reviewRouter = require("./routes/reviews.js");
    const userRouter = require("./routes/user.js");
    const { saveRedirectUrl } = require("./middleware.js");
    const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/Nivasa";
    const secret = process.env.SECRET || "mysupersecretcode";
    const port = process.env.PORT || 8080;
    const isProduction = process.env.NODE_ENV === "production";

    const store = MongoStore.create({
        mongoUrl: dbUrl,
        crypto: {
            secret,
        },
        touchAfter: 24 * 3600,
    });

    store.on("error", (err) => {
        console.log("ERROR IN MONGO SESSION STORE", err);
    });

    const sessionOptions = {
        store,
        secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
            secure: isProduction,
        },
    };

    if (isProduction) {
        app.set("trust proxy", 1);
    }

    app.set("view engine" , "ejs");
    app.set("views" , path.join(__dirname ,"views"));
    app.use(express.urlencoded({extended :true}));
    app.use(methodOverride("_method"));
    app.use(session(sessionOptions));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.engine("ejs", ejsMate);
    app.use(express.static(path.join(__dirname,"/public")));
   

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    async function main() {
        await mongoose.connect(dbUrl);
    }

    app.use((req, res, next) => {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.currUser = req.user;
        next();
    });

    app.get("/", (req,res)=>{
        res.render("listings/home.ejs");
    })

    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use(saveRedirectUrl);
    app.use("/", userRouter);

    app.use((err, req, res, next) => {
        const { statusCode = 500, message = "Something went wrong." } = err;
        res.status(statusCode).render("listings/error.ejs", { err, message });
    });

    main()
    .then(() => {
        console.log("connected to database ");
        app.listen(port, () => {
            console.log(`server is listening to port ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
