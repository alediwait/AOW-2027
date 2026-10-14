import App from "next/app";
import React from "react";
import withZustandStore from "../lib/with-zustand-store";
import Head from "../components/Head";

// Importaciones de estilos globales
import './home/style.scss';
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/style.scss";
import './register/style.scss';
import './ranking/style.scss'; 
import './play/style.scss';
import './createCharacter/style.scss';

import { config as configFA } from "@fortawesome/fontawesome-svg-core";
configFA.autoAddCss = false;

import { fetchUrl } from "../config/utils";

class MyApp extends App {
    static async getInitialProps(appContext) {
        const { Component, ctx } = appContext;
        let pageProps = {};

        // 1. Ejecutamos getInitialProps de la página si existe
        if (Component && Component.getInitialProps) {
            try {
                pageProps = await Component.getInitialProps(ctx);
            } catch (e) {
                console.error("Error en getInitialProps:", e);
            }
        }

        let account = {};

        // 2. Verificamos la sesión del usuario de forma segura en el servidor
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

        // 3. Retornamos únicamente un objeto plano con pageProps y account.
        // Nunca devolvemos Component, router ni referencias circulares.
        return { 
            pageProps: pageProps || {}, 
            account 
        };
    }

    render() {
        const { Component, pageProps } = this.props;
        return (
            <React.Fragment>
                <Head />
                <Component {...pageProps} />
            </React.Fragment>
        );
    }
}

// RESTAURAMOS EL HOC para que inyecte el <Provider> del store global requerido por Connect(Home)
export default withZustandStore(MyApp);