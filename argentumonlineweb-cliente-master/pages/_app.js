import App from "next/app";
import React from "react";
import withZustandStore from "../lib/with-zustand-store";
import Head from "../components/Head";

// Importaciones de estilos globales
import "../styles/style.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { config as configFA } from "@fortawesome/fontawesome-svg-core";
configFA.autoAddCss = false;

import { fetchUrl } from "../config/utils";

class MyApp extends App {
    static async getInitialProps(appContext) {
        const { Component, ctx } = appContext;
        let pageProps = {};

        if (Component && Component.getInitialProps) {
            try {
                pageProps = await Component.getInitialProps(ctx) || {};
            } catch (e) {
                console.error("Error en getInitialProps:", e);
                pageProps = {};
            }
        }

        let account = {};

        if (ctx && ctx.req) {
            try {
                const res = await fetchUrl("/checkuserlogged", {
                    credentials: "include",
                    headers: { cookie: ctx.req.headers.cookie || "" }
                });

                if (res && typeof res === 'object') {
                    account = { logged: !!res.logged, user: res.user || null };
                }

                if (ctx.req.url === "/createCharacter" && !account.logged && ctx.res) {
                    ctx.res.writeHead(302, { Location: "/register" });
                    ctx.res.end();
                    return { pageProps: {} };
                }
            } catch (err) {
                account = {};
            }
        }

        return { 
            pageProps, 
            account 
        };
    }

    render() {
        const { Component, pageProps, account } = this.props;
        return (
            <React.Fragment>
                <Head />
                <Component {...pageProps} account={account} />
            </React.Fragment>
        );
    }
}

export default withZustandStore(MyApp);